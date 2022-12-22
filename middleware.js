import { MiddlewareRequest } from "@netlify/next";

const COOKIE_NAME = "ab-test";

// Choose a random bucket
// Optional: contact a 3rd party service to get the user's bucket

export const middleware = async (nextRequest) => {
  const origin = nextRequest.nextUrl.origin;
  const pathname = nextRequest.nextUrl.pathname;
  const middlewareRequest = new MiddlewareRequest(nextRequest);
  const response = await middlewareRequest.next();

  const MARKETING_BUCKETS = ["a", "b"];
  const getBucket = () =>
    MARKETING_BUCKETS[Math.floor(Math.random() * MARKETING_BUCKETS.length)];

  //AB Test cookie setup
  const bucket = nextRequest.cookies.get(COOKIE_NAME) || getBucket();

  // Add the bucket to cookies if it's not there
  if (!nextRequest.cookies.get(COOKIE_NAME)) {
    response.cookies.set(COOKIE_NAME, bucket);
  }

  const extractMetadata = async (slug) => {
    const res = await fetch(`${origin}/blog/${slug}`);

    const data = await res.text();

    const title = data.match(/(?:<meta name="title" content=)"(.*?)"/)[1];
    const image = data.match(/(?:<meta name="image" content=)"(.*?)"/)[1];
    const description = data.match(
      /(?:<meta name="description" content=)"(.*?)"/
    )[1];

    return { title, image, description };
  };

  //Change background colour on homepage based of A/B

  // if (pathname == "/") {
  //   if (bucket === "b") {
  //     response.rewriteHTML("#main-body", {
  //       element(element) {
  //         element.setAttribute("style", "background-color:black; color:white");
  //       },
  //     });
  //     response.rewriteHTML("#hero-image", {
  //       element(element) {
  //         element.setAttribute(
  //           "src",
  //           "https://images.unsplash.com/photo-1549082984-1323b94df9a6?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=2370&q=80"
  //         );
  //       },
  //     });
  //   }
  //   return response;
  // }

  // if (pathname.startsWith("/static")) {
  //   const message = `This was a static page but has been transformed in
  //                    ${nextRequest?.geo?.city},
  //                    ${nextRequest?.geo?.country} using
  //                    @netlify/next in middleware.ts!`;
  //   response.replaceText("#message", message);
  //   response.setPageProp("message", message);

  //   return response;
  // }

  if (pathname === "/home") {
    const cookie = JSON.parse(
      nextRequest.cookies.get("netlifyPersonalise") || null
    );
    const { firstName, lastName, favourite1, favourite2, favourite3 } = cookie;

    const meta1 = await extractMetadata(favourite1);
    const posts = [
      meta1,

      // extractMetadata(favourite2),
      // extractMetadata(favourite3),
    ];

    // // const metaInfo2 = await extractMetadata(`${origin}/blog/${favourite2}`);
    // // const metaInfo3 = await extractMetadata(`${origin}/blog/${favourite3}`);

    response.setPageProp("posts", posts);

    return response;
  }

  // if (pathname.startsWith("/blog")) {
  //   const cookie = nextRequest.cookies.get("mostViewed");

  //   let mostViewed = JSON.parse(cookie ? cookie : null);

  //   if (mostViewed) {
  //     let mostViewedPosts = posts.filter((post) =>
  //       mostViewed.some((postViews) => `/blog/${postViews.name}` === post.href)
  //     );

  //     response.setPageProp("mostViewed", mostViewedPosts);
  //     return response;
  //   }
  // }
};
