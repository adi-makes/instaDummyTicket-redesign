"use client";

import {useCallback, useEffect, useRef, useState} from "react";
import {createPortal} from "react-dom";
import {useParams, useRouter} from "next/navigation";
import {
  AlertCircle,
  CalendarDays,
  ChevronLeft,
  ChevronRight,
  Landmark,
  PlaneLanding,
  PlaneTakeoff,
  ShieldCheck,
  Star,
  TicketCheck,
  Zap,
  X,
} from "lucide-react";
import {localizedPath} from "@/i18n/routing";

const TODAY = new Date();
TODAY.setHours(0, 0, 0, 0);

const AIRPORTS = [
  {city: "New York", code: "JFK", name: "John F. Kennedy International Airport", country: "USA", flag: "us"},
  {city: "New York", code: "NYC", name: "New York Metropolitan Area", country: "USA", flag: "us"},
  {city: "Newcastle", code: "NTL", name: "Newcastle Airport", country: "Australia", flag: "au"},
  {city: "New Plymouth", code: "NPL", name: "New Plymouth Airport", country: "New Zealand", flag: "nz"},
  {city: "Newcastle", code: "NCL", name: "Newcastle International Airport", country: "United Kingdom", flag: "gb"},
  {city: "London", code: "LHR", name: "Heathrow Airport", country: "United Kingdom", flag: "gb"},
  {city: "Paris", code: "CDG", name: "Charles de Gaulle Airport", country: "France", flag: "fr"},
  {city: "Dubai", code: "DXB", name: "Dubai International Airport", country: "UAE", flag: "ae"},
  {city: "Singapore", code: "SIN", name: "Singapore Changi Airport", country: "Singapore", flag: "sg"},
  {city: "Tokyo", code: "HND", name: "Haneda Airport", country: "Japan", flag: "jp"},
  {city: "Frankfurt", code: "FRA", name: "Frankfurt Airport", country: "Germany", flag: "de"},
  {city: "Delhi", code: "DEL", name: "Indira Gandhi International Airport", country: "India", flag: "in"},
  {city: "Mumbai", code: "BOM", name: "Chhatrapati Shivaji Maharaj International Airport", country: "India", flag: "in"},
  {city: "Bengaluru", code: "BLR", name: "Kempegowda International Airport", country: "India", flag: "in"},
  {city: "Istanbul", code: "IST", name: "Istanbul Airport", country: "Turkey", flag: "tr"},
  {city: "Amsterdam", code: "AMS", name: "Amsterdam Airport Schiphol", country: "Netherlands", flag: "nl"},
  {city: "Hong Kong", code: "HKG", name: "Hong Kong International Airport", country: "Hong Kong", flag: "hk"},
  {city: "Bangkok", code: "BKK", name: "Suvarnabhumi Airport", country: "Thailand", flag: "th"},
  {city: "Sydney", code: "SYD", name: "Sydney Kingsford Smith Airport", country: "Australia", flag: "au"},
  {city: "Los Angeles", code: "LAX", name: "Los Angeles International Airport", country: "USA", flag: "us"},
  {city: "Chicago", code: "ORD", name: "O'Hare International Airport", country: "USA", flag: "us"},
  {city: "Toronto", code: "YYZ", name: "Toronto Pearson International Airport", country: "Canada", flag: "ca"},
  {city: "Madrid", code: "MAD", name: "Adolfo Suarez Madrid-Barajas Airport", country: "Spain", flag: "es"},
  {city: "Barcelona", code: "BCN", name: "Josep Tarradellas Barcelona-El Prat Airport", country: "Spain", flag: "es"},
  {city: "Rome", code: "FCO", name: "Leonardo da Vinci-Fiumicino Airport", country: "Italy", flag: "it"},
  {city: "Zurich", code: "ZRH", name: "Zurich Airport", country: "Switzerland", flag: "ch"},
  {city: "Doha", code: "DOH", name: "Hamad International Airport", country: "Qatar", flag: "qa"},
  {city: "Abu Dhabi", code: "AUH", name: "Zayed International Airport", country: "UAE", flag: "ae"},
  {city: "Kuala Lumpur", code: "KUL", name: "Kuala Lumpur International Airport", country: "Malaysia", flag: "my"},
  {city: "Seoul", code: "ICN", name: "Incheon International Airport", country: "South Korea", flag: "kr"},
  {city: "Colombo", code: "CMB", name: "Bandaranaike International Airport", country: "Sri Lanka", flag: "lk"},
  {city: "Muscat", code: "MCT", name: "Muscat International Airport", country: "Oman", flag: "om"},
];

