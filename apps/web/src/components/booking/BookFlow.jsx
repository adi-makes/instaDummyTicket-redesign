"use client";

import {useEffect, useMemo, useRef, useState} from "react";
import Image from "next/image";
import {Check, ChevronLeft, ChevronUp, Clock3, LockKeyhole, Minus, Plane, Plus, ShieldCheck, Tag, X} from "lucide-react";
import Hero from "@/components/sections/Hero";

const STORAGE_KEY = "instaDummyTicket.bookingSearch";
const FLIGHT_LOADING_DELAY_MS = 750;

const fallbackSearch = {
  tripType: "round",
  from: "Delhi (DEL)",
  to: "Dubai (DXB)",
  departure: new Date("2026-06-27T00:00:00.000Z").toISOString(),
  returnDate: new Date("2026-06-30T00:00:00.000Z").toISOString(),
};

const flightOptions = [
  {
    id: "emirates-reference",
    airline: "Emirates",
    logo: "/images/airlineLogos/Emirates_logo.png",
    code: "EK 511",
    onward: {
      departTime: "11:00",
      arriveTime: "13:00",
      fromCode: "DEL",
      fromCity: "Delhi",
      toCode: "DXB",
      toCity: "Dubai",
      duration: "3h 30m",
      stops: "Nonstop",
    },
    return: {
      departTime: "09:50",
      arriveTime: "14:45",
      fromCode: "DXB",
      fromCity: "Dubai",
      toCode: "DEL",
      toCity: "Delhi",
      duration: "3h 25m",
      stops: "Nonstop",
      code: "EK 516",
    },
  },
  {
    id: "emirates-midday",
    airline: "Emirates",
    logo: "/images/airlineLogos/Emirates_logo.png",
    code: "EK 515",
    onward: {
      departTime: "21:50",
      arriveTime: "00:10",
      fromCode: "DEL",
      fromCity: "Delhi",
      toCode: "DXB",
      toCity: "Dubai",
      duration: "3h 50m",
      stops: "Non stop",
    },
    return: {
      departTime: "09:45",
      arriveTime: "14:25",
      fromCode: "DXB",
      fromCity: "Dubai",
      toCode: "DEL",
      toCity: "Delhi",
      duration: "3h 10m",
      stops: "Non stop",
      code: "EK 516",
    },
  },
  {
    id: "airindia-morning",
    airline: "Air India",
    logo: "/images/airlineLogos/air_india_logo.png",
    code: "AI 995",
    onward: {
      departTime: "10:45",
      arriveTime: "13:05",
      fromCode: "DEL",
      fromCity: "Delhi",
      toCode: "DXB",
      toCity: "Dubai",
      duration: "3h 50m",
      stops: "Non stop",
    },
    return: {
      departTime: "00:15",
      arriveTime: "04:55",
      fromCode: "DXB",
      fromCity: "Dubai",
      toCode: "DEL",
      toCity: "Delhi",
      duration: "3h 10m",
      stops: "Non stop",
      code: "AI 996",
    },
  },
];

