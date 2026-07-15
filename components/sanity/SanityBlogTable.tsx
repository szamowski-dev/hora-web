import { PortableTextCell } from "@/components/sanity/PortableTextPrimitives";
import type { SanityBlogTableValue } from "@/sanity/lib/queries";

export function SanityBlogTable({ value }: { value: SanityBlogTableValue }) {
  const rows = value.rows ?? [];
  const headerRow = rows.find((row) => row.header);
  const bodyRows = rows.filter((row) => !row.header);

  if (!headerRow?.cells?.length) return null;

  return (
    <figure className="blog-wide not-prose my-10">
      <div className="overflow-x-auto rounded-lg border border-border bg-panel-deep">
        <table className="w-full min-w-[42rem] border-collapse text-left font-sans text-sm leading-6 text-muted">
          <thead className="bg-overlay-strong text-text">
            <tr>
              {headerRow.cells.map((cell, index) => (
                <th
                  key={cell._key ?? `header-${index}`}
                  scope="col"
                  className="border-b border-r border-border px-4 py-3 align-top font-semibold last:border-r-0"
                >
                  <PortableTextCell value={cell.content ?? []} />
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {bodyRows.map((row, rowIndex) => (
              <tr
                key={row._key ?? `row-${rowIndex}`}
                className="border-b border-border last:border-b-0"
              >
                {(row.cells ?? []).map((cell, cellIndex) => (
                  <td
                    key={cell._key ?? `cell-${rowIndex}-${cellIndex}`}
                    className="border-r border-border px-4 py-3 align-top last:border-r-0"
                  >
                    <PortableTextCell value={cell.content ?? []} />
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {value.caption ? (
        <figcaption className="mt-3 text-center font-sans text-sm leading-5 text-muted">
          {value.caption}
        </figcaption>
      ) : null}
    </figure>
  );
}
