import axios from "axios";
import * as cheerio from "cheerio";

/**
 * Filters out ads, sponsored links, e-commerce, and non-article URLs
 */
const isValidBlogUrl = (url) => {
  const invalidPatterns = [
    'amazon.', 'flipkart.', 'ebay.', 'walmart.', 'etsy.',
    'facebook.', 'twitter.', 'instagram.', 'youtube.', 'tiktok.',
    '.pdf'
  ];

  if (invalidPatterns.some(p => url.toLowerCase().includes(p))) {
    return false;
  }

  const validPatterns = [
    '/blog', '/article', '/guide', '/post', '/learn'
  ];

  return validPatterns.some(p => url.toLowerCase().includes(p));
};

export const searchWeb = async (query) => {
  try {
    const searchUrl = `https://html.duckduckgo.com/html/?q=${encodeURIComponent(query + " blog")}`;

    const { data } = await axios.get(searchUrl, {
      headers: {
        "User-Agent": "Mozilla/5.0"
      }
    });

    const $ = cheerio.load(data);
    const results = [];

    $(".result").each((_, el) => {
      if (results.length >= 2) return false; // 🔴 HARD LIMIT = 2

      let url = $(el).find(".result__a").attr("href");
      const title = $(el).find(".result__a").text().trim();

      if (url?.includes("duckduckgo.com/l/?")) {
        const params = new URLSearchParams(url.split("?")[1]);
        url = params.get("uddg");
      }

      if (title && url && url.startsWith("http") && isValidBlogUrl(url)) {
        results.push({ title, url });
        console.log(`  ✓ Valid blog found: ${url}`);
      }
    });

    console.log(`\n✓ Found ${results.length} valid blog/article URLs`);
    return results;

  } catch (err) {
    console.error("❌ Web search failed:", err.message);
    return [];
  }
};

export const scrapeTopArticles = async (searchResults) => {
  const scrapedContents = [];
  const referenceUrls = [];

  for (let i = 0; i < searchResults.length; i++) {
    const url = searchResults[i].url;

    try {
      console.log(`\n  📄 Scraping article ${i + 1}: ${url}`);

      const { data } = await axios.get(url, {
        headers: { "User-Agent": "Mozilla/5.0" },
        timeout: 15000
      });

      const $ = cheerio.load(data);
      $('script, style, nav, footer, header').remove();

      let content = "";
      $("p").each((_, el) => {
        const text = $(el).text().trim();
        if (text.length > 60 && text.length < 800) {
          content += text + "\n\n";
        }
      });

      if (content.length > 400) {
        scrapedContents.push(content.slice(0, 2000));
        referenceUrls.push(url);
        console.log(`  ✅ Successfully scraped ${content.length} characters`);
      }

    } catch (err) {
      console.warn(`  ⚠️ Failed to scrape ${url}: ${err.message}`);
    }
  }

  return { scrapedContents, referenceUrls };
};
