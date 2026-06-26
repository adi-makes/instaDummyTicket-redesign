# SaaS Redesign 2026 Research Notes

Date: 2026-06-21
Scope: public web app in `apps/web`; Sanity schema and monorepo structure remain unchanged.

## Business Understanding

InstaDummyTicket sells verifiable temporary flight reservations for visa applications, proof of onward travel, and embassy or immigration documentation. The primary customer is an individual traveler who needs a credible itinerary before a visa decision. Secondary users include travel consultants, visa agencies, and people managing last-minute appointment requirements.

The site must answer four questions quickly: what the product is, whether it is legitimate, how fast it arrives, and what it costs. The primary conversion path is a booking action from the reservation card or pricing section.

## Current Website Findings

- The production site already has the right route set: homepage, FAQ, blog, privacy, terms, refund, and support.
- Current copy covers PNR verification, visa use, legal disclaimers, support, and refund logic.
- The homepage form includes extra mode controls; the brief asks the hero card to focus only on from, to, departure, and return.
- The page uses repeated card grids and stacked-card visual treatments, which makes the experience feel more like a template than a premium product.
- Blog and legal pages are functional but need a stronger editorial hierarchy and more consistent surfaces.
- Localization, SEO, FAQ schema, Article schema, and Sanity fetch paths are already in place and should be preserved.

## Competitor Findings

### DummyTicketLive

- Strong UAE/GCC positioning and clear entry price from AED 35.
- Emphasizes live PNR, 5-minute delivery, embassy acceptance, and 24/7 support.
- Pricing schema exposed AED 35 and AED 75 offers, with an overall range around AED 35-95.
- Trust language is direct and useful, but the page has a busy promotional hierarchy.

### DummyFares

- Positions as a global dummy ticket and onward-travel proof provider.
- Public schema exposes USD 9.99, EUR 8.99, GBP 7.99, AED 35, INR 499, and other localized prices.
- Strong FAQ and legal disclaimer strategy.
- Content is SEO-rich but visually conventional.

### Flightinary

- Frames the product as a fast flight-itinerary generator rather than a GDS reservation provider.
- Public schema exposes USD 4.99 and an INR pricing object.
- Strong process language and generator framing.
- Lower price anchor means InstaDummyTicket should compete on verification, support, and document trust rather than only price.

## Comparative Analysis

- InstaDummyTicket already communicates legality and refund terms more clearly than many competitors.
- Competitors do better at immediate pricing visibility and operational trust signals.
- The strongest opportunity is to make the booking card feel like the product, not a generic lead form.
- SEO opportunity: preserve FAQ and blog schema while using page copy that covers Schengen, UK, US, onward travel, embassy guidance, and refund questions naturally.

## Applied Strategy

- Positioning: verifiable reservation service for visa and onward-travel proof, with transparent legal boundaries.
- Conversion: hero reservation card, repeated localized anchors to pricing, concise proof points, final CTA.
- Pricing: keep public-market entry aligned at AED 35 / USD 9 instead of inventing unrelated tiers. Present optional support/document bundles only as recommendations, not hidden upsells.
- Trust: explain that the document is a real reservation record for documentation, not a boarding ticket.
- UX: reduce card-grid repetition; use comparison tables, timelines, proof ledgers, editorial panels, and compact support surfaces.
- Performance: mostly server-rendered sections, lightweight icons, existing optimized airline assets, no heavy animation library.
