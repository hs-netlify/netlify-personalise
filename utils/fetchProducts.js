export const fetchProducts = async (query, apiKey) => {
  try {
    let res = await fetch(
      `https://api.rainforestapi.com/request?api_key=BA31D53C9D7348BBAA0A4B0474F36471&type=search&amazon_domain=amazon.com&search_term=${query}&sort_by=price_high_to_low&page=1`
    );

    let data = await res.json();

    const { search_results: products } = data;

    return products.slice(0, 5);
  } catch (error) {
    console.log(error);
  }
};
