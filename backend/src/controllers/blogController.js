import Blog from "../models/Blog.js";
import { searchWeb, scrapeTopArticles } from "../services/searchService.js";
import { rewriteBlogWithLLM } from "../services/llm.service.js";
import { delay } from "../utils/delay.js";

/* CRUD APIs */

export const getBlogs = async (req, res) => {
  try {
    const blogs = await Blog.find();
    res.json(blogs);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const getBlogById = async (req, res) => {
  try {
    const blog = await Blog.findById(req.params.id);
    if (!blog) {
      return res.status(404).json({ error: "Blog not found" });
    }
    res.json(blog);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const createBlog = async (req, res) => {
  try {
    const blog = await Blog.create(req.body);
    res.status(201).json(blog);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

export const updateBlog = async (req, res) => {
  try {
    const blog = await Blog.findByIdAndUpdate(req.params.id, req.body, { 
      new: true,
      runValidators: true 
    });
    if (!blog) {
      return res.status(404).json({ error: "Blog not found" });
    }
    res.json(blog);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

export const deleteBlog = async (req, res) => {
  try {
    const blog = await Blog.findByIdAndDelete(req.params.id);
    if (!blog) {
      return res.status(404).json({ error: "Blog not found" });
    }
    res.json({ message: "Blog deleted successfully" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

/* MAIN REWRITE PIPELINE */

export const rewriteOldestBlogs = async (req, res) => {
  // Send immediate response
  res.json({ 
    message: "Rewrite process started in background",
    status: "processing"
  });

  // Run the process asynchronously
  processRewrite().catch(err => {
    console.error("❌ Fatal error in rewrite pipeline:", err);
  });
};

async function processRewrite() {
  let successCount = 0;
  let failCount = 0;

  try {
    // Find oldest 5 blogs that haven't been updated
    const blogs = await Blog.find({ isUpdated: false })
      .sort({ createdAt: 1 })
      .limit(5);

    console.log(`\n${'='.repeat(60)}`);
    console.log(`📚 Starting rewrite process for ${blogs.length} blogs`);
    console.log(`${'='.repeat(60)}\n`);

    for (let index = 0; index < blogs.length; index++) {
      const blog = blogs[index];
      
      console.log(`\n${'─'.repeat(60)}`);
      console.log(`📝 BLOG ${index + 1}/${blogs.length}: "${blog.title}"`);
      console.log(`${'─'.repeat(60)}`);

      try {
        // Step 1: Search the web
        console.log(`\n🔍 Step 1: Searching for similar articles...`);
        const searchResults = await searchWeb(blog.title);
        
        if (!searchResults || searchResults.length < 2) {
          throw new Error(`Not enough search results found (got ${searchResults?.length || 0}, need at least 2)`);
        }

        // Step 2: Scrape exactly 2 blog articles
        console.log(`\n📄 Step 2: Scraping top 2 blog articles...`);
        const { scrapedContents, referenceUrls } = await scrapeTopArticles(searchResults);
        
        if (scrapedContents.length < 2) {
          throw new Error(`Could not scrape 2 valid blog articles (got ${scrapedContents.length})`);
        }

        console.log(`\n✅ Successfully scraped 2 blog articles:`);
        referenceUrls.forEach((url, i) => {
          console.log(`   ${i + 1}. ${url}`);
        });

        // Step 3: Rewrite using LLM
        console.log(`\n🤖 Step 3: Rewriting content with AI...`);
        const updatedContent = await rewriteBlogWithLLM(
          blog.originalContent,
          scrapedContents,
          referenceUrls
        );

        // Step 4: Update the blog in database
        console.log(`\n💾 Step 4: Saving to database...`);
        blog.updatedContent = updatedContent;
        blog.references = referenceUrls;
        blog.isUpdated = true;
        await blog.save();

        successCount++;
        console.log(`\n${'✅'.repeat(20)}`);
        console.log(`✅ SUCCESS! Blog "${blog.title}" updated successfully`);
        console.log(`   - Updated content: ${updatedContent.length} characters`);
        console.log(`   - References: ${referenceUrls.length} articles cited`);
        console.log(`${'✅'.repeat(20)}\n`);

        // Delay between requests
        if (index < blogs.length - 1) {
          console.log(`⏳ Waiting 10 seconds before next blog...\n`);
          await delay(10000);
        }

      } catch (err) {
        failCount++;
        console.error(`\n${'❌'.repeat(20)}`);
        console.error(`❌ FAILED: Could not process blog "${blog.title}"`);
        console.error(`   Error: ${err.message}`);
        console.error(`${'❌'.repeat(20)}\n`);
        
        // STOP THE ENTIRE PROCESS ON FIRST FAILURE
        console.log(`\n${'🛑'.repeat(20)}`);
        console.log(`🛑 STOPPING PROCESS: Failed on blog ${index + 1}`);
        console.log(`   Reason: ${err.message}`);
        console.log(`   Please fix the issue and try again`);
        console.log(`${'🛑'.repeat(20)}\n`);
        
        break; // Stop processing more blogs
      }
    }

    // Final summary
    console.log(`\n${'='.repeat(60)}`);
    console.log(`📊 FINAL SUMMARY`);
    console.log(`${'='.repeat(60)}`);
    console.log(`✅ Successfully updated: ${successCount} blog(s)`);
    console.log(`❌ Failed: ${failCount} blog(s)`);
    console.log(`${'='.repeat(60)}\n`);

  } catch (err) {
    console.error("\n❌ Fatal error in rewrite pipeline:", err.message);
    throw err;
  }
}