import axios from "axios";
import * as cheerio from "cheerio";
import Blog from "../models/Blog.js";

const BASE_URL = "https://beyondchats.com";
const LAST_PAGE = 15;
const REQUIRED = 5;

export const scrapeOldestBlogs = async () => {
  try {
    const blogLinks = [];

    // 1️⃣ Collect oldest blog URLs (page bottom → top)
    for (let page = LAST_PAGE; page >= 1; page--) {
      if (blogLinks.length >= REQUIRED) break;

      const pageUrl = `${BASE_URL}/blogs/page/${page}/`;
      console.log("Scraping page:", pageUrl);

      const { data } = await axios.get(pageUrl);
      const $ = cheerio.load(data);

      // ✅ Reverse articles (oldest first inside page)
      const articles = $("article.entry-card").toArray().reverse();

      for (const article of articles) {
        if (blogLinks.length >= REQUIRED) break;

        const link = $(article)
          .find("h2.entry-title a")
          .attr("href");

        if (link && link.startsWith(`${BASE_URL}/blogs/`)) {
          if (!blogLinks.includes(link)) {
            blogLinks.push(link);
          }
        }
      }
    }

    // 2️⃣ Scrape individual blog pages
    for (const url of blogLinks) {
      const exists = await Blog.findOne({ originalUrl: url });
      if (exists) continue;

      const blogRes = await axios.get(url);
      const $ = cheerio.load(blogRes.data);

      const title = $("h1").first().text().trim();

      let content = $(".elementor-widget-theme-post-content").text().trim();
      if (!content) {
        content = $(".wp-block-post-content").text().trim();
      }

      if (!title || !content) {
        console.log("Skipping empty blog:", url);
        continue;
      }

      await Blog.create({
        title,
        originalContent: content,
        updatedContent: "",
        originalUrl: url,
        references: [],
        isUpdated: false
      });
    }

    console.log("✅ Successfully scraped 5 OLDEST blogs");
  } catch (err) {
    console.error("❌ Scraping failed:", err.message);
  }
};
