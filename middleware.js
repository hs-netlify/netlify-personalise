import { MiddlewareRequest, MiddlewareResponse } from "@netlify/next";
import { NextResponse } from "next/server";
import { getParamByISO } from "iso-country-currency";

const COOKIE_NAME = "ab-test";

export const config = {
  matcher: ["/home", "/", "/blog/:path*"],
};

export const middleware = async (nextRequest) => {
  const origin = nextRequest.nextUrl.origin;
  const pathname = nextRequest.nextUrl.pathname;
  const middlewareRequest = new MiddlewareRequest(nextRequest);
  let response = await middlewareRequest.next();
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

  const isValidUrl =
    !pathname.startsWith("/_next") &&
    !pathname.startsWith("/favicon.ico") &&
    !pathname.startsWith("/.netlify") &&
    !pathname.startsWith("/test-b");

  const fetchPost = async (query) => {
    try {
      if (query) {
        const res = await fetch(
          `${origin}/.netlify/builders/generateBlog/${query}`
        );

        const data = await res.json();

        return data;
      } else return;
    } catch (error) {
      console.log(error);
    }
  };

  //Change background colour on homepage based of A/B

  if (bucket === "b") {
    response.rewriteHTML("#main-body", {
      element(element) {
        element.setAttribute("style", "background-color:#3aafa9; color:white;");
      },
    });

    //Testing full page rewites
    // if (isValidUrl) {
    //   let isPage =
    //     (await (await fetch(`${origin}/test-b${pathname}`)).status) < 400;

    //   if (isPage) {
    //     let page = await (await fetch(`${origin}/test-b${pathname}`)).text();

    //     console.log("here");
    //     response.rewriteHTML("#main-body", {
    //       element(element) {
    //         console.log("el", element);
    //         element.setAttribute("innerHTML", "<div>Working</div>");
    //       },
    //     });
        // let fetchedResponse = new Response(page);
        // fetchedResponse.headers.set("Content-Type", "text/html");
        // response = new MiddlewareResponse(fetchedResponse);
      }
    }
    // // response.rewriteHTML("#hero-image", {
    // //   element(element) {
    // //     element.setAttribute(
    // //       "src",
    // //       "https://images.unsplash.com/photo-1549082984-1323b94df9a6?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=2370&q=80"
    // //     );
    // //   },
    // });
  }

  if (pathname === "/" || !pathname) {
    if (personalisationCookie) {
      return NextResponse.redirect(`${origin}/home`);
    }
  } else if (isValidUrl) {
    if (!personalisationCookie) {
      return NextResponse.redirect(`${origin}/`);
    }
  }

  if (pathname.startsWith("/blog")) {
    const topic = pathname.split("/")[2];

    let post = await fetchPost(topic);

    response.setPageProp("title", post?.title);
    response.replaceText("#title", post?.title);
    response.setPageProp("image", post?.image);
    response.rewriteHTML("#image", {
      element(element) {
        element.setAttribute("src", post?.image);
      },
    });
    response.setPageProp("post", post?.post);
    response.replaceText("#post", post?.image);
  }

  if (pathname === "/home") {
    const { firstName, lastName, favourite1, favourite2, favourite3 } =
      personalisationCookie;

    const posts = await Promise.all([
      fetchPost(favourite1),
      fetchPost(favourite2),
      fetchPost(favourite3),
    ]);

    let res = await fetch(
      `${origin}/.netlify/builders/fetchProducts/${favourite1}/${favourite2}/${favourite3}`
    );
    let products = [];

    if (res.status < 400) {
      products = await res.json();
    }
    const currencyOverride =
      middlewareRequest.nextUrl.searchParams.get("country");

    let country = currencyOverride ? currencyOverride : nextRequest.geo.country;
    let currency = getParamByISO(country, "symbol");

    const message = `Welcome ${firstName} ${lastName}`;
    response.setPageProp("posts", posts);
    response.setPageProp("message", message);
    response.setPageProp("products", products);
    response.setPageProp("currency", currency);
    response.replaceText("#currency", currency);
    response.replaceText("#personalBanner", message);
  }
  return response;
};
