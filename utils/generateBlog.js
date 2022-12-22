export const generateBlog = async (query) => {
  try {
    const resTitle = await fetch("https://api.openai.com/v1/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "text-curie-001",
        prompt: `Write me a blog post title about ${query}`,
        max_tokens: 2000,
      }),
    });

    const dataTitle = await resTitle.json();

    const title = dataTitle.choices[0].text;

    const res = await fetch("https://api.openai.com/v1/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "text-curie-001",
        prompt: `Write me a blog post about ${title}`,
        max_tokens: 2000,
      }),
    });

    const data = await res.json();

    const post = data.choices[0].text;

    const imageRes = await fetch(
      `https://serpapi.com/search.json?q=${query}&tbm=isch&ijn=0&api_key=${process.env.GOOGLE_SEARCH_API_KEY}`
    );

    const imageRaw = await imageRes.json();

    let image = imageRaw["images_results"][0].original;

    return {
      title,
      image,
      post,
    };
  } catch (error) {
    console.log(error);
  }
};
