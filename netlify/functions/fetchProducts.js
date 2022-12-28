const { builder } = require("@netlify/functions");
const fetch = require("node-fetch");

const retriveProducts = async (topic) => {
  try {
    const apiKey = process.env.BEST_BUY_API_KEY;
    let res = await fetch(
      `https://api.bestbuy.com/v1/products(search=${topic})?format=json&show=sku,name,largeImage,shortDescription,thumbnailImage,url,salePrice&apiKey=${apiKey}`
    );

    let data = await res.json();

    const { products } = data;
    console.log("products", products);
    if (products.length > 0) {
      products.slice(0, 3);
    }
    return products;
  } catch (error) {
    console.log(error);
    return [];
  }
};
async function handler(event, context) {
  try {
    const [, , type, topic1, topic2, topic3] = event.path.split("/");

    if (topic1 && topic2 && topic3) {
      let products = await Promise.all([
        retriveProducts(topic1),
        retriveProducts(topic2),
        retriveProducts(topic3),
      ]);
      console.log("products", products);

      products.flat();

      return {
        statusCode: 200,
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(products),
      };
    } else throw new Error();
  } catch (error) {
    console.log(error);
    return {
      statusCode: 404,
      body: "Not Found",
    };
  }
}

exports.handler = builder(handler);
