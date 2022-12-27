import { MiddlewareRequest } from "@netlify/next";
import { NextResponse } from "next/server";

const COOKIE_NAME = "ab-test";

// Choose a random bucket
// Optional: contact a 3rd party service to get the user's bucket

export const middleware = async (nextRequest) => {
  const origin = nextRequest.nextUrl.origin;
  const pathname = nextRequest.nextUrl.pathname;
  const middlewareRequest = new MiddlewareRequest(nextRequest);
  const response = await middlewareRequest.next();
  const personalisationCookie = JSON.parse(
    nextRequest.cookies.get("netlifyPersonalise") || null
  );

  const MARKETING_BUCKETS = ["a", "b"];
  const getBucket = () =>
    MARKETING_BUCKETS[Math.floor(Math.random() * MARKETING_BUCKETS.length)];

  //AB Test cookie setup
  const bucket = nextRequest.cookies.get(COOKIE_NAME) || getBucket();

  // Add the bucket to cookies if it's not there
  if (!nextRequest.cookies.get(COOKIE_NAME)) {
    response.cookies.set(COOKIE_NAME, bucket);
  }

  const fetchPost = async (query) => {
    try {
      const res = await fetch(
        `${origin}/.netlify/builders/generateBlog/${query}`
      );

      const data = JSON.parse(await res.text());
      // const data2 = res.json();
      console.log("test", data);
      // console.log("test2", data2);
      return data;
    } catch (error) {
      console.log(error);
    }
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

  if (pathname === "/") {
    if (personalisationCookie) {
      return NextResponse.redirect(`${origin}/home`);
    }
  }

  if (pathname === "/home") {
    if (personalisationCookie) {
      const { firstName, lastName, favourite1, favourite2, favourite3 } =
        personalisationCookie;

      const posts = await Promise.all([
        fetchPost(favourite1),
        fetchPost(favourite2),
        fetchPost(favourite3),
      ]);

      let resProducts = await fetch(
        `${origin}/.netlify/builders/fetchProducts/${favourite1}/${favourite2}/${favourite3}`
      );
      const products = [];

      if (resProducts.status < 400) {
        products = JSON.parse(await resProducts.text());
      }
      console.log("products", products);
      console.log("posts", posts);
      const message = `Welcome ${firstName} ${lastName}`;
      response.setPageProp("posts", posts);
      response.setPageProp("message", message);
      response.setPageProp("products", products);
      response.replaceText("#personalBanner", message);

      return response;
    } else {
      return NextResponse.redirect(`${origin}/`);
    }
  }
};
