import React, { useEffect, useState } from "react";
import Cookies from "js-cookie";
import { useRouter } from "next/router";
import NavBar from "../../components/navBar";
import AbSwitch from "../../components/abSwitch";

export const getStaticProps = async () => {
  let products = [];
  let message = "Welcome";
  let posts = [];
  let currency = null;
  return {
    props: {
      products,
      posts,
      message,
      currency,
    },
  };
};

const Home = ({ products, posts, message, currency }) => {
  const router = useRouter();
  const [hydratedPosts, setHydratedPosts] = useState([]);
  const [hydratedProducts, setHydratedProducts] = useState([]);
  useEffect(() => {
    setHydratedPosts(posts);
    setHydratedProducts(products);
  }, [products, posts]);

  let netlifyPersonaliseCookie = Cookies.get("netlifyPersonalise");
  let personalisedData = JSON.parse(
    netlifyPersonaliseCookie ? netlifyPersonaliseCookie : null
  );

  const handleClick = (index) => {
    router.push("/blog/" + personalisedData[`favourite${index}`]);
  };

  const clearCookies = () => {
    Cookies.remove("netlifyPersonalise");
    router.reload(window.location.pathname);
  };

  return (
    <div id="main-body" className="min-h-screen h-full">
      <NavBar className="z-10" />

      <a
        onClick={clearCookies}
        className="fixed text-center bottom-10 w-48 z-50 bg-indigo-600 hover:bg-indigo-700 rounded text-white  p-2 text-large cursor-pointer left-10"
      >
        Clear Cookies
      </a>
      <div className=" text-white bg-gray-700  font-bold tracking-tight px-20 py-4 z-0  shadow-lg">
        <h1 className="text-3xl  mx-auto max-w-7xl  px-10" id="personalBanner">
          {message}
        </h1>
        <h2 className="text-gray-300 text-2xl mx-auto max-w-7xl  px-10">
          This is your personalised experience
        </h2>
      </div>

      <div className="relative b px-4 pt-16 pb-20 sm:px-6 lg:px-8 lg:pt-24 lg:pb-28">
        <div className="absolute inset-0">
          <div className="h-1/3  sm:h-2/3" />
        </div>
        <div className="relative mx-auto max-w-7xl">
          <div className="text-center">
            <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">
              From the blog
            </h2>
            <p className="mx-auto mt-3 max-w-2xl text-xl text-gray-300 sm:mt-4">
              Check out these personalised blog posts created just for you!
            </p>
          </div>
          <div className="mx-auto mt-12 grid max-w-lg gap-5 lg:max-w-none lg:grid-cols-3">
            {hydratedPosts.map((post, index) => (
              <div
                key={Math.floor(Math.random() * 1000)}
                className="flex flex-col cursor-pointer hover:scale-105 transition-all duration-200 hover:opacity-60 overflow-hidden rounded-lg shadow-lg"
                onClick={() => {
                  console.log("index", index);
                  handleClick(index + 1);
                }}
              >
                <div className="flex-shrink-0">
                  <img
                    className="h-48 w-full object-cover"
                    src={post?.image}
                    alt=""
                  />
                </div>
                <div className="flex flex-1 flex-col justify-between bg-white p-6">
                  <div className="flex-1">
                    <a href={post?.href} className="mt-2 block">
                      <p className="text-xl font-semibold text-gray-900">
                        {post?.title + "  "}
                      </p>
                      <p className="mt-3 text-base text-gray-500">
                        {post?.description}
                      </p>
                    </a>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="">
        <img
          className="h-72 object-cover w-full"
          src="https://images.unsplash.com/photo-1665686308827-eb62e4f6604d?ixlib=rb-4.0.3&ixid=MnwxMjA3fDF8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=2370&q=80"
        />
      </div>

      <div className="relative mx-auto max-w-7xl pt-20">
        <div className="text-center">
          <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">
            Products just for you
          </h2>
          <p className="mx-auto mt-3 max-w-2xl text-xl text-gray-300 sm:mt-4">
            Check out these awesome items based on your prefrences
          </p>
        </div>
      </div>
      <div className="mx-auto max-w-7xl overflow-hidden py-16 px-4 sm:py-24 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 gap-y-10 gap-x-6 sm:grid-cols-2 lg:grid-cols-3 lg:gap-x-8">
          {hydratedProducts.map((product) => (
            <a
              key={product?.title}
              href={product?.link}
              className="group text-sm bg-white shadow-lg   hover:scale-105 transition-all duration-200 rounded-lg flex justify-between flex-col"
            >
              <div className="aspect-w-1 aspect-h-1 w-full overflow-hidden h-46 rounded-lg bg-gray-100 group-hover:opacity-75">
                <img
                  src={product?.thumbnail}
                  alt="Not Found"
                  className="h-48 w-full object-cover object-center"
                />
              </div>
              <div className="px-4 py-2">
                <h3 className="mt-4 h-8 font-medium text-gray-900">
                  {product.title}
                </h3>

                <p className="pt-4 font-medium text-xl text-gray-900">
                  <span id="currency">{currency}</span>
                  {product?.extracted_price.toFixed(2)}
                </p>
              </div>
            </a>
          ))}
        </div>
      </div>
      <AbSwitch />
    </div>
  );
};

export default Home;
