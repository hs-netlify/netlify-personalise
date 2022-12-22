export const fetchProducts = async (query) => {
  try {
    let res = await fetch(
      `https://serpapi.com/search.json?q=${query}&tbm=shopz`,
      {
        headers: {
          Authorization: `Bearer ${process.env.GOOGLE_SEARCH_API_KEY}`,
        },
      }
    );

    let data = await res.json();
    const { inline_shopping_results: products } = data;
    return products.slice(0, 5);
  } catch (error) {
    console.log(error);
  }
};
