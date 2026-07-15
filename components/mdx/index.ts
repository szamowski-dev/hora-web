import type { MDXComponents } from "mdx/types";
import { AutoVideo } from "./AutoVideo";
import { BlogFaq, BlogFaqItem } from "./BlogFaq";
import { DiscordCta } from "./DiscordCta";
import { MdxImage } from "./MdxImage";
import { MdxLink } from "./MdxLink";
import { OneMoreThing } from "./OneMoreThing";

export const mdxComponents: MDXComponents = {
  img: MdxImage as MDXComponents["img"],
  a: MdxLink as MDXComponents["a"],
  AutoVideo: AutoVideo as unknown as MDXComponents["AutoVideo"],
  BlogFaq: BlogFaq as unknown as MDXComponents["BlogFaq"],
  BlogFaqItem: BlogFaqItem as unknown as MDXComponents["BlogFaqItem"],
  DiscordCta: DiscordCta as unknown as MDXComponents["DiscordCta"],
  OneMoreThing: OneMoreThing as unknown as MDXComponents["OneMoreThing"],
};