const heroFeatureCards = [
  {title: "Live PNR", subtitle: "Verifiable", icon: TicketCheck},
  {title: "Embassy", subtitle: "Accepted", icon: Landmark},
  {title: "Secure &", subtitle: "Trusted", icon: ShieldCheck},
];

function fieldBorderStyle(error, focused) {
  return {
    borderColor: error
      ? "var(--color-danger)"
      : focused
        ? "var(--color-accent)"
        : "var(--color-line)",
  };
}

function AirportInput({value, onChange, label, placeholder, onBlur, dropdownAlign = "left"}) {
  const [open, setOpen] = useState(false);
  const wrapRef = useRef(null);

  useEffect(() => {
    function handleOutside(event) {
      if (wrapRef.current && !wrapRef.current.contains(event.target)) setOpen(false);
    }
    document.addEventListener("mousedown", handleOutside);
    return () => document.removeEventListener("mousedown", handleOutside);
  }, []);

  const query = value.trim().toLowerCase();
  const suggestions = query.length > 0
    ? AIRPORTS.filter((airport) =>
        airport.city.toLowerCase().includes(query) ||
        airport.code.toLowerCase().includes(query) ||
        airport.name.toLowerCase().includes(query) ||
        airport.country.toLowerCase().includes(query)
      ).slice(0, 4)
    : [];

  function pick(airport) {
    onChange(`${airport.city} (${airport.code})`);
    setOpen(false);
  }

  const dropdownPositionClass =
    dropdownAlign === "right"
      ? "sm:left-auto sm:right-[-1rem] sm:w-[min(26rem,calc(100vw-4rem))]"
      : "sm:left-[-2.625rem] sm:right-auto sm:w-[min(26rem,calc(100vw-4rem))]";

  return (
    <div ref={wrapRef} className="relative w-full">
      <input
        type="text"
        value={value}
        placeholder={placeholder}
        onChange={(event) => {
          onChange(event.target.value);
          setOpen(true);
        }}
        onFocus={() => setOpen(true)}
        onBlur={() => {
          setTimeout(() => onBlur && onBlur(), 150);
        }}
        aria-label={label}
        className="w-full bg-transparent pr-8 text-left text-base font-normal leading-6 tracking-normal text-[color:var(--color-muted)] outline-none placeholder:text-base placeholder:font-normal placeholder:leading-6 placeholder:tracking-normal placeholder:text-[color:var(--color-subtle)]"
        style={{fontFamily: "var(--font-reference)"}}
      />
      {value ? (
        <button
          type="button"
          aria-label={`Clear ${label}`}
          onMouseDown={(event) => {
            event.preventDefault();
            event.stopPropagation();
          }}
          onClick={() => {
            onChange("");
            setOpen(false);
          }}
          className="absolute right-0 top-1/2 flex h-6 w-6 -translate-y-1/2 items-center justify-center rounded-full text-[color:var(--color-text-muted-card)] transition-colors hover:bg-[color:var(--color-surface-muted)] hover:text-[color:var(--color-text-on-card)]"
        >
          <X size={14} aria-hidden="true" />
        </button>
      ) : null}
      {open && suggestions.length > 0 ? <span data-airport-open className="hidden" /> : null}
      {open && suggestions.length > 0 ? (
        <ul
          data-align={dropdownAlign}
          className={`airport-suggestions absolute left-[-2.625rem] right-[-1rem] top-[calc(100%+1.125rem)] z-40 max-h-56 divide-y divide-[color:var(--color-line-soft)] overflow-y-auto overflow-x-hidden rounded-[var(--radius-control)] border border-[color:var(--color-border-card)] bg-white sm:max-h-[17rem] ${dropdownPositionClass}`}
        >
          {suggestions.map((airport) => (
            <li key={airport.code}>
              <button
                type="button"
                onMouseDown={(event) => {
                  event.preventDefault();
                  pick(airport);
                }}
                className="grid w-full grid-cols-[minmax(0,1fr)_1.75rem] items-center gap-3 px-3 py-2.5 text-left transition-colors hover:bg-[color:var(--color-surface-muted)]"
              >
                <span className="min-w-0">
                  <span className="hidden min-w-0 sm:block">
                    <span className="flex min-w-0 items-baseline gap-2">
                      <span className="inline-flex shrink-0 items-center rounded-[3px] border border-[color:var(--color-line)] px-1 py-px font-mono text-xs font-semibold leading-4 text-[color:var(--color-muted)]">
                        {airport.code}
                      </span>
                      <span className="min-w-0 truncate text-sm font-medium leading-5 text-[color:var(--color-ink)]">
                        {airport.city}
                      </span>
                    </span>
                    <span className="mt-0.5 block text-xs font-normal leading-5 text-[color:var(--color-muted)]">
                      {airport.name}
                    </span>
                    <span className="block truncate text-xs font-normal leading-5 text-[color:var(--color-subtle)]">
                      {airport.country}
                    </span>
                  </span>

                  <span className="block min-w-0 sm:hidden">
                    <span className="flex min-w-0 items-baseline gap-2">
                      <span className="inline-flex shrink-0 items-center rounded-[3px] border border-[color:var(--color-line)] px-1 py-px font-mono text-xs font-semibold leading-4 text-[color:var(--color-muted)]">
                        {airport.code}
                      </span>
                      <span className="min-w-0 truncate text-sm font-medium leading-5 text-[color:var(--color-ink)]">
                        {airport.city}
                      </span>
                    </span>
                    <span className="mt-0.5 block text-xs font-normal leading-5 text-[color:var(--color-muted)]">
                      {airport.name}
                    </span>
                    <span className="block truncate text-xs font-normal leading-5 text-[color:var(--color-subtle)]">
                      {airport.country}
                    </span>
                  </span>
                </span>
                <span
                  className={`fi fi-${airport.flag} justify-self-end self-center text-base`}
                  aria-label={airport.country}
                  title={airport.country}
                />
              </button>
            </li>
          ))}
        </ul>
      ) : null}
    </div>
  );
}

