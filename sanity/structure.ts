import type { StructureResolver } from "sanity/structure";

const managedDocumentTypes = new Set([
  "blogPost",
  "blogCategory",
  "blogTag",
  "author",
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
    .items([
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
