import { defineDocuments, defineLocations } from "sanity/presentation";

const mainDocuments = defineDocuments([
  {
    route: "/blog/",
    type: "blogSettings",
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
  blogSettings: defineLocations({
    locations: [{ title: "Blog", href: "/blog/" }],
  }),
};

export const resolve = {
  mainDocuments,
  locations,
};
