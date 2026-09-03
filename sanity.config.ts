"use client";

import { visionTool } from "@sanity/vision";
import { defineConfig, type Template } from "sanity";
import { presentationTool } from "sanity/presentation";
import { structureTool } from "sanity/structure";
import {
  apiVersion,
  dataset,
  previewUrl,
  projectId,
  studioBasePath,
} from "./sanity/env";
import { resolve } from "./sanity/presentation/resolve";
import { schemaTypes } from "./sanity/schemaTypes";
import { structure } from "./sanity/structure";
import { StudioIcon } from "./sanity/StudioIcon";

const singletonTypes = new Set([
  "homePage",
  "footerSettings",
  "blogCtaSettings",
  "pricingPage",
  "featuresPage",
  "aboutPage",
  "legalPage",
]);

const singletonActions = new Set(["publish", "discardChanges", "restore"]);

type LegalPageTemplateParameters = {
  kind: "privacy" | "terms" | "refunds";
};

const legalPageTemplate: Template<LegalPageTemplateParameters> = {
  id: "legalPage",
  title: "Legal page",
  schemaType: "legalPage",
  parameters: [
    {
      name: "kind",
      title: "Document kind",
      type: "string",
    },
  ],
  value: ({ kind }: LegalPageTemplateParameters) => ({ kind }),
};

export default defineConfig({
  name: "default",
  title: "hora Calendar",
  basePath: studioBasePath,
  projectId,
  dataset,
  icon: StudioIcon,
  plugins: [
    structureTool({ structure }),
    presentationTool({
      previewUrl: {
        initial: previewUrl,
        previewMode: {
          enable: "/api/draft-mode/enable",
          disable: "/api/draft-mode/disable",
        },
      },
      allowOrigins: ({ origin }) => [origin],
      resolve,
    }),
    visionTool({ defaultApiVersion: apiVersion }),
  ],
  schema: {
    types: schemaTypes,
    templates: (templates) => [
      ...templates.filter(
        ({ schemaType }) => !singletonTypes.has(schemaType),
      ),
      legalPageTemplate,
    ],
  },
  document: {
    actions: (actions, context) =>
      singletonTypes.has(context.schemaType)
        ? actions.filter(
            ({ action }) => action && singletonActions.has(action),
          )
        : actions,
  },
});
