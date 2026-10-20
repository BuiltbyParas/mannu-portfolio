/**
 * Runs a tiny script during HTML parsing, before first paint. On the client the
 * type flips to text/plain so React neither re-runs it nor warns about it
 * (pattern from Next's "Preventing Flash" guide).
 */
export function InlineScript({ html }: { html: string }) {
  return (
    <script
      type={typeof window === "undefined" ? "text/javascript" : "text/plain"}
      suppressHydrationWarning
      dangerouslySetInnerHTML={{ __html: html }}
    />
  );
}
