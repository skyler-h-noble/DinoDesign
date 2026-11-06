---
description: Check the built app's accessibility with omni-check (axe in light and dark, desktop and phone) and fix what belongs to this app
argument-hint: "[/route,/route…]  (optional — default: the pages linked from the start page)"
---

The user asked for an accessibility check of this Omni Design app. Run it
ONCE, read the result, fix what is yours, and report. This is the only time
omni-check runs: it is not a routine step of building, and Omni's components
and tokens are already accessible by construction.

1. **Build.** `npm run build`. If the build fails, fix that first and say so.

2. **Run the check once.** Run it in the foreground, exactly like this — no
   pipe:

   ```bash
   npx omni-check --routes <routes>
   ```

   - `<routes>`: the user's argument if they gave one (`$ARGUMENTS`), else
     leave `--routes` off and let it follow the links from the start page.
   - Give the command a timeout of at least 5 minutes. It prints one line
     per page as it goes ("/cart done in 4.2s"), about 5 seconds a page in
     light and dark at 1280px and 390px — 30 pages take 2–3 minutes. That
     progress IS the sign it is working.
   - Do NOT pipe it through `tail`, `head` or `grep` (that hides the progress
     until the very end and makes a working run look frozen), do not run it
     in the background, do not sleep and poll, and do not run it a second
     time "to be sure".
   - If it ends with pages listed as NOT checked (a timeout, or the computer
     slept), report that. Do not investigate the tool or retry it.
   - Never kill Chrome or any process by name or pattern. omni-check closes
     its own browser; if you must stop it, stop omni-check itself.

3. **Sort what it found** (each issue names its page, element and rule):
   - **This app's code** — something written here: a hand-built control,
     a missing label, a heading level, an `aria-label` that doesn't match the
     visible text, a color or style set by hand. Fix these.
   - **The library** — an issue inside an Omni component used as documented
     (its own colors, focus ring or structure). Do NOT patch around it with
     inline styles or overrides. List it for the user; if it is a missing
     component, offer `/ShareComponent`.
   - **Content** — alt text, link wording, copy. Fix if the right words are
     clear; otherwise ask.

4. **Re-check only what you changed:** after fixing, run it once more with
   `--routes` limited to the pages you touched. Never a full re-run loop.

5. **Report**, briefly: pages checked and modes, the issue count before and
   after, what you fixed (file:line), what belongs to the library, and what
   omni-check cannot see — pages that need app state (a filled cart, a
   signed-in user) are checked in their empty state, so name those screens
   for the user to look at.
