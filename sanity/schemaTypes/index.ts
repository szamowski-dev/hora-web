import { author } from "./author";
import { blogBody } from "./blogBody";
import { blogCategory } from "./blogCategory";
import { blogFaq, blogFaqItem } from "./blogFaq";
import { blogImage } from "./blogImage";
import { blogPost } from "./blogPost";
import { blogSettings } from "./blogSettings";
import { blogTable, blogTableCell, blogTableRow } from "./blogTable";
import { blogTag } from "./blogTag";
import { blogVideo } from "./blogVideo";
import { codeBlock } from "./codeBlock";
import { externalLink, internalPathLink, internalPostLink } from "./links";
import { seo } from "./seo";

export const schemaTypes = [
  externalLink,
  internalPostLink,
  internalPathLink,
  blogImage,
  seo,
  blogVideo,
  codeBlock,
  blogTableCell,
  blogTableRow,
  blogTable,
  blogFaqItem,
  blogFaq,
  blogBody,
  author,
  blogCategory,
  blogTag,
  blogPost,
  blogSettings,
];

export {
  author,
  blogBody,
  blogCategory,
  blogFaq,
  blogFaqItem,
  blogImage,
  blogPost,
  blogSettings,
  blogTable,
  blogTableCell,
  blogTableRow,
  blogTag,
  blogVideo,
  codeBlock,
  externalLink,
  internalPathLink,
  internalPostLink,
  seo,
};