function DatePicker({label, value, onChange, minDate, align = "left"}) {
  const [open, setOpen] = useState(false);
  const [popupVisible, setPopupVisible] = useState(false);
  const [popupClosing, setPopupClosing] = useState(false);
  const [popupStyle, setPopupStyle] = useState({});
  const [popupMode, setPopupMode] = useState("desktop");
  const [viewYear, setViewYear] = useState((minDate || TODAY).getFullYear());
  const [viewMonth, setViewMonth] = useState((minDate || TODAY).getMonth());
  const triggerRef = useRef(null);
  const popupRef = useRef(null);
  const closeTimerRef = useRef(null);
  const closePickerRef = useRef(() => {});

  const min = minDate instanceof Date ? minDate : TODAY;

  useEffect(() => {
    function handleOutside(event) {
      if (
        triggerRef.current &&
        !triggerRef.current.contains(event.target) &&
        popupRef.current &&
        !popupRef.current.contains(event.target)
      ) {
        closePickerRef.current();
      }
    }
    document.addEventListener("mousedown", handleOutside);
    return () => document.removeEventListener("mousedown", handleOutside);
  }, []);

  const closePicker = useCallback(() => {
    if (!open) return;

    if (popupMode === "mobile") {
      setPopupClosing(true);
      if (closeTimerRef.current) clearTimeout(closeTimerRef.current);
      closeTimerRef.current = setTimeout(() => {
        setOpen(false);
        setPopupVisible(false);
        setPopupClosing(false);
      }, 300);
      return;
    }

    setOpen(false);
  }, [open, popupMode]);

  useEffect(() => {
    closePickerRef.current = closePicker;
  }, [closePicker]);

  useEffect(() => {
    if (!open) return undefined;

    if (popupMode !== "mobile") {
      const frame = requestAnimationFrame(() => {
        setPopupVisible(true);
        setPopupClosing(false);
      });
      return () => cancelAnimationFrame(frame);
    }

    let showFrame = 0;
    const resetFrame = requestAnimationFrame(() => {
      setPopupClosing(false);
      setPopupVisible(false);
      showFrame = requestAnimationFrame(() => setPopupVisible(true));
    });
    return () => {
      cancelAnimationFrame(resetFrame);
      cancelAnimationFrame(showFrame);
    };
  }, [open, popupMode]);

  useEffect(() => {
    if (!open || popupMode !== "mobile") return undefined;
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = previousOverflow;
    };
  }, [open, popupMode]);

  useEffect(() => {
    return () => {
      if (closeTimerRef.current) clearTimeout(closeTimerRef.current);
    };
  }, []);

  function handleToggle() {
    if (open) {
      closePicker();
      return;
    }

    if (triggerRef.current) {
      if (closeTimerRef.current) clearTimeout(closeTimerRef.current);
      const rect = triggerRef.current.getBoundingClientRect();
      const isMobile = window.innerWidth < 640;
      const anchorRect = triggerRef.current.parentElement?.getBoundingClientRect() || rect;
      const popupWidth = 320;
      const desktopLeft = align === "right" ? anchorRect.right - popupWidth : anchorRect.left;
      const clampedDesktopLeft = Math.min(Math.max(desktopLeft, 12), window.innerWidth - popupWidth - 12);
      setPopupMode(isMobile ? "mobile" : "desktop");
      setPopupStyle(
        isMobile
          ? {position: "fixed", bottom: 0, left: 0, right: 0, zIndex: 9999}
          : {position: "fixed", top: anchorRect.bottom + 8, left: clampedDesktopLeft, zIndex: 9999}
      );
    }
    setOpen(true);
  }

  const daysInMonth = new Date(viewYear, viewMonth + 1, 0).getDate();
  const firstDay = new Date(viewYear, viewMonth, 1).getDay();
  const monthLabel = new Date(viewYear, viewMonth, 1).toLocaleString("default", {month: "long"});

  function prevMonth() {
    if (viewMonth === 0) {
      setViewMonth(11);
      setViewYear((year) => year - 1);
    } else {
      setViewMonth((month) => month - 1);
    }
  }

  function nextMonth() {
    if (viewMonth === 11) {
      setViewMonth(0);
      setViewYear((year) => year + 1);
    } else {
      setViewMonth((month) => month + 1);
    }
  }

  function selectDay(day) {
    const date = new Date(viewYear, viewMonth, day);
    if (date < min) return;
    onChange(date);
    closePicker();
  }

  const cells = Array(firstDay).fill(null).concat(Array.from({length: daysInMonth}, (_, index) => index + 1));
  const display = value ? value.toLocaleDateString("en-US", {weekday: "short", month: "short", day: "numeric"}) : null;
  const isMobilePopup = popupMode === "mobile";

  const popupPanel = open ? (
    <div
      ref={popupRef}
      style={popupStyle}
      className={
        isMobilePopup
          ? `max-h-[90vh] overflow-y-auto rounded-t-[var(--radius-control)] border-0 bg-white pb-20 transition-transform duration-300 ease-out ${
              popupVisible && !popupClosing ? "translate-y-0" : "translate-y-full"
            }`
          : "w-[320px] rounded-[var(--radius-control)] border border-[color:var(--color-border-card)] bg-white p-5"
      }
    >
      {isMobilePopup ? (
        <div className="flex items-center justify-between border-b border-slate-100 px-4 py-5">
          <h2 className="font-body text-base font-black leading-none text-[color:var(--color-text-on-card)]">
            Select {label} Date
          </h2>
          <button
            type="button"
            onClick={closePicker}
            className="flex h-8 w-8 items-center justify-center text-[color:var(--color-text-on-card)]"
            aria-label="Close date picker"
          >
            <X size={20} aria-hidden="true" />
          </button>
        </div>
      ) : null}
      <div className={isMobilePopup ? "px-6 pb-4 pt-5" : ""}>
        <div className={isMobilePopup ? "mb-5 flex items-center justify-between" : "mb-4 flex items-center justify-between"}>
          <button
            type="button"
            onClick={prevMonth}
            className={`flex items-center justify-center transition-colors ${
              isMobilePopup
                ? "h-9 w-9 text-[color:var(--color-text-on-card)] hover:text-[color:var(--color-text-on-card)]"
                : "h-7 w-7 rounded-full hover:bg-gray-100"
            }`}
          >
            <ChevronLeft size={isMobilePopup ? 22 : 15} className={isMobilePopup ? "" : "text-[color:var(--color-text-on-card)]"} />
          </button>
          <span className={isMobilePopup ? "font-body text-lg font-extrabold text-[color:var(--color-text-on-card)]" : "text-sm font-bold text-[color:var(--color-text-on-card)]"}>
            {monthLabel} {viewYear}
          </span>
          <button
            type="button"
            onClick={nextMonth}
            className={`flex items-center justify-center transition-colors ${
              isMobilePopup
                ? "h-9 w-9 text-[color:var(--color-text-on-card)] hover:text-[color:var(--color-text-on-card)]"
                : "h-7 w-7 rounded-full hover:bg-gray-100"
            }`}
          >
            <ChevronRight size={isMobilePopup ? 22 : 15} className={isMobilePopup ? "" : "text-[color:var(--color-text-on-card)]"} />
          </button>
        </div>

        <div className={isMobilePopup ? "mb-3 grid grid-cols-7" : "mb-1 grid grid-cols-7"}>
          {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((day) => (
            <div
              key={day}
              className={isMobilePopup ? "pb-2 text-center text-xs font-semibold text-[color:var(--color-text-muted-card)]" : "pb-2 text-center text-[10px] font-semibold text-[color:var(--color-text-muted-card)]"}
            >
              {day}
            </div>
          ))}
        </div>

        <div className={isMobilePopup ? "grid grid-cols-7 gap-y-2" : "grid grid-cols-7 gap-y-1"}>
          {cells.map((day, index) => {
            if (!day) return <div key={`empty-${index}`} />;
            const cellDate = new Date(viewYear, viewMonth, day);
            const isPast = cellDate < min;
            const isToday = cellDate.toDateString() === TODAY.toDateString();
            const isSelected = value && cellDate.toDateString() === value.toDateString();

            let className = isMobilePopup
              ? "mx-auto flex h-8 w-8 items-center justify-center rounded-[var(--radius-nav-action)] text-lg font-normal transition-colors "
              : "mx-auto flex h-8 w-8 items-center justify-center rounded-[var(--radius-nav-action)] text-sm transition-colors ";

            if (isPast) {
              className += "cursor-not-allowed text-slate-300";
            } else if (isSelected) {
              className += isMobilePopup
                ? "cursor-pointer border border-[color:var(--color-line)] bg-white font-normal text-[color:var(--color-slate-700)]"
                : "cursor-pointer border border-[color:var(--color-line)] bg-white font-normal text-[color:var(--color-slate-700)]";
            } else if (isToday) {
              className += isMobilePopup
                ? "cursor-pointer text-[color:var(--color-text-on-card)]"
                : "cursor-pointer border-2 border-[color:var(--color-text-on-card)] font-semibold text-[color:var(--color-text-on-card)] hover:bg-gray-50";
            } else {
              className += "cursor-pointer text-[color:var(--color-text-on-card)] hover:bg-gray-100";
            }

            return (
              <button
                key={day}
                type="button"
                disabled={isPast}
                onClick={() => selectDay(day)}
                className={className}
              >
                {day}
              </button>
            );
          })}
        </div>
      </div>
    </div>
  ) : null;

  const popup = open && isMobilePopup ? (
    <>
      <button
        type="button"
        className={`fixed inset-0 z-[9998] cursor-default bg-black/50 transition-opacity duration-300 ${
          popupVisible && !popupClosing ? "opacity-100" : "opacity-0"
        }`}
        aria-label="Close date picker backdrop"
        onMouseDown={(event) => {
          if (event.target === event.currentTarget) closePicker();
        }}
        onClick={(event) => {
          if (event.target === event.currentTarget) closePicker();
        }}
      />
      {popupPanel}
    </>
  ) : popupPanel;

  return (
    <div ref={triggerRef} className="relative w-full">
      <button
        type="button"
        onClick={handleToggle}
        className={`flex w-full cursor-pointer items-center gap-2 bg-transparent pr-8 text-left text-base font-normal leading-6 tracking-normal outline-none ${
          display ? "text-[color:var(--color-muted)]" : "text-[color:var(--color-subtle)]"
        }`}
        style={{fontFamily: "var(--font-reference)"}}
      >
        <CalendarDays size={16} className="shrink-0 text-[color:var(--color-text-muted-card)]" aria-hidden="true" />
        <span className="min-w-0 truncate">{display || label}</span>
      </button>
      {display ? (
        <button
          type="button"
          aria-label={`Clear ${label} date`}
          onClick={(event) => {
            event.stopPropagation();
            onChange(null);
            closePicker();
          }}
          className="absolute right-0 top-1/2 flex h-6 w-6 -translate-y-1/2 items-center justify-center rounded-full text-[color:var(--color-text-muted-card)] transition-colors hover:bg-[color:var(--color-surface-muted)] hover:text-[color:var(--color-text-on-card)]"
        >
          <X size={14} aria-hidden="true" />
        </button>
      ) : null}

      {typeof window !== "undefined" && createPortal(popup, document.body)}
    </div>
  );
}

