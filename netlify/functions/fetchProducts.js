const { builder } = require("@netlify/functions");
const fetch = require("node-fetch");

async function handler(event, context) {
  try {
    const [, , type, topic1, topic2, topic3] = event.path.split("/");
    const apiKey = process.env.BEST_BUY_API_KEY;

    if (topic1 && topic2 && topic3) {
      let res = await fetch(
        `https://api.bestbuy.com/v1/products(search=${topic1}|search=${topic2}|search=${topic3})?format=json&show=sku,name,largeImage,shortDescription,thumbnailImage,url,salePrice&sort=sku&apiKey=${apiKey}`
      );

      let data = await res.json();

      let { products } = data;
      console.log("products", products);
      if (products && products.length > 0) {
        products.slice(0, 8);
      } else products = [];

      return {
        statusCode: 200,
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(products),
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
