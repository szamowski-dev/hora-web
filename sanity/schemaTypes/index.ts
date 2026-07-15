import { aboutPage } from "./aboutPage";
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
import { featuresPage } from "./featuresPage";
import { homePage } from "./homePage";
import { legalPage } from "./legalPage";
import { pageBody } from "./pageBody";
import { pageSeo } from "./pageSeo";
import { seo } from "./seo";
import { siteImage } from "./siteImage";
import { siteVideo } from "./siteVideo";

export const schemaTypes = [
  externalLink,
  internalPostLink,
  internalPathLink,
  siteImage,
  siteVideo,
  pageSeo,
  pageBody,
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
  homePage,
  featuresPage,
  aboutPage,
  legalPage,
];

export {
  aboutPage,
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
  featuresPage,
  homePage,
  internalPathLink,
  internalPostLink,
  legalPage,
  pageBody,
  pageSeo,
  seo,
  siteImage,
  siteVideo,
};
