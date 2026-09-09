const BLOCK_TAGS = new Set([
  "html",
  "head",
  "body",
  "header",
  "nav",
  "main",
  "section",
  "article",
  "aside",
  "footer",
  "div",
  "form",
  "fieldset",
  "ul",
  "ol",
  "li",
  "table",
  "thead",
  "tbody",
  "tfoot",
  "tr",
  "h1",
  "h2",
  "h3",
  "h4",
  "h5",
  "h6",
  "p",
  "details",
  "summary",
  "script",
  "style",
  "link",
  "meta",
]);

const VOID_TAGS = new Set([
  "area",
  "base",
  "br",
  "col",
  "embed",
  "hr",
  "img",
  "input",
  "link",
  "meta",
  "param",
  "source",
  "track",
  "wbr",
]);

/**
 * Makes server-rendered HTML easier to inspect without touching text inside
 * scripts, styles, preformatted blocks, or textareas.
 */
export function formatHtml(source: string): string {
  const protectedBlocks: string[] = [];
  const protectedSource = source.replace(
    /<(script|style|pre|textarea)\b[^>]*>[\s\S]*?<\/\1\s*>/gi,
    (block) => {
      const token = `HTML_FORMATTER_RAW_${protectedBlocks.length}_TOKEN`;
      protectedBlocks.push(block);
      return token;
    },
  );

  const tokens = protectedSource.split(
    /(<!--[\s\S]*?-->|<!doctype[^>]*>|<\/?[a-z][^>]*>)/gi,
  );
  const lines: string[] = [];
  let inline = "";
  let depth = 0;

  const flushInline = () => {
    if (inline) {
      lines.push(`${"  ".repeat(depth)}${inline}`);
      inline = "";
    }
  };

  for (const token of tokens) {
    if (!token) continue;

    const match = token.match(/^<\s*(\/?)\s*([a-z0-9-]+)/i);
    const tag = match?.[2]?.toLowerCase();
    const isBlock = Boolean(tag && BLOCK_TAGS.has(tag));

    if (!isBlock) {
      inline += token;
      continue;
    }

    flushInline();
    const isClosing = match?.[1] === "/";
    const isVoid = Boolean(tag && VOID_TAGS.has(tag));
    const isSelfClosing = /\/\s*>$/.test(token);

    if (isClosing) depth = Math.max(0, depth - 1);
    lines.push(`${"  ".repeat(depth)}${token}`);
    if (!isClosing && !isVoid && !isSelfClosing) depth += 1;
  }

  flushInline();

  let result = lines.join("\n").trim();
  protectedBlocks.forEach((block, index) => {
    const token = `HTML_FORMATTER_RAW_${index}_TOKEN`;
    const formattedBlock = block.replace(
      /^(<(?:script|style|pre|textarea)\b[^>]*>)([\s\S]*)(<\/(?:script|style|pre|textarea)\s*>)$/i,
      "$1\n$2\n$3",
    );
    result = result.replace(token, formattedBlock);
  });

  return `${result}\n`;
}

export async function formatHtmlResponse(
  response: Response,
): Promise<Response> {
  const contentType = response.headers.get("content-type") ?? "";
  if (!contentType.toLowerCase().includes("text/html")) return response;

  const headers = new Headers(response.headers);
  headers.delete("content-length");

  return new Response(formatHtml(await response.text()), {
    status: response.status,
    statusText: response.statusText,
    headers,
  });
}
