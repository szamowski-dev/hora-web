import { defineDocuments, defineLocations } from "sanity/presentation";

const mainDocuments = defineDocuments([
  {
    route: "/",
    type: "homePage",
  },
  {
    route: "/features/",
    type: "featuresPage",
  },
  {
    route: "/about/",
    type: "aboutPage",
  },
  {
    route: "/privacy/",
    filter: `_type == "legalPage" && kind == "privacy"`,
  },
  {
    route: "/terms/",
    filter: `_type == "legalPage" && kind == "terms"`,
  },
  {
    route: "/blog/category/:slug",
    filter: `_type == "blogCategory" && slug.current == $slug`,
    params: ({ params }) => ({ slug: params.slug }),
  },
  {
    route: "/blog/:slug",
    filter: `_type == "blogPost" && slug.current == $slug`,
    params: ({ params }) => ({ slug: params.slug }),
  },
]);

const locations = {
  homePage: defineLocations({
    locations: [{ title: "Homepage", href: "/" }],
  }),
  featuresPage: defineLocations({
    locations: [{ title: "Features", href: "/features/" }],
  }),
  aboutPage: defineLocations({
    locations: [{ title: "About", href: "/about/" }],
  }),
  legalPage: defineLocations({
    select: { kind: "kind" },
    resolve: (document) => {
      if (document?.kind === "privacy") {
        return {
          locations: [{ title: "Privacy Policy", href: "/privacy/" }],
        };
      }
      if (document?.kind === "terms") {
        return {
          locations: [{ title: "Terms of Service", href: "/terms/" }],
        };
      }
      return { locations: [] };
    },
  }),
  blogPost: defineLocations({
    select: {
      title: "title",
      slug: "slug.current",
    },
    resolve: (document) => ({
      locations: [
        ...(document?.slug
          ? [
              {
                title:
                  typeof document.title === "string"
                    ? document.title
                    : "Untitled post",
                href: `/blog/${document.slug}/`,
              },
            ]
          : []),
        { title: "Blog", href: "/blog/" },
      ],
    }),
  }),
  blogCategory: defineLocations({
    select: {
      title: "title",
      slug: "slug.current",
    },
    resolve: (document) => ({
      locations: [
        ...(document?.slug
          ? [
              {
                title:
                  typeof document.title === "string"
                    ? document.title
                    : "Untitled category",
                href: `/blog/category/${document.slug}/`,
              },
            ]
          : []),
        { title: "Blog", href: "/blog/" },
      ],
    }),
  }),
};

export const resolve = {
  mainDocuments,
  locations,
};
