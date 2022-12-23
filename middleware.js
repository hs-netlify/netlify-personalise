import { MiddlewareRequest } from "@netlify/next";
import { NextResponse } from "next/server";
import { fetchProducts } from "./utils/fetchProducts";

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
  const amazonApiKey = Deno.env.get("AMAZON_API_KEY");

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
    try {
      const res = await fetch(`${origin}/blog/${slug}`);

      const data = await res.text();

      const matchTitle = data.match(/(?:<meta name="title" content=)"(.*?)"/);
      const matchImage = data.match(/(?:<meta name="image" content=)"(.*?)"/);
      const matchDescription = data.match(
        /(?:<meta name="description" content=)"(.*?)"/
      );

      const title =
        matchTitle && matchTitle.length > 0
          ? matchTitle[1].replace(/&amp;#x27;/g, "'")
          : undefined;

      const image =
        matchImage && matchImage.length > 0 ? matchImage[1] : undefined;
      const description =
        matchDescription && matchDescription.length > 0
          ? matchDescription[1] + "..."
          : undefined;

      return { title, image, description };
    } catch (error) {
      console.log("error", error);
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

      let posts = await Promise.all([
        extractMetadata(favourite1),
        extractMetadata(favourite2),
        extractMetadata(favourite3),
      ]);

      let allProducts = await Promise.all([
        fetchProducts(favourite1, amazonApiKey),
        fetchProducts(favourite2, amazonApiKey),
        fetchProducts(favourite3, amazonApiKey),
      ]);

      let products = allProducts.flat(1);

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