function formatDate(value) {
  if (!value) return "";
  return new Date(value).toLocaleDateString("en-GB", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

function passengerLabel(count, singular, plural) {
  return `${count} ${count === 1 ? singular : plural}`;
}

const EMAIL_DOMAIN_CORRECTIONS = {
  "gmai.com": "gmail.com",
  "gmail.con": "gmail.com",
  "gmail.co": "gmail.com",
  "gmail.cm": "gmail.com",
  "gmial.com": "gmail.com",
  "gmal.com": "gmail.com",
  "gnail.com": "gmail.com",
  "hotmial.com": "hotmail.com",
  "hotmai.com": "hotmail.com",
  "hotmail.con": "hotmail.com",
  "outlok.com": "outlook.com",
  "outlook.con": "outlook.com",
  "yaho.com": "yahoo.com",
  "yahoo.con": "yahoo.com",
  "yahho.com": "yahoo.com",
};

function getEmailSuggestion(email) {
  const trimmed = email.trim();
  const atIndex = trimmed.lastIndexOf("@");
  if (atIndex <= 0 || atIndex === trimmed.length - 1) return null;

  const local = trimmed.slice(0, atIndex);
  const domain = trimmed.slice(atIndex + 1).toLowerCase();
  const correctedDomain = EMAIL_DOMAIN_CORRECTIONS[domain];
  if (!correctedDomain) return null;

  return `${local}@${correctedDomain}`;
}

function ProgressSteps({step, onBack}) {
  const items = [1, 2, 3];

  return (
    <div className="border-b border-[color:var(--color-line-soft)] bg-[color:var(--color-surface)]">
      <div className="container-max relative flex h-16 items-center">
        <button
          type="button"
          onClick={onBack}
          className="absolute left-0 z-10 flex h-10 w-10 items-center justify-center rounded-full text-[color:var(--color-muted)] transition-colors hover:bg-[color:var(--color-surface-muted)] hover:text-[color:var(--color-primary)]"
          aria-label="Go back"
        >
          <ChevronLeft size={22} aria-hidden="true" />
        </button>

        <div className="absolute inset-0 flex items-center justify-center">
          {items.map((item, index) => {
            const complete = item < step;
            const active = item === step;
            return (
              <div key={item} className="flex items-center">
                <span
                  className={[
                    "grid h-8 w-8 place-items-center rounded-full text-sm font-bold",
                    complete || active
                      ? "bg-[color:var(--color-primary)] text-[color:var(--color-text-on-dark)]"
                      : "bg-[color:var(--color-surface-muted)] text-[color:var(--color-subtle)]",
                  ].join(" ")}
                  aria-current={active ? "step" : undefined}
                >
                  {complete ? <Check size={17} aria-hidden="true" /> : item}
                </span>
                {index < items.length - 1 ? (
                  <span
                    className={[
                      "mx-3 h-0.5 w-12 sm:w-20",
                      item < step ? "bg-[color:var(--color-primary)]" : "bg-[color:var(--color-line-soft)]",
                    ].join(" ")}
                    aria-hidden="true"
                  />
                ) : null}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

function Segment({label, flight, airline, logo, date, code}) {
  return (
    <div className="border-b border-[color:var(--color-line-soft)] px-4 py-5 last:border-b-0">
      <div className="mb-5 flex min-w-0 items-center gap-2">
        <span className="flex h-5 w-12 shrink-0 items-center justify-start">
          <Image src={logo} alt="" width={48} height={18} className="h-auto max-h-5 w-auto max-w-12 object-contain" />
        </span>
        <span className="min-w-0 truncate font-body text-sm font-bold leading-none text-[color:var(--color-ink)]">
          {airline}
        </span>
        <span className="shrink-0 text-xs font-medium leading-none text-[color:var(--color-muted)]">{code}</span>
        <span className="ml-auto shrink-0 bg-[color:var(--color-surface-muted)] px-3 py-2 text-xs font-bold uppercase leading-none text-[color:var(--color-muted)]">
          {label}
        </span>
      </div>

      <div className="grid grid-cols-[minmax(0,1fr)_5rem_minmax(0,1fr)] items-start gap-2">
        <div className="min-w-0">
          <p className="font-body text-[22px] font-bold leading-none text-[color:var(--color-ink)]">{flight.departTime}</p>
          <p className="mt-2 font-body text-sm font-bold leading-none text-[color:var(--color-ink)]">{flight.fromCity}</p>
          <p className="mt-1 text-sm font-medium leading-none text-[color:var(--color-muted)]">{flight.fromCode}</p>
          <p className="mt-2 text-xs font-medium leading-none text-[color:var(--color-muted)]">{date}</p>
        </div>

        <div className="grid justify-items-center pt-7 text-center">
          <Plane size={18} strokeWidth={2.4} className="mb-2 rotate-45 text-[color:var(--color-muted)]" aria-hidden="true" />
          <span className="text-xs font-medium leading-none text-[color:var(--color-muted)]">{flight.duration}</span>
        </div>

        <div className="min-w-0 text-right">
          <p className="font-body text-[22px] font-bold leading-none text-[color:var(--color-ink)]">{flight.arriveTime}</p>
          <p className="mt-2 font-body text-sm font-bold leading-none text-[color:var(--color-ink)]">{flight.toCity}</p>
          <p className="mt-1 text-sm font-medium leading-none text-[color:var(--color-muted)]">{flight.toCode}</p>
          <p className="mt-2 text-xs font-medium leading-none text-[color:var(--color-muted)]">{date}</p>
        </div>
      </div>
    </div>
  );
}

function FlightCard({option, search, onSelect, isSelected}) {
  return (
    <button
      type="button"
      onClick={onSelect}
      className={[
        "block w-full border bg-white text-left text-[color:var(--color-text-on-card)] transition-colors hover:border-[color:var(--color-primary)] hover:bg-[color:var(--color-surface)]",
        isSelected ? "border-[color:var(--color-primary)]" : "border-[color:var(--color-line)]",
      ].join(" ")}
    >
      <span className="block">
        <Segment label="Onward" flight={option.onward} airline={option.airline} logo={option.logo} date={formatDate(search.departure)} code={option.code} />
        {search.tripType === "round" ? (
          <Segment label="Return" flight={option.return} airline={option.airline} logo={option.logo} date={formatDate(search.returnDate)} code={option.return.code} />
        ) : null}
      </span>
    </button>
  );
}

function FlightList({search, onSelect, selectedFlightId}) {
  return (
    <section className="container-max grid gap-6 py-8 sm:py-10">
      <div className="mx-auto w-full max-w-[560px] text-left">
        <h1 className="font-display text-3xl font-bold leading-tight text-[color:var(--color-ink)] sm:text-4xl">
          Select your flight
        </h1>
      </div>

      <div className="mx-auto grid w-full max-w-[560px] gap-5">
        {flightOptions.map((option) => (
          <FlightCard
            key={option.id}
            option={option}
            search={search}
            isSelected={selectedFlightId === option.id}
            onSelect={() => onSelect(option)}
          />
        ))}
      </div>
    </section>
  );
}

function SkeletonLine({className}) {
  return <span className={["block rounded bg-[color:var(--color-line-soft)]", className].join(" ")} />;
}

function LoadingSegmentSkeleton() {
  return (
    <div className="border-b border-[color:var(--color-line-soft)] px-4 py-5 last:border-b-0">
      <div className="mb-5 flex items-center gap-2">
        <SkeletonLine className="h-5 w-12" />
        <SkeletonLine className="h-4 w-24" />
        <SkeletonLine className="h-4 w-12" />
        <SkeletonLine className="ml-auto h-8 w-20" />
      </div>

      <div className="grid grid-cols-[minmax(0,1fr)_5rem_minmax(0,1fr)] items-start gap-2">
        <div>
          <SkeletonLine className="h-7 w-16" />
          <SkeletonLine className="mt-3 h-4 w-14" />
          <SkeletonLine className="mt-2 h-4 w-10" />
          <SkeletonLine className="mt-3 h-3 w-20" />
        </div>

        <div className="grid justify-items-center pt-7">
          <SkeletonLine className="h-5 w-5" />
          <SkeletonLine className="mt-3 h-3 w-14" />
        </div>

        <div className="grid justify-items-end">
          <SkeletonLine className="h-7 w-16" />
          <SkeletonLine className="mt-3 h-4 w-14" />
          <SkeletonLine className="mt-2 h-4 w-10" />
          <SkeletonLine className="mt-3 h-3 w-20" />
        </div>
      </div>
    </div>
  );
}

function LoadingFlightCard() {
  return (
    <div className="w-full border border-[color:var(--color-line)] bg-white">
      <LoadingSegmentSkeleton />
      <LoadingSegmentSkeleton />
    </div>
  );
}

function LoadingFlightList() {
  return (
    <section className="container-max grid gap-6 py-8 sm:py-10" aria-live="polite" aria-busy="true">
      <div className="mx-auto w-full max-w-[560px] text-left">
        <h1 className="font-display text-3xl font-bold leading-tight text-[color:var(--color-ink)] sm:text-4xl">
          Select your flight
        </h1>
      </div>

      <div className="mx-auto grid w-full max-w-[560px] gap-5 animate-pulse">
        <LoadingFlightCard />
        <LoadingFlightCard />
      </div>
    </section>
  );
}

function PassengerCounter({label, value, min = 0, onChange}) {
  return (
    <div className="mx-auto grid w-full max-w-[280px] grid-cols-[52px_minmax(0,1fr)_52px] border border-[color:var(--color-line)] bg-white">
      <button
        type="button"
        onClick={() => onChange(Math.max(min, value - 1))}
        disabled={value <= min}
        className="grid h-10 place-items-center border-r border-[color:var(--color-line)] text-[color:var(--color-muted)] transition-colors hover:bg-[color:var(--color-surface-muted)] disabled:cursor-not-allowed disabled:opacity-35"
        aria-label={`Decrease ${label}`}
      >
        <Minus size={18} strokeWidth={2.4} aria-hidden="true" />
      </button>
      <div className="grid h-10 place-items-center px-3 text-sm font-medium text-[color:var(--color-muted)]">
        {label}
      </div>
      <button
        type="button"
        onClick={() => onChange(value + 1)}
        className="grid h-10 place-items-center border-l border-[color:var(--color-line)] text-[color:var(--color-muted)] transition-colors hover:bg-[color:var(--color-surface-muted)]"
        aria-label={`Increase ${label}`}
      >
        <Plus size={18} strokeWidth={2.4} aria-hidden="true" />
      </button>
    </div>
  );
}

function TextField({label, placeholder = "Peter", type = "text", value, onChange, children}) {
  return (
    <label className="block">
      <span className="mb-3 block font-body text-base font-bold leading-tight text-[color:var(--color-ink)]">
        {label}
      </span>
      <input
        type={type}
        placeholder={placeholder}
        value={value}
        onChange={onChange}
        className="h-14 w-full border border-[color:var(--color-line)] bg-white px-5 text-base font-medium text-[color:var(--color-ink)] outline-none transition-colors placeholder:text-[color:var(--color-line)] focus:border-[color:var(--color-primary)]"
      />
      {children}
    </label>
  );
}

function ItinerarySummarySegment({label, flight, airline, logo, date, code}) {
  return (
    <div className="border border-[color:var(--color-line)] bg-white px-4 py-4">
      <div className="mb-5 flex min-w-0 items-center gap-2">
        <span className="flex h-5 w-12 shrink-0 items-center justify-start">
          <Image src={logo} alt="" width={48} height={18} className="h-auto max-h-5 w-auto max-w-12 object-contain" />
        </span>
        <span className="min-w-0 truncate font-body text-sm font-bold leading-none text-[color:var(--color-ink)]">
          {airline}
        </span>
        <span className="shrink-0 text-xs font-medium leading-none text-[color:var(--color-muted)]">{code}</span>
        <span className="ml-auto shrink-0 bg-[color:var(--color-surface-muted)] px-3 py-2 text-xs font-bold uppercase leading-none text-[color:var(--color-muted)]">
          {label}
        </span>
      </div>

      <div className="grid grid-cols-[minmax(0,1fr)_auto_minmax(0,1fr)] items-center gap-3">
        <div className="min-w-0 text-left">
          <p className="font-body text-[22px] font-bold leading-none text-[color:var(--color-ink)]">{flight.departTime}</p>
          <p className="mt-2 font-body text-base font-bold leading-none text-[color:var(--color-ink)]">{flight.fromCode}</p>
        </div>

        <div className="min-w-0 px-4 py-2 text-center">
          <p className="whitespace-nowrap text-xs font-bold leading-tight text-[color:var(--color-ink)]">{date}</p>
          <p className="mt-1 inline-flex items-center justify-center gap-1 whitespace-nowrap text-xs font-semibold leading-tight text-[color:var(--color-muted)]">
            <Clock3 size={12} strokeWidth={2.2} aria-hidden="true" />
            {flight.duration}
          </p>
        </div>

        <div className="min-w-0 text-right">
          <p className="font-body text-[22px] font-bold leading-none text-[color:var(--color-ink)]">{flight.arriveTime}</p>
          <p className="mt-2 font-body text-base font-bold leading-none text-[color:var(--color-ink)]">{flight.toCode}</p>
        </div>
      </div>
    </div>
  );
}

function OrderDetailsFlightSegment({label, flight, airline, logo, date, code}) {
  return (
    <div className="border border-[color:var(--color-line)] bg-white px-4 py-4">
      <div className="mb-5 flex min-w-0 items-center gap-2">
        <span className="flex h-5 w-12 shrink-0 items-center justify-start">
          <Image src={logo} alt="" width={48} height={18} className="h-auto max-h-5 w-auto max-w-12 object-contain" />
        </span>
        <span className="min-w-0 truncate font-body text-sm font-bold leading-none text-[color:var(--color-ink)]">
          {airline}
        </span>
        <span className="shrink-0 text-xs font-medium leading-none text-[color:var(--color-muted)]">{code}</span>
        <span className="ml-auto shrink-0 bg-[color:var(--color-surface-muted)] px-3 py-2 text-xs font-bold uppercase leading-none text-[color:var(--color-muted)]">
          {label}
        </span>
      </div>

      <div className="grid grid-cols-[minmax(0,1fr)_auto_minmax(0,1fr)] items-center gap-3">
        <div className="min-w-0 text-left">
          <p className="font-body text-[22px] font-bold leading-none text-[color:var(--color-ink)]">{flight.departTime}</p>
          <p className="mt-3 font-body text-base font-bold leading-none text-[color:var(--color-ink)]">{flight.fromCode}</p>
        </div>

        <div className="min-w-0 border border-[color:var(--color-line)] px-4 py-2 text-center">
          <p className="whitespace-nowrap text-xs font-bold leading-tight text-[color:var(--color-ink)]">{date}</p>
          <p className="mt-1 whitespace-nowrap text-xs font-semibold leading-tight text-[color:var(--color-muted)]">{flight.duration}</p>
        </div>

        <div className="min-w-0 text-right">
          <p className="font-body text-[22px] font-bold leading-none text-[color:var(--color-ink)]">{flight.arriveTime}</p>
          <p className="mt-3 font-body text-base font-bold leading-none text-[color:var(--color-ink)]">{flight.toCode}</p>
        </div>
      </div>
    </div>
  );
}

function OrderDetailsOverlay({flight, search, adults, childrenCount, total, onClose}) {
  const travelerCount = adults + childrenCount;
  const travelers = Array.from({length: travelerCount}, (_, index) => `Traveler ${index + 1}`);
  const tripLabel = search.tripType === "round" ? "Round Trip" : "One Way";

  return (
    <div className="fixed inset-0 z-[70] overflow-y-auto bg-[color:var(--color-surface-muted)]">
      <div className="container-max min-h-dvh py-4">
        <div className="mx-auto w-full max-w-[560px]">
          <div className="mb-4 flex min-h-10 items-center justify-between gap-4">
            <h1 className="font-display text-2xl font-bold leading-tight text-[color:var(--color-ink)]">
              Order Details
            </h1>
            <button
              type="button"
              onClick={onClose}
              className="grid h-10 w-10 place-items-center text-[color:var(--color-primary)]"
              aria-label="Close order details"
            >
              <X size={22} aria-hidden="true" />
            </button>
          </div>

          <div className="border border-[color:var(--color-line)] bg-white">
            <div className="grid gap-3 p-4">
              <OrderDetailsFlightSegment
                label="Onward"
                flight={flight.onward}
                airline={flight.airline}
                logo={flight.logo}
                date={formatDate(search.departure)}
                code={flight.code}
              />
              {search.tripType === "round" ? (
                <OrderDetailsFlightSegment
                  label="Return"
                  flight={flight.return}
                  airline={flight.airline}
                  logo={flight.logo}
                  date={formatDate(search.returnDate)}
                  code={flight.return.code}
                />
              ) : null}
            </div>

            <div className="border-t border-[color:var(--color-line-soft)] px-5 py-5">
              <p className="text-[11px] font-bold uppercase leading-none text-[color:var(--color-subtle)]">Travelers</p>
              <div className="mt-4 grid gap-2">
                {travelers.map((traveler) => (
                  <p key={traveler} className="text-sm font-semibold leading-tight text-[color:var(--color-primary)]">
                    {traveler}
                  </p>
                ))}
              </div>
            </div>

            <div className="border-t border-[color:var(--color-line-soft)] px-5 py-5">
              <p className="text-[11px] font-bold uppercase leading-none text-[color:var(--color-subtle)]">Delivery</p>
              <p className="mt-4 text-sm font-semibold leading-tight text-[color:var(--color-primary)]">Instant</p>
            </div>

            <div className="border-t border-[color:var(--color-line-soft)] px-5 py-5">
              <p className="text-[11px] font-bold uppercase leading-none text-[color:var(--color-subtle)]">Price breakdown</p>
              <div className="mt-4 grid gap-3">
                <div className="flex items-center justify-between gap-4 text-sm">
                  <span className="text-[color:var(--color-muted)]">Flight reservation</span>
                  <span className="font-semibold text-[color:var(--color-muted)]">${total}</span>
                </div>
                <div className="flex items-center justify-between gap-4 text-sm">
                  <span className="text-[color:var(--color-subtle)]">{tripLabel}</span>
                  <span className="font-semibold text-[color:var(--color-subtle)]">Included</span>
                </div>
              </div>

              <div className="mt-5">
                <div className="mb-3 flex items-center gap-2 font-body text-base font-bold text-[color:var(--color-ink)]">
                  <Tag size={17} aria-hidden="true" />
                  Apply Coupon Code
                </div>
                <button type="button" className="flex h-11 w-full items-center justify-center gap-2 border border-[color:var(--color-primary)] bg-white font-body text-sm font-bold text-[color:var(--color-primary)]">
                  <Tag size={16} aria-hidden="true" />
                  Apply Coupon Code
                </button>
              </div>

              <div className="mt-7 flex items-center justify-between gap-4">
                <span className="font-body text-xl font-bold text-[color:var(--color-ink)]">Total</span>
                <span className="font-body text-xl font-bold text-[color:var(--color-primary)]">${total}</span>
              </div>
            </div>
          </div>

          <div className="mt-3 grid grid-cols-2 gap-2">
            <div className="flex min-h-12 items-center justify-center gap-2 border border-[color:var(--color-line)] bg-white px-3 text-sm font-semibold text-[color:var(--color-primary)]">
              <ShieldCheck size={20} className="text-[color:var(--color-accent)]" aria-hidden="true" />
              Secure Payment
            </div>
            <div className="flex min-h-12 items-center justify-center gap-2 border border-[color:var(--color-line)] bg-white px-3 text-sm font-semibold text-[#5b50ff]">
              <LockKeyhole size={19} aria-hidden="true" />
              Stripe Verified
            </div>
          </div>
          <p className="mt-3 text-center text-xs font-medium text-[color:var(--color-subtle)]">
            Your payment is encrypted and securely processed by Stripe
          </p>
        </div>
      </div>
    </div>
  );
}

function PassengerDetailsStep({flight, search}) {
  const [adults, setAdults] = useState(1);
  const [children, setChildren] = useState(0);
  const [orderDetailsOpen, setOrderDetailsOpen] = useState(false);
  const [email, setEmail] = useState("");
  const totalPassengers = adults + children;
  const total = totalPassengers * 20;
  const emailSuggestion = getEmailSuggestion(email);

  useEffect(() => {
    if (!orderDetailsOpen) return undefined;
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = previousOverflow;
    };
  }, [orderDetailsOpen]);

  return (
    <section className="container-max pb-28 pt-7 sm:pt-10">
      <div className="mx-auto grid w-full max-w-[560px] gap-7">
        <div className="grid gap-4">
          <ItinerarySummarySegment
            label="Onward"
            flight={flight.onward}
            airline={flight.airline}
            logo={flight.logo}
            date={formatDate(search.departure)}
            code={flight.code}
          />
          {search.tripType === "round" ? (
            <ItinerarySummarySegment
              label="Return"
              flight={flight.return}
              airline={flight.airline}
              logo={flight.logo}
              date={formatDate(search.returnDate)}
              code={flight.return.code}
            />
          ) : null}
        </div>

        <div className="grid justify-items-center gap-4 py-1">
          <PassengerCounter
            label={passengerLabel(adults, "Adult", "Adults")}
            value={adults}
            min={1}
            onChange={setAdults}
          />
          <PassengerCounter
            label={passengerLabel(children, "Child", "Children")}
            value={children}
            min={0}
            onChange={setChildren}
          />
        </div>

        <div className="grid gap-5">
          <TextField
            label="Email ID"
            placeholder="name@example.com"
            type="email"
            value={email}
            onChange={(event) => setEmail(event.target.value)}
          >
            {emailSuggestion ? (
              <button
                type="button"
                onClick={() => setEmail(emailSuggestion)}
                className="mt-2 block text-left text-sm font-semibold text-[color:var(--color-accent)]"
              >
                Did you mean: {emailSuggestion}
              </button>
            ) : null}
          </TextField>
          <TextField label="Your First Name" />
          <TextField label="Last Name" />

          {Array.from({length: Math.max(0, adults - 1)}, (_, index) => (
            <div key={`adult-${index + 2}`} className="grid gap-5 border-t border-[color:var(--color-line-soft)] pt-5">
              <TextField label={`Adult ${index + 2}: First Name`} />
              <TextField label={`Adult ${index + 2}: Last Name`} />
            </div>
          ))}

          {Array.from({length: children}, (_, index) => (
            <div key={`child-${index + 1}`} className="grid gap-5 border-t border-[color:var(--color-line-soft)] pt-5">
              <TextField label={`Child ${index + 1}: First Name`} />
              <TextField label={`Child ${index + 1}: Last Name`} />
            </div>
          ))}
        </div>
      </div>

      <div className="fixed inset-x-0 bottom-0 z-40 border-t border-[color:var(--color-line-soft)] bg-white">
        <div className="container-max flex min-h-20 items-center justify-between gap-4">
          <button
            type="button"
            onClick={() => setOrderDetailsOpen(true)}
            className="inline-flex items-center gap-1 text-left text-sm font-semibold text-[color:var(--color-primary)]"
          >
            Order details
            <ChevronUp size={15} aria-hidden="true" />
          </button>
          <button type="button" className="btn-secondary min-h-12 w-auto px-7 py-3 text-base">
            Pay ${total}
          </button>
        </div>
      </div>

      {orderDetailsOpen ? (
        <OrderDetailsOverlay
          flight={flight}
          search={search}
          adults={adults}
          childrenCount={children}
          total={total}
          onClose={() => setOrderDetailsOpen(false)}
        />
      ) : null}
    </section>
  );
}

export default function BookFlow() {
  const [step, setStep] = useState(1);
  const [search, setSearch] = useState(null);
  const [selectedFlight, setSelectedFlight] = useState(null);
  const [isBootingFromStoredSearch, setIsBootingFromStoredSearch] = useState(true);
  const [isFlightLoading, setIsFlightLoading] = useState(false);
  const advanceTimerRef = useRef(null);
  const flightLoadingTimerRef = useRef(null);

  function beginFlightLoading() {
    if (flightLoadingTimerRef.current) window.clearTimeout(flightLoadingTimerRef.current);
    setIsFlightLoading(true);
    flightLoadingTimerRef.current = window.setTimeout(() => {
      setIsFlightLoading(false);
      flightLoadingTimerRef.current = null;
    }, FLIGHT_LOADING_DELAY_MS);
  }

  useEffect(() => {
    const timer = window.setTimeout(() => {
      const raw = window.sessionStorage.getItem(STORAGE_KEY);
      if (!raw) {
        setIsBootingFromStoredSearch(false);
        return;
      }

      try {
        const parsed = JSON.parse(raw);
        setSearch(parsed);
        setStep(2);
        beginFlightLoading();
      } catch {
        window.sessionStorage.removeItem(STORAGE_KEY);
      } finally {
        setIsBootingFromStoredSearch(false);
      }
    }, 0);

    return () => window.clearTimeout(timer);
  }, []);

  useEffect(() => {
    return () => {
      if (advanceTimerRef.current) window.clearTimeout(advanceTimerRef.current);
      if (flightLoadingTimerRef.current) window.clearTimeout(flightLoadingTimerRef.current);
    };
  }, []);

  const activeSearch = useMemo(() => search || fallbackSearch, [search]);

  function handleSearchComplete(payload) {
    setSearch(payload);
    setSelectedFlight(null);
    window.sessionStorage.setItem(STORAGE_KEY, JSON.stringify(payload));
    setStep(2);
    beginFlightLoading();
  }

  function handleBack() {
    if (advanceTimerRef.current) {
      window.clearTimeout(advanceTimerRef.current);
      advanceTimerRef.current = null;
    }
    if (flightLoadingTimerRef.current) {
      window.clearTimeout(flightLoadingTimerRef.current);
      flightLoadingTimerRef.current = null;
    }
    setIsFlightLoading(false);
    if (step === 1) {
      window.history.back();
      return;
    }
    setStep((current) => Math.max(1, current - 1));
  }

  return (
    <main className="starter-page bg-[color:var(--color-surface-muted)]">
      <ProgressSteps step={isBootingFromStoredSearch ? 2 : step} onBack={handleBack} />

      {isBootingFromStoredSearch ? <LoadingFlightList /> : null}

      {step === 1 && !isBootingFromStoredSearch ? (
        <section className="py-8 sm:py-10">
          <Hero mode="form" initialData={search} onComplete={handleSearchComplete} />
        </section>
      ) : null}

      {step === 2 && !isBootingFromStoredSearch ? (
        isFlightLoading ? (
          <LoadingFlightList />
        ) : (
        <FlightList
          search={activeSearch}
          selectedFlightId={selectedFlight?.id}
          onSelect={(flight) => {
            setSelectedFlight(flight);
            if (advanceTimerRef.current) window.clearTimeout(advanceTimerRef.current);
            advanceTimerRef.current = window.setTimeout(() => {
              setStep(3);
              advanceTimerRef.current = null;
            }, 220);
          }}
        />
        )
      ) : null}

      {step === 3 ? (
        <PassengerDetailsStep flight={selectedFlight || flightOptions[0]} search={activeSearch} />
      ) : null}
    </main>
  );
}
