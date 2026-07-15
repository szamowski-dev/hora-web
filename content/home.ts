/**
 * Copy for local-only homepage surfaces that are not managed in Sanity.
 * Marketing sections, media, SEO, and the selected standalone pages live in
 * the five Sanity site singletons.
 */
export const home = {
  hero: {
    newsletter: {
      placeholder: "you@email.com",
      button: "Keep me notified",
    },
  },

  betaCta: {
    eyebrow: "Mobile Beta Sign-up",
    heading: "Want to stay updated?",
    subtitle: "Subscribe for information about iOS/iPadOS beta availability.",
  },

  blogPreview: {
    heading: { prefix: "From the", suffixGradient: "Blog" },
    allPostsLink: { label: "View all posts →", href: "/blog/" },
  },
} as const;
