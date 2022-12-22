export const generateBlog = async (query) => {
  try {
    const res = await fetch("https://api.openai.com/v1/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "text-davinci-003",
        prompt: `Write me a blog post about ${query} including a title`,
        max_tokens: 2000,
      }),
    });

    const data = await res.json();

    const text = data.choices[0].text.split("\n").filter((para) => para);

    const title = text[0]
      .replaceAll('"', "")
      .replaceAll("'", "")
      .replaceAll("Title:", "");
    text.shift();
    const post = text.join("\n\n");
    console.log("text", title);
    console.log("post", post);

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
