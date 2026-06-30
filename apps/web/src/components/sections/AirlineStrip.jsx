"use client";
import Image from "next/image";

const airlines = [
  { name: "Emirates",           src: "/images/airlineLogos/Emirates_logo.png" },
  { name: "Air India",          src: "/images/airlineLogos/air_india_logo.png" },
  { name: "IndiGo",             src: "/images/airlineLogos/IndiGo_logo.png" },
  { name: "flydubai",           src: "/images/airlineLogos/Flydubai_logo_dark.png" },
  { name: "Air Arabia",         src: "/images/airlineLogos/Air_Arabia_logo.png" },
  { name: "Qatar Airways",      src: "/images/airlineLogos/Qatar_Airways_Logo.png" },
  { name: "Etihad Airways",     src: "/images/airlineLogos/etihad_logo.png" },
  { name: "SpiceJet",           src: "/images/airlineLogos/spice_jet_logo.png" },
  { name: "Lufthansa",          src: "/images/airlineLogos/lufthansa_logo.png" },
  { name: "British Airways",    src: "/images/airlineLogos/British_Airways_logo.png" },
  { name: "Singapore Airlines", src: "/images/airlineLogos/Singapore_Airlines_logo.png" },
  { name: "Thai Airways",       src: "/images/airlineLogos/Thai_Airways_logo.png" },
  { name: "Air France",         src: "/images/airlineLogos/Air_France_logo.png" },
  { name: "Turkish Airlines",   src: "/images/airlineLogos/Turkish_Airlines_logo.png" },
  { name: "Oman Air",           src: "/images/airlineLogos/Oman_Air_logo.png" },
  { name: "SriLankan Airlines", src: "/images/airlineLogos/SriLankan_Airlines_logo.png" },
];

const track = [...airlines, ...airlines];

export default function AirlineStrip() {
  return (
    <section data-scroll-reveal className="airline-strip overflow-hidden border-t border-[color:var(--color-line-soft)] bg-white py-6 md:py-6">
      <div className="mb-5 flex items-center justify-center gap-3 px-4 md:mb-6">
        <span className="hidden h-px w-12 bg-gradient-to-r from-transparent to-accent-border sm:block sm:w-20" aria-hidden="true" />
        <p className="eyebrow !mb-0 whitespace-nowrap">
          Tickets issued on real airlines
        </p>
        <span className="hidden h-px w-12 bg-gradient-to-l from-transparent to-accent-border sm:block sm:w-20" aria-hidden="true" />
      </div>

      <div className="relative flex w-full overflow-hidden select-none">
        <div className="pointer-events-none absolute inset-y-0 left-0 z-10 w-12 bg-gradient-to-r from-white to-transparent md:w-24" />
        <div className="pointer-events-none absolute inset-y-0 right-0 z-10 w-12 bg-gradient-to-l from-white to-transparent md:w-24" />

        <div className="animate-scroll whitespace-nowrap flex items-center w-max">
          {track.map((airline, idx) => (
            <div key={idx} className="flex items-center shrink-0">
              <div className="flex min-w-[7rem] items-center justify-center px-5 opacity-90 transition-opacity duration-300 hover:opacity-100 md:min-w-[9rem] md:px-10">
                <Image
                  src={airline.src}
                  alt={airline.name}
                  width={160}
                  height={56}
                  loading="lazy"
                  className="h-7 w-auto max-w-[7rem] object-contain md:h-8 md:max-w-[150px]"
                />
              </div>
              <div className="h-6 w-px shrink-0 bg-line md:h-8" aria-hidden="true" />
            </div>
          ))}
        </div>
      </div>

      <p className="mx-auto mt-4 max-w-3xl px-4 text-center text-[13px] font-medium leading-[1.45] text-[color:var(--color-text-muted-card)] md:mt-6">
        <span>
          Every reservation comes with a verifiable PNR you can check directly on the airline&apos;s website.
        </span>
      </p>
    </section>
  );
}
