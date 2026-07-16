import type { StructureResolver } from "sanity/structure";

const managedDocumentTypes = new Set([
  "homePage",
  "featuresPage",
  "aboutPage",
  "legalPage",
  "blogPost",
  "blogCategory",
  "blogTag",
  "author",
  "blogSettings",
]);

const singletonDocumentTypes = new Set([
  "homePage",
  "featuresPage",
  "aboutPage",
  "legalPage",
  "blogSettings",
]);

const categories = [
  ["Guides", "blog-category-guides"],
  ["Build notes", "blog-category-build-notes"],
  ["Engineering", "blog-category-engineering"],
  ["Product updates", "blog-category-product-updates"],
] as const;

export const structure: StructureResolver = (S) =>
  S.list()
    .title("Content")
    .initialValueTemplates(
      S.defaultInitialValueTemplateItems().filter(
        (item) => !singletonDocumentTypes.has(item.getTemplateId() ?? ""),
      ),
    )
    .items([
      S.listItem()
        .id("recentlyEdited")
        .title("Recently edited")
        .child(
          S.documentList()
            .title("Recently edited")
            .filter(
              '_type in ["homePage", "featuresPage", "aboutPage", "legalPage", "blogPost", "blogCategory", "blogTag", "author", "blogSettings"]',
            )
            .defaultOrdering([{ field: "_updatedAt", direction: "desc" }]),
        ),
      S.divider(),
      S.listItem()
        .id("homePage")
        .title("Homepage")
        .child(
          S.document()
            .schemaType("homePage")
            .documentId("homePage")
            .title("Homepage"),
        ),
      S.listItem()
        .title("Site pages")
        .child(
          S.list()
            .title("Site pages")
            .initialValueTemplates([])
            .items([
              S.listItem()
                .id("featuresPage")
                .title("Features")
                .child(
                  S.document()
                    .schemaType("featuresPage")
                    .documentId("featuresPage")
                    .title("Features"),
                ),
              S.listItem()
                .id("aboutPage")
                .title("About")
                .child(
                  S.document()
                    .schemaType("aboutPage")
                    .documentId("aboutPage")
                    .title("About"),
                ),
              S.divider(),
              S.listItem()
                .id("privacyPage")
                .title("Privacy Policy")
                .child(
                  S.document()
                    .schemaType("legalPage")
                    .documentId("privacyPage")
                    .initialValueTemplate("legalPage", { kind: "privacy" })
                    .title("Privacy Policy"),
                ),
              S.listItem()
                .id("termsPage")
                .title("Terms of Service")
                .child(
                  S.document()
                    .schemaType("legalPage")
                    .documentId("termsPage")
                    .initialValueTemplate("legalPage", { kind: "terms" })
                    .title("Terms of Service"),
                ),
            ]),
        ),
      S.divider(),
      S.documentTypeListItem("blogPost").title("Posts"),
      S.divider(),
      S.listItem()
        .title("Categories")
        .child(
          S.list()
            .title("Categories")
            .items(
              categories.map(([title, documentId]) =>
                S.listItem()
                  .id(documentId)
                  .title(title)
                  .child(
                    S.document()
                      .schemaType("blogCategory")
                      .documentId(documentId)
                      .title(title),
                  ),
              ),
            ),
        ),
      S.documentTypeListItem("blogTag").title("Tags"),
      S.documentTypeListItem("author").title("Authors"),
      S.divider(),
      S.listItem()
        .title("Blog settings")
        .child(
          S.document()
            .schemaType("blogSettings")
            .documentId("blogSettings")
            .title("Blog settings"),
        ),
      ...S.documentTypeListItems().filter(
        (item) => !managedDocumentTypes.has(item.getId() ?? ""),
      ),
    ]);
