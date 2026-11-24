# Screenshots

Put real product screenshots here, then reference them from `src/data/projects.ts`.

```ts
screenshots: [
  {
    src: "/screenshots/offline-attendance/capture.png",
    alt: "Offline Attendance — attendance capture screen",
    width: 1080,   // the image's TRUE pixel width
    height: 2340,  // the image's TRUE pixel height
    frame: "phone" // "phone" | "browser" | "raw"
  },
]
```

Rules:
- Always set `width` / `height` to the real intrinsic size. The site renders with
  `object-contain`, so correct dimensions guarantee the image is never distorted.
- Use PNG for UI screenshots, JPG for photography.
- Keep files under ~500 KB where possible; `next/image` optimises them further.
- `alt` is required and must describe what the screen shows.
- Caption anything that is not a genuine device screenshot. A visual's
  provenance must be stated where the visitor can see it.

## Current assets and their provenance

| File | Source | Provenance |
| --- | --- | --- |
| `lumaos-pro/onboarding-welcome.png` | `lumaospro/docs/screenshots/onboarding/01-welcome.png` | **Static design rendering** generated from the app's own string resources and layout values (`OnboardingScreens.kt`). Not a device screenshot — the image self-labels, and the site caption repeats it. |
| `lumaos-pro/onboarding-focus-protection.png` | `lumaospro/docs/screenshots/onboarding/04-focus-protection.png` | Same rendering pipeline as above, step 4 of the walkthrough. |
| `puck/gesture-hero.png` | `puck/docs/hero.png` | The project's own hero graphic describing the four gestures. |

No device screenshots exist yet for any project — none of the apps have been
built in an Android SDK environment, so none are claimed. Real device captures
replace these renderings as they become available.
