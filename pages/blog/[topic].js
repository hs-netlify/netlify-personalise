import NavBar from "../../components/navBar";
import AbSwitch from "../../components/controls";

import Head from "next/head";

export const getStaticProps = async ({ params }) => {
  let title = null;
  let image = null;
  let post = null;

  return { props: { title, image, post } };
};

export const getStaticPaths = () => {
  return {
    paths: [],
    fallback: "blocking",
  };
};

const Blog = ({ title, image, post }) => {
  let splitTitle = null;
  if (title) {
    splitTitle = title.split("\n\n");
  }

  return title && image && post ? (
    <div className="min-h-screen h-full">
      <Head>
        <meta name="image" content={image}></meta>
        <meta
          name="description"
          content={post.replaceAll("\n", "").slice(0, 100)}
        ></meta>
        <meta
          name="title"
          content={
            splitTitle.length > 1
              ? splitTitle[1].replaceAll('"', "")
              : splitTitle[0].replaceAll('"', "")
          }
        ></meta>
        <title>{title}</title>
      </Head>

      <div className="flex justify-center py-20">
        <div className="w-full max-w-screen-lg">
          <div className="flex flex-col overflow-hidden rounded-lg shadow-lg ">
            <div className="flex-shrink-0">
              <img
                id="image"
                className=" w-full h-80 object-cover"
                src={image}
                alt=""
              />
            </div>
            <div className="flex flex-1 flex-col justify-between bg-white p-6">
              <div className="flex-1">
                <p
                  id="title"
                  className="text-xl capitalize font-semibold text-gray-900 whitespace-pre-line"
                >
                  {title}
                </p>
                <p
                  id="post"
                  className="mt-3 text-base text-gray-800 whitespace-pre-line"
                >
                  {post}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
      <AbSwitch cookies={true} />
    </div>
  ) : (
    <div></div>
  );
};

export default Blog;
