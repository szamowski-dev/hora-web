"use client";

import { useEffect, useState } from "react";

type VisualEditingComponent = (
  typeof import("next-sanity/visual-editing")
)["VisualEditing"];
type DisableDraftModeComponent = (
  typeof import("@/components/sanity/DisableDraftMode")
)["DisableDraftMode"];

type DraftTools = {
  VisualEditing: VisualEditingComponent;
  DisableDraftMode: DisableDraftModeComponent;
};

export function DraftModeTools() {
  const [tools, setTools] = useState<DraftTools | null>(null);

  useEffect(() => {
    let active = true;

    void Promise.all([
      import("next-sanity/visual-editing"),
      import("@/components/sanity/DisableDraftMode"),
    ]).then(([visualEditing, disableDraftMode]) => {
      if (!active) return;
      setTools({
        VisualEditing: visualEditing.VisualEditing,
        DisableDraftMode: disableDraftMode.DisableDraftMode,
      });
    });

    return () => {
      active = false;
    };
  }, []);

  if (!tools) return null;

  const { VisualEditing, DisableDraftMode } = tools;
  return (
    <>
      <VisualEditing />
      <DisableDraftMode />
    </>
  );
}
