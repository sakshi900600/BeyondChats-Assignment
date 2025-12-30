// src/services/searchService.js
import axios from "axios";
import * as cheerio from "cheerio";

export const searchWeb = async (query) => {
  try {
    const searchUrl = `https://duckduckgo.com/html/?q=${encodeURIComponent(query)}`;

    const { data } = await axios.get(searchUrl, {
      headers: { "User-Agent": "Mozilla/5.0" }
    });

    const $ = cheerio.load(data);
    const results = [];

    $(".result").each((_, el) => {
      if (results.length >= 5) return;

      const title = $(el).find(".result__a").text();
      let url = $(el).find(".result__a").attr("href");
      const snippet = $(el).find(".result__snippet").text();

      if (url?.startsWith("/l/?")) {
        url = "https://duckduckgo.com" + url;
      }

      if (title && url) {
        results.push({ title, url, snippet });
      }
    });

    return results;
  } catch (err) {
    console.error("❌ DuckDuckGo search failed:", err.message);
    return [];
  }
};

export const scrapeTopArticles = async (searchResults) => {
  const contents = [];
  const referenceUrls = [];

  for (let i = 0; i < Math.min(2, searchResults.length); i++) {
    const url = searchResults[i].url;

    try {
      const { data } = await axios.get(url, {
        headers: { "User-Agent": "Mozilla/5.0" }
      });

      const $ = cheerio.load(data);
      let content = "";

      $("p").each((_, el) => {
        const text = $(el).text().trim();
        if (text.length > 50) content += text + "\n\n";
      });

      if (content.length > 200) {
        contents.push(content);
        referenceUrls.push(url);
      }
    } catch {
      console.warn("⚠️ Failed to scrape:", url);
    }
  }

  return { scrapedContents: contents, referenceUrls };
};
