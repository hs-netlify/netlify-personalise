export const fetchProducts = async (query, apiKey) => {
  try {
    let res = await fetch(
      `https://api.bestbuy.com/v1/products(search=oven)?format=json&show=sku,name,shortDescription,thumbnailImage,url,salePrice&apiKey=lbAlYvV6yHSyjRoMhpxclGm6`
    );

    let data = await res.json();

    console.log("data", data);

    const { products } = data;
    if (products.length > 0) {
      return products.slice(0, 9);
    } else {
      return [];
    }
  } catch (error) {
    console.log(error);
  }
};
