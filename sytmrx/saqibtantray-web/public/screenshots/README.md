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
