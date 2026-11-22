# BBS Ltd — Homepage Redesign

A premium, mobile-first homepage concept for **Beka Building Services Ltd (BBS Ltd)** — plumbing, heating, renewables, air conditioning and building services in Grays, Thurrock and Essex.

> **Demo status:** this is a separate redesign demo, not the live site. It carries a `noindex` directive so it never competes with `bekabuildingservicesltd.com` in search results.

---

## Live preview

Once GitHub Pages is enabled for this repository (see *Deployment* below):

```
https://<your-github-username>.github.io/bekabuildingservicesltd.com/
```

Everything uses relative paths, so the site also works from a project subdirectory.

---

## What's inside

```
.
├── index.html                 # the single homepage
├── css/
│   └── style.css              # design system, layout, components, responsive rules
├── js/
│   └── script.js              # nav drawer, FAQ accordion, form, reveals (no dependencies)
├── assets/
│   ├── fonts/                 # self-hosted woff2 (Archivo variable + Instrument Serif) + OFL licences
│   ├── images/                # optimised WebP + JPEG fallbacks of the original site photography
│   │   └── certs/             # Gas Safe, REFCOM, Vaillant, City & Guilds, BPEC marks
│   └── logo/                  # original BBS logo, extracted crest, favicon
├── .nojekyll                  # lets GitHub Pages serve files as-is
└── README.md
```

**Stack:** HTML5 · CSS3 (custom properties, no framework) · vanilla ES5-compatible JavaScript · static assets only — no build step, no backend, no dependencies.

---

## Brand research (from the existing website)

| Item | Value |
|---|---|
| Business name | Beka Building Services Ltd — trading as **BBS Ltd** |
| Industry | Plumbing, heating, renewables, air conditioning, building |
| Base | 99 Victoria Avenue, Grays, Essex RM16 2RN |
| Phone | 07868 361125 |
| Email | BBServicesLTD@hotmail.com |
| Company no. | 12104130 (Companies House) |
| Checkatrade | 9.83/10 from 89 verified reviews |
| Existing site palette | Primary `#2092D0`, logo red `#F2192A`, black wordmark |

**Original brand assets preserved:** the existing BBS logo (blue house + white flame + red snowflake) is used unchanged. The crest was carefully cut out of the original JPEG (white background removed via edge flood-fill, no redrawing) so it works on dark backgrounds. All photography is the client's own imagery, taken from the existing site and re-optimised.

**Design direction:** editorial trade-premium. Deep ink charcoal for authority, warm paper for readability, copper accent drawn from the copper pipework in the client's photos, and an italic serif display face for warmth — the opposite of the generic rounded-card template. Strong type hierarchy, precise 2px radii, no gradients-as-decoration, no emoji.

Sections: hero → intro/story → services (lead + 6) → recent work → why BBS → process → reviews → areas & accreditations → FAQ → quote form → footer.

---

## Responsive & accessibility notes

- Designed mobile-first, verified at **360, 390, 430, 768, 1024, 1280 and 1440 px** with zero horizontal overflow.
- Mobile navigation is a full-screen drawer with scroll-lock, focus handling, `inert` background and a 24/7 call CTA.
- The floating call/email actions become a docked action bar on phones (safe-area aware) and a floating pair on desktop, so they never cover content or the footer.
- Touch targets are 46–52 px minimum; body copy stays ≥16 px.
- Semantic landmarks, single `h1`, ordered heading hierarchy, skip link, visible focus rings, `aria-expanded`/`aria-controls` on the accordion, and `prefers-reduced-motion` support.

## Forms

There is **no backend**. The quote form validates in the browser and then opens the visitor's mail client with the details addressed to the company inbox — it never shows a fake "success" message. Swapping in a real form handler (e.g. Formspree, Netlify Forms) only requires changing the submit handler in `js/script.js`.

---

## Deployment (GitHub Pages)

1. Push these files to the default branch (`main`). `.nojekyll` and `index.html` are already at the repository root.
2. Repo **Settings → Pages → Build and deployment**.
3. Source: **Deploy from a branch** → Branch **`main`**, folder **`/ (root)`** → **Save**.
4. Wait for the Pages build to finish, then open `https://<username>.github.io/bekabuildingservicesltd.com/`.

No Actions, secrets or build configuration are required.

---

## Credits

- Imagery: Beka Building Services Ltd (original site photography).
- Certification marks: Gas Safe Register, REFCOM, Vaillant, City & Guilds, BPEC — reproduced for accreditation display.
- The one supplementary lifestyle photo (`assets/images/brand-engineer.*`) is an AI-generated brand visual, used as illustrative imagery only — not as a photo of a real completed project or customer.
- Typefaces: **Archivo** and **Instrument Serif**, both SIL Open Font License 1.1 (licences in `assets/fonts/`).
