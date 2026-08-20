# Kroma Vance — Deploy-Ready Static Site

## What's in here

```
index.html          The site (single page, anchor navigation)
thank-you.html       Shown after a successful form submission
404.html             Custom not-found page
netlify.toml         Netlify build/deploy config
robots.txt           Search engine crawling rules
sitemap.xml          Basic sitemap
og-image.jpg         Social share preview image (swap for a real banner later)
assets/
  css/style.css       All site styles
  js/main.js          FAQ accordion, scroll-reveal animation, reviews
                       marquee, and the contact form's JS-enhanced submit
  img/                All photos/logos used on the site, real files
                       (no more base64-embedded images)
```

## How to deploy (drag-and-drop)

1. Unzip this folder.
2. Go to [app.netlify.com](https://app.netlify.com) → **Sites** → drag the
   unzipped folder straight onto the deploy box.
3. Netlify will publish it immediately — no build step, no `npm install`,
   nothing to configure. It's plain HTML/CSS/JS.
4. Once live, go to **Site settings → Forms** — both the project-inquiry
   form and the review-submission form will already be listed (Netlify
   auto-detects them from the `netlify` / `data-netlify="true"` attributes
   baked into `index.html`).
5. Point your real domain (`kromavance.com`) at the site under
   **Domain settings**, then update these two things to match:
   - `netlify.toml` doesn't need changes.
   - The `<link rel="canonical">`, `og:url`, and JSON-LD `url` in
     `index.html`'s `<head>` currently point to `https://kromavance.com` —
     update if the final domain differs.

## Editing content right now (no CMS yet — see note below)

Everything is plain HTML/CSS in `index.html` and `assets/css/style.css`.
To change text: open `index.html` in any text editor, find the sentence,
edit it, save, and re-drag the folder onto Netlify (or connect a Git repo
for auto-deploys on push).

To swap an image: replace the file in `assets/img/` with a new image of
the same filename, or update the `src="assets/img/..."` path in
`index.html` to point at a new filename.

## About the admin panel

This site has a custom-built admin dashboard at `/admin` — not the
default Decap CMS interface (that was replaced because the client felt
it looked outdated). It's a from-scratch, on-brand dashboard that talks
directly to the same Netlify Identity + Git Gateway backend Decap CMS
would have used, so the setup requirements underneath are identical —
only the interface changed.

```
content/
  settings.json    Hero, About, footer, contact links, bank/JazzCash details
  portfolio.json   All portfolio project cards (add/remove/reorder freely)
  pricing.json     The 3 pricing tiers and their features
admin/
  index.html       The custom admin login + dashboard (this is what
                    "the admin panel" refers to — no config.yml needed,
                    it's plain HTML/CSS/JS like the rest of the site)
```

`index.html` (the main site) loads `assets/js/content-loader.js` on every
page view, which fetches those three JSON files and fills in the page.
Every section still has real fallback content baked directly into the
HTML too, so the site never shows blank/broken content — the loader just
keeps it in sync with whatever's been edited in the admin panel.

### One-time setup required (can't be done from code — this is a Netlify
### dashboard step, has to happen after this is deployed):

1. Deploy this folder to Netlify (drag-and-drop, as above) and connect it
   to a **Git repository** — the admin panel needs Git Gateway, which
   needs the site linked to a real repo (GitHub/GitLab/Bitbucket), not
   just a drag-and-drop deploy. Easiest path: create a new GitHub repo,
   push this folder to it, then connect that repo to Netlify instead of
   a manual drag-and-drop.
2. In the Netlify dashboard: **Site settings → Identity → Enable Identity**.
3. Still under Identity: **Registration → set to "Invite only"** (so
   random people can't sign up and edit the site).
4. **Site settings → Identity → Services → Git Gateway → Enable Git Gateway.**
5. Under **Identity → Invite users**, send Usama an invite to his email.
   He'll get a link to set a password.
6. He can then log in at `yoursite.com/admin` and edit everything through
   the dashboard — no code, no JSON in sight.

### What's editable right now vs. not yet

Wired up: Hero text, About text, footer tagline, contact email/phone/
WhatsApp, all 4 social links, bank + JazzCash details, payment policy
text, all portfolio project cards (name/category/image — with direct
image upload — and alt text), and all 3 pricing tiers (price, features,
which tier is highlighted, button text).

Not wired to the admin panel yet: FAQ answers, the "why this matters"
section, the process steps, and Terms & Conditions — these are still
plain text in `index.html`. They follow the same pattern as everything
above (add a field to `content/*.json`, add a form field to
`admin/index.html`, add a couple of lines to `content-loader.js`), so
extending coverage to them is straightforward if wanted — just flagging
they're not done yet rather than leaving it
implied.


## Payment & bank details

Real bank/JazzCash details are printed in plain text in the Payment &
Terms section of the page. Worth knowing that's publicly visible to
anyone who views the page source, same as it appears on the rendered
site.
