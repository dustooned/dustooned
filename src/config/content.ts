export function contentSlug(id: string) {
  return id.replace(/\.(md|mdx)$/, "");
}
