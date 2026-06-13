import React, { createContext, useState, useEffect } from 'react';
import { blog_data as initialBlogData, comments_data as initialCommentsData } from '../assets/QuickBlog-Assets/assets';

export const BlogContext = createContext();

export const BlogProvider = ({ children }) => {
  const [blogs, setBlogs] = useState([]);
  const [comments, setComments] = useState([]);
  const [apiKey, setApiKeyState] = useState('');
  const [theme, setTheme] = useState('dark'); // 'dark' or 'light'
  const [aiUsageCount, setAiUsageCount] = useState(0);

  // New User & Subscription States
  const [currentUser, setCurrentUser] = useState(null);
  const [users, setUsers] = useState([]);
  const [subscribers, setSubscribers] = useState([]);

  // Initialize data from localStorage or fallback to mock assets
  useEffect(() => {
    const savedBlogs = localStorage.getItem('qb_blogs');
    const savedComments = localStorage.getItem('qb_comments');
    const savedApiKey = localStorage.getItem('qb_api_key');
    const savedTheme = localStorage.getItem('qb_theme') || 'dark';
    const savedUsage = localStorage.getItem('qb_ai_usage') || '0';
    const savedCurrentUser = localStorage.getItem('qb_current_user');
    const savedUsers = localStorage.getItem('qb_users');
    const savedSubscribers = localStorage.getItem('qb_subscribers');

    if (savedBlogs) {
      setBlogs(JSON.parse(savedBlogs));
    } else {
      setBlogs(initialBlogData);
      localStorage.setItem('qb_blogs', JSON.stringify(initialBlogData));
    }

    if (savedComments) {
      setComments(JSON.parse(savedComments));
    } else {
      setComments(initialCommentsData);
      localStorage.setItem('qb_comments', JSON.stringify(initialCommentsData));
    }

    if (savedApiKey) {
      setApiKeyState(savedApiKey);
    }

    setTheme(savedTheme);
    setAiUsageCount(parseInt(savedUsage, 10));

    // Apply initial theme class to HTML element
    if (savedTheme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }

    // Set User & Subscriber states
    if (savedCurrentUser) {
      setCurrentUser(JSON.parse(savedCurrentUser));
    }

    const initialUsers = [
      { name: 'Gourav', username: 'admin', password: 'admin', role: 'admin' },
      { name: 'John Doe', username: 'john', password: 'password', role: 'user' }
    ];
    if (savedUsers) {
      setUsers(JSON.parse(savedUsers));
    } else {
      setUsers(initialUsers);
      localStorage.setItem('qb_users', JSON.stringify(initialUsers));
    }

    const initialSubscribers = [
      'reader1@example.com',
      'developer@devnova.io',
      'startup_founder@gmail.com'
    ];
    if (savedSubscribers) {
      setSubscribers(JSON.parse(savedSubscribers));
    } else {
      setSubscribers(initialSubscribers);
      localStorage.setItem('qb_subscribers', JSON.stringify(initialSubscribers));
    }
  }, []);

  const saveBlogsToStorage = (updatedBlogs) => {
    setBlogs(updatedBlogs);
    localStorage.setItem('qb_blogs', JSON.stringify(updatedBlogs));
  };

  const saveCommentsToStorage = (updatedComments) => {
    setComments(updatedComments);
    localStorage.setItem('qb_comments', JSON.stringify(updatedComments));
  };

  const setApiKey = (key) => {
    setApiKeyState(key);
    localStorage.setItem('qb_api_key', key);
  };

  const toggleTheme = () => {
    const newTheme = theme === 'dark' ? 'light' : 'dark';
    setTheme(newTheme);
    localStorage.setItem('qb_theme', newTheme);
    if (newTheme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  };

  const incrementAiUsage = () => {
    const newCount = aiUsageCount + 1;
    setAiUsageCount(newCount);
    localStorage.setItem('qb_ai_usage', newCount.toString());
  };

  // --- User Authentication & Session Handlers ---
  const loginUser = (username, password) => {
    const foundUser = users.find(
      (u) => u.username.toLowerCase() === username.toLowerCase() && u.password === password
    );
    if (foundUser) {
      setCurrentUser(foundUser);
      localStorage.setItem('qb_current_user', JSON.stringify(foundUser));
      // Sync Admin state for legacy compatibility
      if (foundUser.role === 'admin') {
        localStorage.setItem('qb_admin_logged_in', 'true');
      } else {
        localStorage.setItem('qb_admin_logged_in', 'false');
      }
      return foundUser;
    } else {
      throw new Error('Invalid username or password.');
    }
  };

  const registerUser = (name, username, password) => {
    const exists = users.some((u) => u.username.toLowerCase() === username.toLowerCase());
    if (exists) {
      throw new Error('Username already exists.');
    }
    const newUser = { name, username, password, role: 'user' };
    const updatedUsers = [...users, newUser];
    setUsers(updatedUsers);
    localStorage.setItem('qb_users', JSON.stringify(updatedUsers));
    setCurrentUser(newUser);
    localStorage.setItem('qb_current_user', JSON.stringify(newUser));
    localStorage.setItem('qb_admin_logged_in', 'false');
    return newUser;
  };

  const logoutUser = () => {
    setCurrentUser(null);
    localStorage.removeItem('qb_current_user');
    localStorage.setItem('qb_admin_logged_in', 'false');
  };

  // --- Subscriber & Newsletter handlers ---
  const subscribeEmail = (email) => {
    const cleanEmail = email.trim().toLowerCase();
    if (!cleanEmail) return false;
    if (subscribers.includes(cleanEmail)) return true;
    const updatedSubscribers = [...subscribers, cleanEmail];
    setSubscribers(updatedSubscribers);
    localStorage.setItem('qb_subscribers', JSON.stringify(updatedSubscribers));
    return true;
  };

  const sendNewsletterToAll = async (subject, content) => {
    await new Promise((resolve) => setTimeout(resolve, 2000));
    console.log(`Simulated sending newsletter: "${subject}" to ${subscribers.length} recipients.`);
    return true;
  };

  // --- CRUD Operations for Blogs ---
  const addBlog = (blog) => {
    const newBlog = {
      _id: Math.random().toString(36).substr(2, 9),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      isPublished: true,
      commentsCount: 0,
      __v: 0,
      ...blog,
    };
    const updated = [newBlog, ...blogs];
    saveBlogsToStorage(updated);
    return newBlog;
  };

  const updateBlog = (id, updatedFields) => {
    const updated = blogs.map((b) => (b._id === id ? { ...b, ...updatedFields, updatedAt: new Date().toISOString() } : b));
    saveBlogsToStorage(updated);
  };

  const deleteBlog = (id) => {
    const updated = blogs.filter((b) => b._id !== id);
    saveBlogsToStorage(updated);
    // Also remove associated comments
    const updatedComments = comments.filter((c) => c.blog && c.blog._id !== id);
    saveCommentsToStorage(updatedComments);
  };

  // --- CRUD Operations for Comments ---
  const addComment = (blogId, name, content) => {
    const targetBlog = blogs.find((b) => b._id === blogId);
    if (!targetBlog) return;

    const newComment = {
      _id: Math.random().toString(36).substr(2, 9),
      blog: {
        _id: targetBlog._id,
        title: targetBlog.title,
        category: targetBlog.category,
      },
      name: name || 'Anonymous Reader',
      content,
      isApproved: false, // Moderated by default
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    const updated = [newComment, ...comments];
    saveCommentsToStorage(updated);
    return newComment;
  };

  const approveComment = (commentId) => {
    const updated = comments.map((c) => (c._id === commentId ? { ...c, isApproved: true } : c));
    saveCommentsToStorage(updated);
  };

  const deleteComment = (commentId) => {
    const updated = comments.filter((c) => c._id !== commentId);
    saveCommentsToStorage(updated);
  };

  // --- Gemini AI Fetch Handler ---
  const callGeminiAPI = async (promptText) => {
    try {
      const response = await fetch(
        `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${apiKey}`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            contents: [
              {
                parts: [
                  {
                    text: promptText,
                  },
                ],
              },
            ],
            generationConfig: {
              temperature: 0.7,
              maxOutputTokens: 2048,
            },
          }),
        }
      );

      if (!response.ok) {
        const err = await response.json();
        throw new Error(err.error?.message || 'Failed to fetch response from Gemini API');
      }

      const data = await response.json();
      return data.candidates?.[0]?.content?.parts?.[0]?.text || '';
    } catch (error) {
      console.error('Gemini API Error:', error);
      throw error;
    }
  };

  // --- AI Blog generator ---
  const generateBlogWithAI = async (prompt, category) => {
    incrementAiUsage();
    if (!apiKey) {
      // Return high-quality mock after small delay
      await new Promise((resolve) => setTimeout(resolve, 2000));
      return getMockBlogGeneration(prompt, category);
    }

    const systemPrompt = `You are an expert content creator. Generate a premium blog post in JSON format based on this prompt: "${prompt}" and category: "${category}".
Return ONLY a valid JSON object. Do NOT wrap the JSON in markdown code blocks like \`\`\`json or \`\`\`. 

The JSON object must have exactly these keys:
1. "title": A catchy, SEO-optimized title.
2. "subTitle": A descriptive subtitle.
3. "description": The full blog post body formatted in rich, clean HTML. Organize it into clear sections with <h2>, <h3/> headers, <p>, <ul>, <li>, and <strong> tags. Include detailed paragraphs, code snippets if appropriate, and actionable advice. Make it feel authoritative and complete (around 400-600 words).

Example structure:
{
  "title": "...",
  "subTitle": "...",
  "description": "<h2>...</h2><p>...</p>"
}
`;

    try {
      const resultText = await callGeminiAPI(systemPrompt);
      // Clean JSON blocks if Gemini returned them
      let cleanedText = resultText.trim();
      if (cleanedText.startsWith('```')) {
        cleanedText = cleanedText.replace(/^```json\s*/i, '').replace(/```$/, '').trim();
      }
      return JSON.parse(cleanedText);
    } catch (e) {
      console.warn('Failed to parse real Gemini JSON, falling back to clean text conversion', e);
      // If parsing fails, create a standard object
      return {
        title: `AI Insights: ${prompt.slice(0, 50)}...`,
        subTitle: `Deep-dive exploration into ${category}`,
        description: `<h2>Introduction</h2><p>Following our exploration into "${prompt}", here are the key findings.</p><h3>Detailed Analysis</h3><p>We analyzed this topic in depth and found several crucial factors that influence the outcome. Consistent efforts, proper planning, and leveraging modern toolsets are critical to success.</p><h2>Conclusion</h2><p>To summarize, the findings show a positive trend toward integration and automation in this field.</p>`,
      };
    }
  };

  // --- AI Brainstorm Generator ---
  const generateBrainstormIdeasWithAI = async (topic, category) => {
    incrementAiUsage();
    if (!apiKey) {
      await new Promise((resolve) => setTimeout(resolve, 2000));
      return getMockBrainstormIdeas(topic, category);
    }

    const systemPrompt = `You are a creative blog consultant. Generate 5 unique blog post ideas based on the topic: "${topic}" and category: "${category}".
Return ONLY a valid JSON array of 5 objects. Do NOT wrap the JSON in markdown code blocks like \`\`\`json or \`\`\`. 

Each object must have exactly these keys:
1. "title": A catchy, SEO-friendly title.
2. "teaser": A one-sentence teaser/subtitle.
3. "audience": Who this post is targeting (e.g. Beginners, Advanced developers, Managers).
4. "keywords": A comma-separated string of 3-4 keywords.
5. "outline": A list of 3-4 sections representing the structure of the post.

Example structure:
[
  {
    "title": "Title 1",
    "teaser": "Teaser 1",
    "audience": "...",
    "keywords": "...",
    "outline": ["Introduction", "Main Point 1", "Conclusion"]
  },
  ...
]
`;

    try {
      const resultText = await callGeminiAPI(systemPrompt);
      let cleanedText = resultText.trim();
      if (cleanedText.startsWith('```')) {
        cleanedText = cleanedText.replace(/^```json\s*/i, '').replace(/```$/, '').trim();
      }
      return JSON.parse(cleanedText);
    } catch (e) {
      console.warn('Failed to parse Gemini brainstorming JSON, returning fallback mock', e);
      return getMockBrainstormIdeas(topic, category);
    }
  };

  // --- AI Newsletter Generator ---
  const generateNewsletterWithAI = async (topic, articleTitles) => {
    incrementAiUsage();
    if (!apiKey) {
      await new Promise((resolve) => setTimeout(resolve, 1500));
      return getMockNewsletter(topic, articleTitles);
    }

    const systemPrompt = `You are an email marketer. Write a professional, engaging promotional newsletter email copy to promote these recent blog posts: "${articleTitles.join(', ')}" under the theme "${topic}".
Return ONLY a valid JSON object. Do NOT wrap the JSON in markdown code blocks.

The JSON object must have exactly these keys:
1. "subject": An attention-grabbing email subject line.
2. "body": The email body formatted in clean, inline-styled HTML (with spacing, friendly greetings, bulleted lists, and a warm sign-off). Do not include <html> or <body> tags, just content tags like <p>, <h2>, <ul>, <li>.

Example structure:
{
  "subject": "...",
  "body": "<p>Hi Subscriber!</p>..."
}
`;

    try {
      const resultText = await callGeminiAPI(systemPrompt);
      let cleanedText = resultText.trim();
      if (cleanedText.startsWith('```')) {
        cleanedText = cleanedText.replace(/^```json\s*/i, '').replace(/```$/, '').trim();
      }
      return JSON.parse(cleanedText);
    } catch (e) {
      console.warn('Failed to parse Gemini newsletter JSON, using mock fallback', e);
      return getMockNewsletter(topic, articleTitles);
    }
  };

  // --- AI Summary (Takeaways) Generator ---
  const summarizeBlogWithAI = async (blog) => {
    incrementAiUsage();
    if (!apiKey) {
      await new Promise((resolve) => setTimeout(resolve, 1500));
      return getMockSummary(blog.title, blog.category);
    }

    const systemPrompt = `You are an AI summarizer. Summarize this blog post into 3 to 5 core key takeaways.
Article Title: ${blog.title}
Article Content: ${blog.description}

Return ONLY a valid JSON array of strings, for example:
["First key point of the article.", "Second key point of the article.", "Third key point."]
Do NOT wrap the array in markdown code blocks.`;

    try {
      const resultText = await callGeminiAPI(systemPrompt);
      let cleanedText = resultText.trim();
      if (cleanedText.startsWith('```')) {
        cleanedText = cleanedText.replace(/^```json\s*/i, '').replace(/```$/, '').trim();
      }
      return JSON.parse(cleanedText);
    } catch (e) {
      console.warn('Failed to parse Gemini summary array, using bullet extract', e);
      return [
        `Main Focus: The core thesis of the article centers around optimizing ${blog.category} practices.`,
        'Action Item: Implement structured checks and consistent feedback loops.',
        'Final Verdict: Investing time to understand the basics pays off exponentially in the long run.',
      ];
    }
  };

  // --- AI Chatbot specific to article ---
  const askAIChatbot = async (blog, query, chatHistory) => {
    incrementAiUsage();
    if (!apiKey) {
      await new Promise((resolve) => setTimeout(resolve, 1000));
      return getMockChatResponse(blog.title, query);
    }

    const formattedHistory = chatHistory
      .map((msg) => `${msg.sender === 'user' ? 'User' : 'Assistant'}: ${msg.text}`)
      .join('\n');

    const systemPrompt = `You are an AI learning assistant for the blog post titled "${blog.title}".
The article category is: ${blog.category}
The article full HTML content is:
${blog.description}

Your task is to answer the user's questions about this specific article. Rely ONLY on the article content. If the answer cannot be inferred from the article, say so politely but offer closely related information from the article. Keep answers concise (under 120 words), readable, and structured with paragraphs or lists.

Chat History:
${formattedHistory}
User: ${query}
Assistant:`;

    try {
      return await callGeminiAPI(systemPrompt);
    } catch (error) {
      return `I encountered an issue connecting to Gemini. However, based on the article "${blog.title}", the key takeaways are highly relevant to your question. Please let me know if you would like me to summarize them!`;
    }
  };

  // --- Global AI Search Assistant ---
  const askGlobalAI = async (query) => {
    incrementAiUsage();
    // Gather simple blog list for AI context
    const blogIndexInfo = blogs.map((b) => ({ id: b._id, title: b.title, category: b.category, subTitle: b.subTitle }));
    const contextString = JSON.stringify(blogIndexInfo);

    if (!apiKey) {
      await new Promise((resolve) => setTimeout(resolve, 1200));
      return getMockGlobalSearch(blogs, query);
    }

    const systemPrompt = `You are the AI Search Guide for QuickBlog.
Here is the index of available blog posts on our platform:
${contextString}

The user is asking: "${query}"

Help the user find the right posts. You must recommend 1 to 3 specific posts from the index above if they are relevant.
Formulate a friendly, concise response (under 150 words). Format the response in standard Markdown.
To link to a blog post, use this exact HTML anchor format:
<a href="/blog/[ID]" class="text-primary hover:underline font-medium">[Title]</a>

For example:
"If you are looking for advice on lifestyle, I highly recommend checking out <a href="/blog/6805ee7dd8f584af5da78d37" class="text-primary hover:underline font-medium">A detailed step by step guide to manage your lifestyle</a> which discusses healthy routines."

If no posts are relevant, politely mention that we don't have articles on that exact topic, but suggest the closest alternative from our categories: ${blogCategories().join(', ')}.`;

    try {
      return await callGeminiAPI(systemPrompt);
    } catch (error) {
      return `I couldn't process this request. Feel free to browse our categories: ${blogCategories().join(', ')}!`;
    }
  };

  const blogCategories = () => ['All', 'Technology', 'Startup', 'Lifestyle', 'Finance'];

  // --- High-Fidelity Mock AI Fallbacks ---
  const getMockBlogGeneration = (prompt, category) => {
    const normalizedPrompt = prompt.toLowerCase();
    
    let title = `Exploring ${prompt.charAt(0).toUpperCase() + prompt.slice(1)}`;
    let subTitle = `Unlocking the potential of ${category} through systematic strategies.`;
    let description = '';

    if (normalizedPrompt.includes('tailwind') || normalizedPrompt.includes('css') || normalizedPrompt.includes('style')) {
      title = 'Mastering Tailwind CSS v4: The Future of Modern Styling';
      subTitle = 'A developer-first guide to utilizing CSS-first configurations, lightning-fast compiler, and utility variables.';
      description = `<h2>Why Tailwind CSS v4 is a Game Changer</h2>
      <p>Tailwind CSS v4.0 is a complete ground-up rewrite, shipping with an all-new Rust-based compiler engine that is up to 10x faster. It represents a paradigm shift in how we configure utility styles in React, replacing the bulky JavaScript files with a clean, CSS-first declaration.</p>
      
      <h3>Key Upgrades in Tailwind v4</h3>
      <ul>
        <li><strong>Rust-Powered Compiler:</strong> Compilation is practically instantaneous, meaning you get hot module replacement in Vite in under 10ms.</li>
        <li><strong>CSS-First Configuration:</strong> No more <code>tailwind.config.js</code>. Configure everything directly inside your <code>index.css</code> using the <code>@theme</code> directive.</li>
        <li><strong>Automatic Content Detection:</strong> Tailwind v4 scans all files in your project automatically, so you don't have to maintain paths in arrays.</li>
        <li><strong>Native Cascade Layers:</strong> Uses built-in CSS cascade layers under the hood for cleaner specificity resolution.</li>
      </ul>
      
      <h3>Practical Code Example</h3>
      <p>Here is how you can easily define custom colors inside your <code>index.css</code> file now:</p>
      <pre class="bg-gray-900 text-cyan-400 p-4 rounded-md my-4 font-mono text-xs overflow-x-auto">
@import "tailwindcss";

@theme {
  --color-primary: #6366f1;
  --color-secondary: #a855f7;
  --color-neon-blue: #06b6d4;
}</pre>

      <h2>Conclusion</h2>
      <p>By shifting to an native-CSS approach and integrating Rust compiling, the Tailwind team has made utility styling more maintainable, performant, and enjoyable. Give it a spin on your next React/Vite project!</p>`;
    } else if (normalizedPrompt.includes('startup') || normalizedPrompt.includes('business') || normalizedPrompt.includes('money') || normalizedPrompt.includes('grow')) {
      title = 'The Lean Startup Playbook: Scaling on a Shoestring Budget';
      subTitle = 'How modern founders leverage no-code, automation, and AI tools to hit product-market fit faster.';
      description = `<h2>The Myth of Big Funding</h2>
      <p>For years, the standard startup trajectory looked like this: raise seed capital, hire a team of ten, build a massive feature-rich platform, and then try to sell it. In the AI era, this playbook is officially broken. Lean operations are no longer just a necessity for survival—they are a competitive advantage.</p>
      
      <h3>1. Validate Before You Build</h3>
      <p>Never write a line of code or spend a dollar on design until you have confirmed demand. Set up a simple landing page with an email capture form and run $50 in highly-targeted social media ads. If people aren't clicking to join your waitlist, they won't buy your product.</p>
      
      <h3>2. Automate the Overhead</h3>
      <p>Modern founders use services like Zapier, Make, and Claude to run operations that used to require three employees. Your customer support, lead routing, and content publishing can be fully automated using webhook integrations.</p>
      
      <h3>3. Embrace the One-Person SaaS Model</h3>
      <p>We are seeing an influx of profitable businesses run by single developers or small co-founding duos. By focusing on niche B2B problems, you can charge premium subscriptions while maintaining nearly 95% profit margins.</p>
      
      <h2>Moving Forward</h2>
      <p>The next time you have a startup idea, challenge yourself: how can you validate it in 48 hours without spending a single dollar? That constraints leads to the ultimate business clarity.</p>`;
    } else if (normalizedPrompt.includes('ai') || normalizedPrompt.includes('gpt') || normalizedPrompt.includes('llm') || normalizedPrompt.includes('gemini') || normalizedPrompt.includes('bot')) {
      title = 'Integrating Generative AI in React Applications';
      subTitle = 'A blueprint for implementing client-side LLM calls, streaming content, and mock-fallback systems.';
      description = `<h2>The Era of Agentic Apps</h2>
      <p>Integrating artificial intelligence into your application isn't just about embedding a generic chat window anymore. It's about contextualizing AI features so that users get micro-assistance where they need it most—whether that's summarizing an article, generating content drafts, or answering specific context-based questions.</p>
      
      <h3>Direct Client-Side Calls vs. Server Proxies</h3>
      <p>For proof-of-concept apps and private builder spaces, calling Gemini or OpenAI directly from the frontend using fetch requests speeds up development. It requires storing the API key in the browser's <code>localStorage</code>, which is safe since the key is never exposed to public users and remains strictly on the client's device.</p>
      
      <h3>Streaming Content for Better UX</h3>
      <p>AI generation can take several seconds. To keep users engaged, implement typewriter animation effects or standard streaming endpoints. A pulsing glow animation on text containers signifies active thoughts and gives the UI a premium, responsive feel.</p>
      
      <h3>Building Robust Fallbacks</h3>
      <p>Always build high-fidelity Mock AI modes. If the user doesn't have an API key, the app should gracefully degrade to mock simulation mode. This lets prospective users experience the full layout flow and interactions before committing their private credentials.</p>
      
      <h2>Summary</h2>
      <p>AI-driven experiences are the new baseline. Combining modern React patterns with responsive visual loaders ensures your AI features feel fast, premium, and context-aware.</p>`;
    } else {
      // General Template
      title = `Ultimate Guide to Success in ${category}`;
      subTitle = `Empowering your workflow with key principles: "${prompt}".`;
      description = `<h2>Introduction to ${category}</h2>
      <p>In today's fast-paced environment, mastering the core foundations of <strong>${category}</strong> is essential. Let's explore how focusing on: <em>"${prompt}"</em> can dramatically accelerate your results.</p>
      
      <h3>Key Pillars for Development</h3>
      <ul>
        <li><strong>Intentional Learning:</strong> Dedicate 20 minutes a day to practicing new concepts in isolation.</li>
        <li><strong>Modern Automation:</strong> Outsource repetitive tasks to free up cognitive bandwidth for high-impact decision making.</li>
        <li><strong>Continuous Feedback:</strong> Show your work early and often. Take constructive criticism as free guidance.</li>
      </ul>
      
      <h3>Actionable Checklist</h3>
      <p>To begin implementing these concepts today, take the following steps:</p>
      <ol>
        <li>Establish a clean workspace and block notifications.</li>
        <li>Draft a 1-page roadmap outline highlighting weekly goals.</li>
        <li>Iterate and refine. Consistency over perfection is your ultimate goal.</li>
      </ol>
      
      <h2>Conclusion</h2>
      <p>Whether you are pursuing Technology, Startup growth, Finance stability, or Lifestyle upgrades, the formula remains the same: validate, execute, automate, and iterate. Start today!</p>`;
    }

    return { title, subTitle, description };
  };

  const getMockSummary = (title, category) => {
    return [
      `Core Subject: Focuses on leveraging optimal strategies within the ${category} framework.`,
      `Practical Insight: Emphasizes that consistency, attention to detail, and modern automated tools outperform raw hours of labor.`,
      `Actionable Takeaway: Start by isolating small components of your workflow and refining them step by step.`,
      `Key Takeaway: Storing key parameters locally enables faster development speeds and offline capability.`,
    ];
  };

  const getMockChatResponse = (title, query) => {
    const q = query.toLowerCase();
    if (q.includes('summary') || q.includes('summarize') || q.includes('takeaway')) {
      return `Here is a summary of the article "${title}": It outlines the core principles of optimization in its category, emphasizing that proper tools and clean workflows lead to higher productivity. The main actionable advice is to focus on quality and structure rather than brute-force speed.`;
    }
    if (q.includes('why') || q.includes('how') || q.includes('reason')) {
      return `According to the article "${title}", we achieve our best results by breaking down complex processes into small, manageable milestones. By automating repetitive tasks and using lightweight libraries (like utility CSS or React Context), we free up critical mental bandwidth to focus on creative tasks.`;
    }
    return `That's an interesting question about "${title}"! In the context of this post, success is achieved through building clean, structured models and testing them early. If you apply this methodology to your current projects, it will help you catch issues early and design more scalable systems. Let me know if you would like me to detail a specific section!`;
  };

  const getMockGlobalSearch = (allBlogs, query) => {
    const q = query.toLowerCase();
    
    // Filter blogs based on keywords
    const matches = allBlogs.filter(
      (b) =>
        b.title.toLowerCase().includes(q) ||
        b.category.toLowerCase().includes(q) ||
        b.subTitle.toLowerCase().includes(q)
    );

    if (matches.length > 0) {
      const links = matches
        .map((b) => `- <a href="/blog/${b._id}" class="text-primary hover:underline font-medium">${b.title}</a> (Category: ${b.category})`)
        .join('\n');
      return `I found **${matches.length} matching article(s)** for your query "${query}":\n\n${links}\n\nFeel free to click any of the links above to read the full article!`;
    }

    // Default recommendation if no matches
    const randomBlogs = allBlogs.slice(0, 2);
    const links = randomBlogs
      .map((b) => `- <a href="/blog/${b._id}" class="text-primary hover:underline font-medium">${b.title}</a> (${b.category})`)
      .join('\n');
    return `I couldn't find any specific articles matching "${query}". However, here are some popular posts on our platform you might find interesting:\n\n${links}\n\nOr you can browse our main categories: **Technology, Startup, Lifestyle, and Finance** on the home page!`;
  };

  const getMockBrainstormIdeas = (topic, category) => {
    return [
      {
        title: `The Ultimate Guide to ${topic || 'Innovation'} in ${category}`,
        teaser: `Discover how applying fundamental principles can double your efficiency and output.`,
        audience: `Professionals, Intermediate Learners`,
        keywords: `${topic || 'guide'}, ${category}, efficiency, scaling`,
        outline: [`Introduction to ${topic}`, `Key Frameworks for Success`, `Actionable Case Studies`, `Summary and Next Steps`]
      },
      {
        title: `5 Common Mistakes Beginners Make with ${topic || 'this Category'}`,
        teaser: `Avoid these costly pitfalls to speed up your learning curve and achieve results faster.`,
        audience: `Beginners, Enthusiasts`,
        keywords: `errors, pitfalls, ${topic || 'learning'}, tips`,
        outline: [`The Trap of Over-complexity`, `Neglecting the Basics`, `Ignoring feedback loops`, `How to Pivot Correctly`]
      },
      {
        title: `Why ${topic || 'Modern Systems'} are Redefining the Future of ${category}`,
        teaser: `An analytical breakdown of trends, data, and future forecasts for this decade.`,
        audience: `Executives, Researchers, Tech-savvy Readers`,
        keywords: `future, trends, ${category}, industry shift`,
        outline: [`The Current State of Play`, `Disruptive Technological Impacts`, `Predictions for the Next 5 Years`, `How to Stay Ahead`]
      },
      {
        title: `A Step-by-Step Checklist to Launch Your First ${topic || 'Project'}`,
        teaser: `Launch with confidence using this comprehensive, battle-tested launch sequence.`,
        audience: `Founders, Creators, Builders`,
        keywords: `checklist, tutorial, launch, guide`,
        outline: [`Phase 1: Pre-launch validation`, `Phase 2: Setting up Core Assets`, `Phase 3: Execution & Launch`, `Phase 4: Post-launch analytics`]
      },
      {
        title: `How We Built a Scalable Solution for ${topic || 'Our Business'} in 48 Hours`,
        teaser: `A behind-the-scenes engineering and design story of rapid prototyping and deployment.`,
        audience: `Developers, Product Managers`,
        keywords: `case study, 48 hours, prototyping, MVP`,
        outline: [`Defining the Problem Statement`, `Choosing the Tech Stack`, `Building the Core Loop`, `Measuring the Success Metric`]
      }
    ];
  };

  const getMockNewsletter = (topic, articleTitles) => {
    const linksHtml = articleTitles.map(title => `<li style="margin-bottom: 8px;"><strong>${title}</strong> - <span style="color: #6366f1;">Read full article &rarr;</span></li>`).join('');
    return {
      subject: `Weekly DevNova Digest: Spotlight on ${topic || 'Latest Trends'}`,
      body: `<p>Hey Reader,</p>
      <p>Welcome to our weekly newsletter! This week, we are diving deep into the world of <strong>${topic || 'modern creators'}</strong>.</p>
      <p>Here are some of the popular stories you might have missed on DevNova:</p>
      <ul style="padding-left: 20px; line-height: 1.8; margin: 15px 0;">
        ${linksHtml || '<li>No recent articles to display, check out our home page!</li>'}
      </ul>
      <p>We hope these articles help you level up your workflow. Reply to this email with your thoughts - we read every single message!</p>
      <p>Warmly,<br/><strong>The DevNova Team</strong></p>`
    };
  };

  return (
    <BlogContext.Provider
      value={{
        blogs,
        comments,
        apiKey,
        theme,
        aiUsageCount,
        currentUser,
        users,
        subscribers,
        setApiKey,
        toggleTheme,
        addBlog,
        updateBlog,
        deleteBlog,
        addComment,
        approveComment,
        deleteComment,
        generateBlogWithAI,
        summarizeBlogWithAI,
        askAIChatbot,
        askGlobalAI,
        blogCategories,
        loginUser,
        registerUser,
        logoutUser,
        subscribeEmail,
        sendNewsletterToAll,
        generateBrainstormIdeasWithAI,
        generateNewsletterWithAI
      }}
    >
      {children}
    </BlogContext.Provider>
  );
};

