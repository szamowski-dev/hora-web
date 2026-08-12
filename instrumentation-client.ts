import { captureFirstTouch } from "@/lib/analytics";

// GA4 is initialized before hydration in app/layout.tsx. Capture first-touch
// attribution after the app becomes interactive.
captureFirstTouch();
