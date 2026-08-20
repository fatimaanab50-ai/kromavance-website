# Your Admin Panel — How To Use It

Hi Usama — this is your control panel for the website. No code, no
developer needed for day-to-day changes. Here's everything you need.

## Logging In

1. Go to **yoursite.com/admin** (once your domain is live — see the
   setup note at the bottom of this guide if it's not working yet).
2. Check your email for an invite link (sent once during setup) and set
   a password the first time.
3. After that, just go to `/admin` any time and log in with your email
   and password.

## What You'll See

Three sections on the left:

### 1. Site Settings
Everything on the homepage that isn't a portfolio project or a price:
- Your headline and the line under it
- The "About" section text (your bio)
- Footer text
- Your email, phone number, and WhatsApp number
- Your Instagram / Facebook / TikTok / YouTube links
- Your bank details and JazzCash number (shown on the Payment page)

Click into any field, change the text, done.

### 2. Portfolio
Every project card shown on your homepage. You can:
- **Edit** a project's name, category label, or photo (click "Replace
  Image" under any project's photo to swap it)
- **Add a new project** — click "+ Add Project" at the top, then fill
  in the name, category, and photo
- **Remove** a project with the &times; button on its card

### 3. Pricing
Your three pricing packages. Edit the price, the list of what's
included, add or remove features, or toggle which package is marked
"Most Popular."

## Saving Changes

Each section (Site Settings, Portfolio, Pricing) has its own
**Save Changes** button at the bottom. Click it after you're done
editing that section. The change goes live on your site within a
minute or two — no waiting for a developer.

Unlike some tools, there's no separate "draft" step here — clicking
Save Changes publishes right away. So take a second look before you
click it, but don't stress too much: every change is reversible (just
edit it back and save again).

## What NOT To Touch

A few things on the site are **not** in this admin panel yet, because
they're still plain text in the website's code:
- FAQ answers
- The "why this matters" and "how we work" sections
- Terms & Conditions wording

If you need any of those changed, just message your developer — it's
usually a five-minute edit for them. (These can be added to your admin
panel later too, if you'd like everything editable — just ask.)

## If Something Looks Wrong

- Changes not showing up? Give it a minute or two, then hard-refresh
  the page (Ctrl+Shift+R on Windows, Cmd+Shift+R on Mac).
- Can't log in? Your developer may need to re-send your invite — this
  happens if too much time passes before you set your password.
- A save fails or shows a red error message — nothing was published,
  it's safe to just try again. If it keeps failing, send your developer
  a screenshot of the error message.

---

*Note for whoever deploys this site: the admin panel only works once
the site is connected to a Git repository (not a plain drag-and-drop
deploy) with Netlify Identity + Git Gateway enabled, and Usama has been
sent his invite email. Full steps are in README.md under "About the
admin panel."*
