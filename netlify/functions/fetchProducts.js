const { builder } = require("@netlify/functions");
const fetch = require("node-fetch");

async function handler(event, context) {
  const [, , type, topic1, topic2, topic3] = event.path.split("/");
  const apiKey = process.env.GOOGLE_SEARCH_API_KEY;

  const fetchProducts = async (query) => {
    let res = await fetch(
      `https://serpapi.com/search.json?q=${query}&tbm=shop&hl=en&api_key=${apiKey}`
    );

    let data = await res.json();

    let { shopping_results: products } = data;

    return products && products.length > 0
      ? products.slice(0, 3)
      : (products = []);
  };

  try {
    if (topic1 && topic2 && topic3) {
      let products = await Promise.all([
        fetchProducts(topic1),
        fetchProducts(topic2),
        fetchProducts(topic3),
      ]);

      return {
        statusCode: 200,
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(products.flat()),
      };
    } else {
      throw new Error();
    }
  } catch (error) {
    console.log(error);
    return {
      statusCode: 404,
      body: "Not Found",
    };
  }
}

exports.handler = builder(handler);
