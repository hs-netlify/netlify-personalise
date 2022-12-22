import React, { useEffect, useState } from "react";
import Cookies from "js-cookie";
import { useRouter } from "next/router";

export const getStaticProps = async () => {
  let products = [];

  let posts = [];
  return {
    props: {
      products,
      posts,
    },
    revalidate: 86400,
  };
};

const Home = ({ products, posts }) => {
  const router = useRouter();
  const [hydratedPosts, setHydratedPosts] = useState([]);
  useEffect(() => {
    setHydratedPosts(posts);
  }, [posts]);

  const handleClick = (path) => {
    router.push(path);
  };

  return (
    <div>
      <div
        className="text-3xl font-bold tracking-tight text-gray-900 px-20 py-10 bg-white shadow border-b"
        id="personal-banner"
      >
        Welcome
      </div>
      <div className="relative bg-gray-50 px-4 pt-16 pb-20 sm:px-6 lg:px-8 lg:pt-24 lg:pb-28">
        <div className="absolute inset-0">
          <div className="h-1/3 bg-white sm:h-2/3" />
        </div>
        <div className="relative mx-auto max-w-7xl">
          <div className="text-center">
            <h2 className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
              From the blog
            </h2>
            <p className="mx-auto mt-3 max-w-2xl text-xl text-gray-500 sm:mt-4">
              Check out these personalised blog posts created just for you!
            </p>
          </div>
          <div className="mx-auto mt-12 grid max-w-lg gap-5 lg:max-w-none lg:grid-cols-3">
            {hydratedPosts.map((post, index) => (
              <div
                key={post.title}
                className="flex flex-col overflow-hidden rounded-lg shadow-lg"
              >
                <div className="flex-shrink-0">
                  <img
                    className="h-48 w-full object-cover"
                    src={post.banner}
                    alt=""
                  />
                </div>
                <div className="flex flex-1 flex-col justify-between bg-white p-6">
                  <div className="flex-1">
                    <a href={post.href} className="mt-2 block">
                      <p className="text-xl font-semibold text-gray-900">
                        {post.title}
                      </p>
                      <p className="mt-3 text-base text-gray-500">
                        {post.description}
                      </p>
                    </a>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;
