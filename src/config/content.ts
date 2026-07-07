export function contentSlug(id: string) {
  return id.replace(/\.(md|mdx)$/, "");
}

export function withBase(path: string | undefined) {
  if (!path) return path;
  if (/^(https?:)?\/\//.test(path) || path.startsWith("mailto:") || path.startsWith("#")) {
    return path;
  }

  const base = import.meta.env.BASE_URL.replace(/\/$/, "");
  if (path === "/") return `${base || "/"}`;
  return `${base}${path.startsWith("/") ? path : `/${path}`}`;
}
