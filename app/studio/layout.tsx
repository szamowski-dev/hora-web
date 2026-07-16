import { preloadModule } from "react-dom";

const dashboardBridgeScript = "https://core.sanity-cdn.com/bridge.js";

export default function StudioLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  preloadModule(dashboardBridgeScript, { as: "script" });

  return (
    <>
      <script src={dashboardBridgeScript} async type="module" />
      {children}
    </>
  );
}
