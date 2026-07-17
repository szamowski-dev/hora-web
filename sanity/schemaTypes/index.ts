import { aboutPage } from "./aboutPage";
import { author } from "./author";
import { blogBody } from "./blogBody";
import { blogCategory } from "./blogCategory";
import { blogFaq, blogFaqItem } from "./blogFaq";
import { blogImage } from "./blogImage";
import { blogPost } from "./blogPost";
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
import { optionalSiteImage } from "./optionalSiteImage";
import { siteImage } from "./siteImage";
import { siteVideo } from "./siteVideo";
import { videoPoster } from "./videoPoster";

export const schemaTypes = [
  externalLink,
  internalPostLink,
  internalPathLink,
  siteImage,
  optionalSiteImage,
  videoPoster,
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
  homePage,
  featuresPage,
  aboutPage,
  legalPage,
];