export default function Hero({mode = "full", initialData = null, onComplete = null}) {
  const router = useRouter();
  const params = useParams();
  const locale = params?.locale || "en";
  const isFormOnly = mode === "form";
  const [tripType, setTripType] = useState(initialData?.tripType || "round");
  const [from, setFrom] = useState(initialData?.from || "");
  const [to, setTo] = useState(initialData?.to || "");
  const [departure, setDeparture] = useState(initialData?.departure ? new Date(initialData.departure) : null);
  const [returnDate, setReturnDate] = useState(initialData?.returnDate ? new Date(initialData.returnDate) : null);
  const [focusedField, setFocusedField] = useState(null);
  const [errors, setErrors] = useState({});
  const [toast, setToast] = useState(null);

  const minReturn = departure ? new Date(departure.getTime() + 2 * 24 * 60 * 60 * 1000) : TODAY;

  useEffect(() => {
    if (!toast) return undefined;
    const id = setTimeout(() => setToast(null), 4000);
    return () => clearTimeout(id);
  }, [toast]);

  function validate() {
    const next = {};
    if (!from.trim()) next.from = "Please enter a departure city";
    if (!to.trim()) next.to = "Please enter a destination";
    if (!departure) next.departure = "Please select a date";
    if (tripType === "round" && !returnDate) next.returnDate = "Please select a return date";
    return next;
  }

  function handleSearch(event) {
    event.preventDefault();
    const next = validate();
    setErrors(next);
    if (Object.keys(next).length > 0) {
      setToast("Please complete all required fields to search flights.");
      return;
    }

    const payload = {
      tripType,
      from: from.trim(),
      to: to.trim(),
      departure: departure?.toISOString() || null,
      returnDate: tripType === "round" ? returnDate?.toISOString() || null : null,
    };

    if (onComplete) {
      onComplete(payload);
      return;
    }

    window.sessionStorage.setItem("instaDummyTicket.bookingSearch", JSON.stringify(payload));
    router.push(localizedPath(locale, "/book"));
  }

  return (
    <section
      id={isFormOnly ? undefined : "hero"}
      className={`relative ${isFormOnly ? "overflow-visible bg-transparent" : "hero-shell overflow-hidden text-[color:var(--color-ink)]"}`}
    >
      <div
        className={`container-max hero-container min-w-0 ${
          isFormOnly
            ? "pb-0 pt-0"
            : "grid content-center pb-5 pt-5 sm:py-12 lg:min-h-[640px] lg:pb-16 lg:pt-20"
        }`}
      >
        <div
          className={
            isFormOnly
              ? ""
              : "mt-4 grid w-full min-w-0 grid-cols-1 gap-4 sm:mt-8 sm:gap-8 lg:mt-8 lg:grid-cols-2 lg:items-center lg:gap-16"
          }
        >
        {!isFormOnly ? (
          <div className="min-w-0 text-center lg:text-left">
            <p className="hero-eyebrow mb-3 text-[13px] font-semibold uppercase leading-5 text-[color:var(--color-accent)] sm:mb-7">
              Flight reservations for visa
            </p>

            <h1 className="mx-auto max-w-[15em] break-words font-display text-[36px] font-bold leading-[1.05] text-[color:var(--color-ink)] sm:text-[48px] sm:leading-[1.08] lg:mx-0">
              <span className="text-[color:var(--color-accent)]">Flight Reservations</span>{" "}
              <span>For Visa Applications In Minutes</span>
            </h1>

            <p className="mx-auto mt-4 max-w-[21rem] text-[16px] font-normal leading-6 text-[color:var(--color-muted)] sm:mt-6 sm:max-w-[36rem] sm:text-[18px] sm:leading-8 lg:mx-0">
              Live airline reservations with verifiable PNRs accepted for visa applications by embassies worldwide. Delivered in minutes.
            </p>

            <div className="mx-auto mt-4 w-full max-w-[21rem] lg:hidden">
              <div className="flex items-center justify-center gap-3">
                <span className="flex shrink-0 items-center gap-1 text-[#f59e0b]" aria-label="5 star rating">
                  {Array.from({length: 5}).map((_, index) => (
                    <Star key={index} size={15} fill="currentColor" strokeWidth={0} aria-hidden="true" />
                  ))}
                </span>
                <span className="font-body text-lg font-bold leading-none text-[color:var(--color-accent)]">
                  4.9/5
                </span>
              </div>
              <div className="mt-3 grid gap-2 font-body text-sm font-normal leading-5 text-[color:var(--color-muted)]">
                {[
                  {text: "14,000+ reservations delivered", icon: TicketCheck},
                  {text: "5-minute delivery", icon: Zap},
                  {text: "Embassy accepted worldwide", icon: ShieldCheck},
                ].map(({text, icon: Icon}) => (
                  <div key={text} className="flex items-center justify-center gap-2">
                    <Icon size={16} strokeWidth={2} className="shrink-0 text-[color:var(--color-accent)]" aria-hidden="true" />
                    <span>{text}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="mx-auto mt-8 hidden max-w-[32rem] border-t border-[color:var(--color-line)] pt-5 lg:mx-0 lg:block">
              <div className="flex max-w-full flex-wrap items-center justify-center gap-x-5 gap-y-2">
                <span className="flex shrink-0 items-center gap-1 text-[#f59e0b]" aria-label="5 star rating">
                  {Array.from({length: 5}).map((_, index) => (
                    <Star key={index} size={18} fill="currentColor" strokeWidth={0} aria-hidden="true" />
                  ))}
                </span>
                <span className="font-body text-xl font-bold leading-none text-[color:var(--color-accent)]">
                  4.9/5
                </span>
              </div>
              <div className="mt-4 flex max-w-full flex-wrap items-center justify-center gap-x-5 gap-y-2 font-body text-sm font-normal leading-5 text-[color:var(--color-muted)]">
                {[
                  {text: "14,000+ reservations delivered", icon: TicketCheck},
                  {text: "5-minute delivery", icon: Zap},
                  {text: "Embassy accepted worldwide", icon: ShieldCheck},
                ].map(({text, icon: Icon}) => (
                  <span key={text} className="inline-flex items-center gap-1.5">
                    <Icon size={14} strokeWidth={2} className="shrink-0 text-[color:var(--color-accent)]" aria-hidden="true" />
                    {text}
                  </span>
                ))}
              </div>
            </div>
          </div>
        ) : null}

        <div
          className={
            isFormOnly
              ? "hero-form mx-auto min-w-0 w-full max-w-[23rem] justify-self-center sm:max-w-[700px]"
              : "hero-form min-w-0 w-full max-w-full justify-self-stretch lg:-mt-4"
          }
        >
          <div className="flight-search-shell min-w-0 overflow-visible">
            {isFormOnly ? (
              <div className="hidden min-w-0 items-center justify-between gap-3 px-4 pt-4 text-[11px] font-bold uppercase leading-none text-[color:var(--color-primary)] sm:flex sm:px-5">
                <span className="flex min-h-7 items-center">Book a reservation</span>
                <span className="flex items-center gap-1" aria-hidden="true">
                  <span className="h-1.5 w-5 rounded-full bg-[color:var(--color-accent)]" />
                  <span className="h-1.5 w-1.5 rounded-full bg-[color:var(--color-line)]" />
                  <span className="h-1.5 w-1.5 rounded-full bg-[color:var(--color-line)]" />
                </span>
              </div>
            ) : (
              <div className="hidden min-w-0 items-center justify-between gap-3 px-4 pt-4 text-[11px] font-bold uppercase leading-none text-[color:var(--color-primary)] sm:flex sm:px-5">
                <span className="flex min-h-7 items-center">Book a reservation</span>
                <span className="flex items-center gap-1" aria-hidden="true">
                  <span className="h-1.5 w-5 rounded-full bg-[color:var(--color-accent)]" />
                  <span className="h-1.5 w-1.5 rounded-full bg-[color:var(--color-line)]" />
                  <span className="h-1.5 w-1.5 rounded-full bg-[color:var(--color-line)]" />
                </span>
              </div>
            )}

            <form
              onSubmit={handleSearch}
              noValidate
              className={isFormOnly ? "bg-white p-3.5 sm:p-8" : "bg-white p-3.5 sm:p-5 lg:p-5"}
              style={{borderRadius: "0 0 var(--radius-control) var(--radius-control)"}}
            >
              <div
                role="radiogroup"
                aria-label="Trip type"
                className="trip-toggle mb-4"
              >
                <span
                  aria-hidden="true"
                  className="trip-toggle__slider"
                  style={{transform: tripType === "round" ? "translateX(100%)" : "translateX(0%)"}}
                />
                {[
                  {key: "oneway", label: "One-way"},
                  {key: "round", label: "Return"},
                ].map(({key, label}) => {
                  const active = tripType === key;
                  return (
                    <button
                      key={key}
                      type="button"
                      role="radio"
                      aria-checked={active}
                      onClick={() => setTripType(key)}
                      data-active={active}
                      className="trip-toggle__button"
                    >
                      {label}
                    </button>
                  );
                })}
              </div>

              <div
                className={
                  isFormOnly
                    ? "grid grid-cols-1 items-center gap-4 sm:grid-cols-2 sm:gap-4"
                    : "grid grid-cols-1 items-center gap-4 sm:grid-cols-2 sm:gap-4"
                }
              >
                <div
                  className="flight-field"
                  data-error={errors.from ? "true" : undefined}
                  onFocusCapture={() => setFocusedField("from")}
                  onBlurCapture={() => setFocusedField((current) => current === "from" ? null : current)}
                  style={fieldBorderStyle(errors.from, focusedField === "from")}
                >
                  <PlaneTakeoff size={16} className="flight-field__icon" />
                  <AirportInput
                    label="Departure city"
                    placeholder="From where?"
                    dropdownAlign="left"
                    value={from}
                    onChange={(value) => {
                      setFrom(value);
                      if (errors.from) setErrors((current) => ({...current, from: undefined}));
                    }}
                  />
                </div>
                <div
                  className="flight-field"
                  data-error={errors.to ? "true" : undefined}
                  onFocusCapture={() => setFocusedField("to")}
                  onBlurCapture={() => setFocusedField((current) => current === "to" ? null : current)}
                  style={fieldBorderStyle(errors.to, focusedField === "to")}
                >
                  <PlaneLanding size={16} className="flight-field__icon" />
                  <AirportInput
                    label="Destination"
                    placeholder="To where?"
                    dropdownAlign="right"
                    value={to}
                    onChange={(value) => {
                      setTo(value);
                      if (errors.to) setErrors((current) => ({...current, to: undefined}));
                    }}
                  />
                </div>
              </div>

              <div
                className={
                  isFormOnly
                    ? "mt-3 grid grid-cols-1 items-center gap-4 sm:min-h-[3.5rem] sm:grid-cols-2 sm:gap-4"
                    : "mt-3 grid grid-cols-1 items-center gap-4 sm:min-h-[3.5rem] sm:grid-cols-2 sm:gap-4"
                }
              >
                <div
                  className={`flight-field ${tripType === "oneway" ? "sm:col-span-2" : ""}`}
                  data-error={errors.departure ? "true" : undefined}
                  onFocusCapture={() => setFocusedField("departure")}
                  onBlurCapture={() => setFocusedField((current) => current === "departure" ? null : current)}
                  style={fieldBorderStyle(errors.departure, focusedField === "departure")}
                >
                  <DatePicker
                    label="Departure"
                    align="left"
                    value={departure}
                    onChange={(date) => {
                      setDeparture(date);
                      if (errors.departure) setErrors((current) => ({...current, departure: undefined}));
                      if (returnDate && date && returnDate < new Date(date.getTime() + 2 * 24 * 60 * 60 * 1000)) {
                        setReturnDate(null);
                      }
                    }}
                  />
                </div>
                {tripType === "round" ? (
                  <>
                    <div
                      className="flight-field"
                      data-error={errors.returnDate ? "true" : undefined}
                      onFocusCapture={() => setFocusedField("returnDate")}
                      onBlurCapture={() => setFocusedField((current) => current === "returnDate" ? null : current)}
                      style={fieldBorderStyle(errors.returnDate, focusedField === "returnDate")}
                    >
                      <DatePicker
                        key={`return-${minReturn.toISOString()}`}
                        label="Return"
                        align="right"
                        value={returnDate}
                        onChange={(date) => {
                          setReturnDate(date);
                          if (errors.returnDate) setErrors((current) => ({...current, returnDate: undefined}));
                        }}
                        minDate={minReturn}
                      />
                    </div>
                  </>
                ) : (
                  null
                )}
              </div>

              <button
                type="submit"
                className="btn-secondary mt-4 min-h-12 w-full px-6 py-3 text-[16px] font-semibold leading-none sm:py-4"
                style={{backgroundColor: "var(--color-accent)", borderRadius: "var(--radius-control)"}}
              >
                <span>Get Flight Reservation</span>
              </button>
            </form>

          </div>

          {!isFormOnly ? (
            <div className="mx-auto mt-5 grid w-full max-w-[23rem] grid-cols-3 gap-2 pt-1 lg:mt-6 lg:max-w-full lg:gap-6 lg:pt-0">
              {heroFeatureCards.map(({title, subtitle, icon: Icon}) => (
                <div key={title} className="flex min-w-0 flex-col items-center gap-0.5 text-center lg:flex-row lg:justify-center lg:gap-3 lg:text-left">
                  <span className="grid h-6 w-6 shrink-0 place-items-center text-[color:var(--color-accent)] lg:h-8 lg:w-8">
                    <Icon size={21} strokeWidth={2.2} aria-hidden="true" className="lg:h-[26px] lg:w-[26px]" />
                  </span>
                  <span className="min-w-0">
                    <span className="block font-body text-[11px] font-bold leading-4 text-[color:var(--color-ink)] lg:text-base lg:leading-5">
                      {title}
                    </span>
                    <span className="block font-body text-[11px] font-normal leading-4 text-[color:var(--color-muted)] lg:mt-1 lg:text-base lg:leading-5">
                      {subtitle}
                    </span>
                  </span>
                </div>
              ))}
            </div>
          ) : null}
        </div>
        </div>
      </div>

      {toast && typeof window !== "undefined" ? createPortal(
        <div className="fixed right-5 top-5 z-[9999] max-w-sm animate-fade-in-up">
          <div className="flex items-start gap-2 rounded-[var(--radius-control)] border border-[color:var(--color-warning)] bg-[color:var(--color-warning-soft)] px-4 py-3">
            <AlertCircle size={16} className="mt-0.5 shrink-0 text-[color:var(--color-warning)]" />
            <p className="flex-1 text-sm font-medium text-[color:var(--color-warning)]">{toast}</p>
            <button
              type="button"
              onClick={() => setToast(null)}
              className="shrink-0 text-[color:var(--color-text-muted-card)] hover:text-[color:var(--color-text-on-card)]"
              aria-label="Dismiss"
            >
              <X size={14} />
            </button>
          </div>
        </div>,
        document.body
      ) : null}
    </section>
  );
}
