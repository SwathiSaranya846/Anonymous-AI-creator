import Parser from "rss-parser";

const parser = new Parser({
  timeout: 15000,
  headers: {
    "User-Agent": "Autonomous-AI-Creator/1.0"
  }
});

const FEEDS = [
  {
    name: "TechCrunch AI",
    url: "https://techcrunch.com/category/artificial-intelligence/feed/"
  },
  {
    name: "MIT Technology Review",
    url: "https://www.technologyreview.com/feed/"
  },
  {
    name: "Hugging Face Blog",
    url: "https://huggingface.co/blog/feed.xml"
  }
];

function clean(value) {
  return String(value || "").replace(/\s+/g, " ").trim();
}

export async function discoverTopics(limit = 8) {
  const results = await Promise.allSettled(
    FEEDS.map(async (feed) => {
      const parsed = await parser.parseURL(feed.url);
      return parsed.items.slice(0, 10).map((item) => ({
        title: clean(item.title),
        summary: clean(item.contentSnippet || item.content || item.summary),
        link: item.link,
        publishedAt: item.isoDate || item.pubDate || null,
        sourceName: feed.name
      }));
    })
  );

  const topics = results
    .filter((r) => r.status === "fulfilled")
    .flatMap((r) => r.value)
    .filter((item) => item.title && item.link);

  const unique = [];
  const seen = new Set();

  for (const item of topics) {
    const key = item.title.toLowerCase();
    if (!seen.has(key)) {
      seen.add(key);
      unique.push(item);
    }
  }

  return unique.slice(0, limit);
}
