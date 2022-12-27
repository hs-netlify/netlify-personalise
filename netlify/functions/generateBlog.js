const { builder } = require("@netlify/functions");
const fetch = require("node-fetch");

async function handler(event, context) {
  try {
    const [, , , type, topic] = event.path.split("/");

    console.log(topic);

    const resTitle = await fetch("https://api.openai.com/v1/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "text-curie-001",
        prompt: `Write me a blog post title about ${topic}`,
        max_tokens: 1000,
      }),
    });

    const dataTitle = await resTitle.json();

    const title = dataTitle?.choices[0].text.slice(0, 50);
    const res = await fetch("https://api.openai.com/v1/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "text-curie-001",
        prompt: `Write me a blog post about ${title}`,
        max_tokens: 1000,
      }),
    });

    const data = await res.json();

    const post = data?.choices[0].text;

    const imageRes = await fetch(
      `https://serpapi.com/search.json?q=${topic}&tbm=isch&ijn=0&api_key=${process.env.GOOGLE_SEARCH_API_KEY}`
    );

    const imageRaw = await imageRes.json();

    let image = imageRaw["images_results"][0].original;

    let json = {
      title,
      image,
      post,
    };

    return {
      statusCode: 200,
      body: JSON.stringify(json),
    };
  } catch (error) {
    console.log(error);
    return {
      statusCode: 404,
      body: "Not Found",
    };
  }
}

exports.handler = builder(handler);
