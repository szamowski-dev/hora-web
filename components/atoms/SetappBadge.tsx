import { createElement } from "react";

const SETAPP_BADGE_SCRIPT = "https://developer.setapp.com/setapp-badge/index.js";

export function SetappBadge() {
  return (
    <div
      className="flex h-11 items-center leading-none"
      aria-label="Available on Setapp"
    >
      {createElement("setapp-badge", {
        appId: "1977",
        vendorId: "1584",
        theme: "dark",
      })}
      <script type="text/javascript" src={SETAPP_BADGE_SCRIPT} async />
    </div>
  );
}
