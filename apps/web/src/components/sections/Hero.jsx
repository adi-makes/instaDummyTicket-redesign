"use client";

import {useCallback, useEffect, useRef, useState} from "react";
import {createPortal} from "react-dom";
import {useParams, useRouter} from "next/navigation";
import {
  AlertCircle,
  CalendarDays,
  ChevronLeft,
  ChevronRight,
  ArrowRightLeft,
  PlaneLanding,
  PlaneTakeoff,
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

const trustMetrics = [
  {value: "5 min", label: "typical delivery"},
  {value: "14k+", label: "documents issued"},
  {value: "4.9/5", label: "traveler rating"},
];

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
        className="w-full bg-transparent pr-8 text-left text-[16px] font-medium leading-[1.4] text-[color:var(--color-text-on-card)] outline-none placeholder:font-medium placeholder:text-slate-300"
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
          className={`airport-suggestions absolute left-[-2.625rem] right-[-1rem] top-[calc(100%+1.125rem)] z-40 max-h-56 divide-y divide-slate-100 overflow-y-auto overflow-x-hidden rounded-none border border-[color:var(--color-border-card)] bg-white shadow-none sm:max-h-[17rem] ${dropdownPositionClass}`}
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
                    <span className="flex min-w-0 items-center gap-1.5">
                      <span className="inline-flex shrink-0 items-center bg-slate-200 px-1.5 py-0.5 font-mono text-sm font-black leading-4 tracking-[0.01em] text-[color:var(--color-text-on-card)] [text-shadow:0_0_0_var(--color-text-on-card)] sm:font-extrabold sm:tracking-[0] sm:[text-shadow:none]">
                        {airport.code}
                      </span>
                      <span className="min-w-0 break-words text-[15px] font-extrabold leading-5 text-[color:var(--color-text-on-card)]">
                        {airport.name}
                      </span>
                    </span>
                    <span className="mt-1 block break-words text-[13px] font-semibold leading-5 text-[color:var(--color-muted)]">
                      {airport.city}, {airport.country}
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

  const min = minDate instanceof Date ? minDate : TODAY;
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
          ? `max-h-[90vh] overflow-y-auto rounded-t-lg border-0 bg-white pb-20 shadow-xl transition-transform duration-300 ease-out ${
              popupVisible && !popupClosing ? "translate-y-0" : "translate-y-full"
            }`
          : "w-[320px] rounded-2xl border border-[color:var(--color-border-card)] bg-white p-5 shadow-[0_8px_40px_rgba(0,0,0,0.18)]"
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
              ? "mx-auto flex h-8 w-8 items-center justify-center rounded-full text-lg font-normal transition-colors "
              : "mx-auto flex h-8 w-8 items-center justify-center rounded-full text-sm transition-colors ";

            if (isPast) {
              className += "cursor-not-allowed text-slate-300";
            } else if (isSelected) {
              className += isMobilePopup
                ? "cursor-pointer border-2 border-[color:var(--color-text-on-card)] font-normal text-[color:var(--color-text-on-card)]"
                : "cursor-pointer bg-[color:var(--color-accent)] font-semibold text-[color:var(--color-text-on-accent)]";
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
        className={`flex w-full cursor-pointer items-center gap-2 bg-transparent pr-8 text-left text-[16px] font-medium leading-[1.4] outline-none ${
          display ? "text-[color:var(--color-text-on-card)]" : "font-normal text-slate-300"
        }`}
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
  const [errors, setErrors] = useState({});
  const [toast, setToast] = useState(null);

  const minReturn = departure ? new Date(departure.getTime() + 2 * 24 * 60 * 60 * 1000) : TODAY;
  const travelDays = departure && returnDate ? Math.max(1, Math.round((returnDate - departure) / 86400000)) : null;

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

  function swapFromTo() {
    setFrom(to);
    setTo(from);
    setErrors((current) => ({...current, from: undefined, to: undefined}));
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
    <section id={isFormOnly ? undefined : "hero"} className={`relative overflow-hidden ${isFormOnly ? "bg-transparent" : "bg-[color:var(--color-surface)]"}`}>
      <div className={`container-max grid min-w-0 grid-cols-1 justify-items-center gap-5 ${isFormOnly ? "pb-0 pt-0" : "pb-4 pt-8 sm:gap-8 sm:pb-8 sm:pt-12"}`}>
        {!isFormOnly ? (
          <div className="min-w-0 text-center">
            <p className="eyebrow !mb-5 text-center">
              FLIGHT RESERVATIONS FOR VISA
            </p>

            <h1 className="mx-auto max-w-[10em] break-words text-center font-display text-[37px] font-bold leading-[1.1] text-[color:var(--color-ink)] sm:max-w-3xl">
              <span className="block">BOOK a verified</span>
              <span className="block">
                <span className="text-[color:var(--color-accent)]">reservation</span>.
              </span>
            </h1>

            <span className="section-accent-line mx-auto mt-5 block" aria-hidden="true" />

            <p className="mx-auto mt-5 max-w-[21rem] text-center text-[16px] font-normal leading-[1.65] text-[color:var(--color-muted)] sm:max-w-2xl">
              A real, verified flight reservation with a live PNR accepted by embassies worldwide. No risk, no wasted money.
            </p>
          </div>
        ) : null}

        <div className="hero-form animate-fade-in-up-delayed min-w-0 w-full max-w-full sm:max-w-[560px]">
          <div className="die-cut-ticket-border ticket-no-notch min-w-0 p-3 sm:p-8" style={{"--ticket-radius": "0", "--ticket-shadow": "none"}}>
            <form onSubmit={handleSearch} noValidate>
              <div
                role="radiogroup"
                aria-label="Trip type"
                className="relative mb-4 flex w-full items-center bg-[color:var(--color-surface-muted)] p-1 sm:mb-8"
              >
                <span
                  aria-hidden="true"
                  className="pointer-events-none absolute bottom-1 top-1 w-[calc(50%-0.25rem)] bg-[color:var(--color-brand-secondary)] transition-transform duration-300 ease-out"
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
                      className={`relative z-10 flex-1 px-4 py-2 text-[14px] font-medium leading-[1.5] transition-colors duration-200 sm:py-2.5 ${
                        active
                          ? "text-[color:var(--color-text-on-accent)]"
                          : "text-slate-600 hover:text-slate-900"
                      }`}
                    >
                      {label}
                    </button>
                  );
                })}
              </div>

              <div className="grid grid-cols-1 items-center gap-3 sm:grid-cols-[1fr_auto_1fr] sm:gap-0">
                <div
                  className={`relative flex min-w-0 items-center gap-2.5 rounded-[4px] border bg-white px-4 py-2.5 text-[color:var(--color-text-on-card)] shadow-none transition-colors focus-within:border-slate-800 focus-within:ring-1 focus-within:ring-slate-800 sm:py-3.5 [&:has([data-airport-open])]:z-50 [&:has([data-airport-open])]:border-slate-800 [&:has([data-airport-open])]:ring-1 [&:has([data-airport-open])]:ring-slate-800 ${
                    errors.from ? "border-[color:var(--color-warning)] ring-1 ring-[color:var(--color-warning)] focus-within:border-[color:var(--color-warning)] focus-within:ring-[color:var(--color-warning)]" : "border-slate-300"
                  }`}
                >
                  <PlaneTakeoff size={16} className="shrink-0 text-[color:var(--color-text-muted-card)]" />
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
                <button
                  type="button"
                  onClick={swapFromTo}
                  aria-label="Swap departure and destination"
                  className="hidden cursor-pointer items-center justify-center px-3 text-[color:var(--color-accent)] transition-opacity hover:opacity-70 sm:flex sm:px-4"
                >
                  <ArrowRightLeft size={18} aria-hidden="true" />
                </button>
                <div
                  className={`relative flex min-w-0 items-center gap-2.5 rounded-[4px] border bg-white px-4 py-2.5 text-[color:var(--color-text-on-card)] shadow-none transition-colors focus-within:border-slate-800 focus-within:ring-1 focus-within:ring-slate-800 sm:py-3.5 [&:has([data-airport-open])]:z-50 [&:has([data-airport-open])]:border-slate-800 [&:has([data-airport-open])]:ring-1 [&:has([data-airport-open])]:ring-slate-800 ${
                    errors.to ? "border-[color:var(--color-warning)] ring-1 ring-[color:var(--color-warning)] focus-within:border-[color:var(--color-warning)] focus-within:ring-[color:var(--color-warning)]" : "border-slate-300"
                  }`}
                >
                  <PlaneLanding size={16} className="shrink-0 text-[color:var(--color-text-muted-card)]" />
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
                className={`mt-3 grid items-center gap-3 sm:gap-0 ${
                  tripType === "round" ? "grid-cols-1 sm:grid-cols-[minmax(0,1fr)_3.5rem_minmax(0,1fr)]" : "grid-cols-1"
                }`}
              >
                <div
                  className={`min-w-0 rounded-[4px] border bg-white px-4 py-2.5 text-[color:var(--color-text-on-card)] shadow-none transition-colors focus-within:border-slate-800 focus-within:ring-1 focus-within:ring-slate-800 sm:py-3.5 ${
                    errors.departure ? "border-[color:var(--color-warning)] ring-1 ring-[color:var(--color-warning)] focus-within:border-[color:var(--color-warning)] focus-within:ring-[color:var(--color-warning)]" : "border-slate-300"
                  }`}
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
                    <div className="flex min-w-14 items-center justify-center text-[13px] font-medium leading-[1.45] text-[color:var(--color-text-muted-card)]">
                      <span
                        className={
                          travelDays
                            ? "inline-flex min-w-12 justify-center px-2 py-0.5 text-[color:var(--color-muted)]"
                            : "inline-flex min-w-12 justify-center px-2 text-[color:var(--color-text-muted-card)]"
                        }
                      >
                        {travelDays ? `${travelDays} days` : "-"}
                      </span>
                    </div>
                    <div
                      className={`min-w-0 rounded-[4px] border bg-white px-4 py-2.5 text-[color:var(--color-text-on-card)] shadow-none transition-colors focus-within:border-slate-800 focus-within:ring-1 focus-within:ring-slate-800 sm:py-3.5 ${
                        errors.returnDate ? "border-[color:var(--color-warning)] ring-1 ring-[color:var(--color-warning)] focus-within:border-[color:var(--color-warning)] focus-within:ring-[color:var(--color-warning)]" : "border-slate-300"
                      }`}
                    >
                      <DatePicker
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
                    <div className="hidden" aria-hidden="true">
                      <span className="bg-white px-2 text-[13px] font-medium leading-[1.45] text-[color:var(--color-text-muted-card)]">
                        {departure && returnDate ? `${Math.max(1, Math.round((returnDate - departure) / 86400000))} days` : "—"}
                      </span>
                    </div>
                  </>
                ) : null}
              </div>

              <button
                type="submit"
                className="btn-secondary mt-4 w-full px-6 py-3 text-[16px] font-semibold leading-none tracking-wide shadow-none sm:mt-6 sm:py-4"
              >
                Search Flights
              </button>
            </form>
          </div>

          {!isFormOnly ? (
            <div className="mt-4 grid w-full grid-cols-3 overflow-hidden border border-[color:var(--color-line-soft)] bg-white text-center">
              {trustMetrics.map((metric, index) => (
                <div
                  key={metric.label}
                  className={["px-2 py-3", index ? "border-l border-[color:var(--color-line-soft)]" : ""].join(" ")}
                >
                  <p className="font-body text-[18px] font-semibold leading-[1.3] text-[color:var(--color-ink)]">
                    {metric.value}
                  </p>
                  <p className="mt-1 text-[13px] font-medium leading-[1.45] text-[color:var(--color-text-muted-card)]">
                    {metric.label}
                  </p>
                </div>
              ))}
            </div>
          ) : null}
        </div>
      </div>

      {toast && typeof window !== "undefined" ? createPortal(
        <div className="fixed right-5 top-5 z-[9999] max-w-sm animate-fade-in-up">
          <div className="flex items-start gap-2 rounded-xl border border-[color:var(--color-warning)] bg-[color:var(--color-warning-soft)] px-4 py-3 shadow-[0_8px_30px_rgba(0,0,0,0.12)]">
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
