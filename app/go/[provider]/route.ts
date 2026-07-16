const providerDestinations = {
  ondisk: (query: string) => {
    const url = new URL("https://new.ondisk.co.kr/contents");
    url.searchParams.set("cate", "ALL");
    url.searchParams.set("search", query);
    url.searchParams.set("search_type", "title");
    return url;
  },
  kdisk: (query: string) => {
    const url = new URL("https://www.kdisk.co.kr/index.php");
    url.searchParams.set("mode", "kdisk");
    url.searchParams.set("s_act", "ok");
    url.searchParams.set("search_type", "all");
    url.searchParams.set("search_keyword", "title");
    url.searchParams.set("search", query);
    return url;
  },
} as const;

export function GET(request: Request) {
  const requestUrl = new URL(request.url);
  const provider = requestUrl.pathname.split("/").filter(Boolean).at(-1);

  if (!provider || !(provider in providerDestinations)) {
    return Response.json({ error: "지원하지 않는 이동 경로입니다." }, { status: 404 });
  }

  const query = (requestUrl.searchParams.get("q") ?? "")
    .normalize("NFKC")
    .trim()
    .slice(0, 120);
  const destination =
    providerDestinations[provider as keyof typeof providerDestinations](query);

  return new Response(null, {
    status: 302,
    headers: {
      Location: destination.toString(),
      "Cache-Control": "no-store",
      "X-Robots-Tag": "noindex, nofollow",
    },
  });
}
