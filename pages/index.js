import { useState } from "react";
import { Switch } from "@headlessui/react";
import Link from "next/link";
import uniqid from "uniqid";
import { useRouter } from "next/router";

import Cookies from "js-cookie";
import AbSwitch from "../components/abSwitch";

const classNames = (...classes) => {
  return classes.filter(Boolean).join(" ");
};

const Landing = () => {
  const [agreed, setAgreed] = useState(false);
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    favourite1: "",
    favourite2: "",
    favourite3: "",
    id: "",
  });
  const [formError, setFormError] = useState();
  const [loading, setLoading] = useState(false);

  const router = useRouter();

  const handleChange = (e) => {
    e.preventDefault();

    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const preloadBlog = (e) => {
    if (e.target.value) {
      const origin =
        typeof window !== "undefined" && window.location.origin
          ? window.location.origin
          : "";
      const res = fetch(
        `${origin}/.netlify/builders/generateBlog/${e.target.value}`
      );
    }
  };

  const validateForm = () => {
    if (!agreed) {
      setFormError("Accept privacy policy");
      return false;
    }
    let { firstName, lastName, favourite1, favourite2, favourite3 } = formData;

    if (!firstName || !lastName) {
      setFormError("Enter full name");
      return false;
    }

    if (!favourite1 || !favourite2 || !favourite3) {
      setFormError("Enter three favourite things");
      return false;
    }

    setFormError(null);
    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const id = uniqid();

    if (validateForm()) {
      setLoading(true);

      setFormData({ ...formData, id });
      Cookies.set("netlifyPersonalise", JSON.stringify(formData));
      let ready = await fetch("/home", { credentials: "same-origin" });
      if (ready) {
        router.push("/home");
      }
    }
  };

  return (
    <div className="overflow-hidden min-h-screen py-16 px-4 sm:px-6 lg:px-8 lg:py-24">
      <div className="relative mx-auto max-w-xl">
        <svg
          className="absolute left-full translate-x-1/2 transform"
          width={404}
          height={404}
          fill="none"
          viewBox="0 0 404 404"
          aria-hidden="true"
        >
          <defs>
            <pattern
              id="85737c0e-0916-41d7-917f-596dc7edfa27"
              x={0}
              y={0}
              width={20}
              height={20}
              patternUnits="userSpaceOnUse"
            >
              <rect
                x={0}
                y={0}
                width={4}
                height={4}
                className="text-gray-200"
                fill="currentColor"
              />
            </pattern>
          </defs>
          <rect
            width={404}
            height={404}
            fill="url(#85737c0e-0916-41d7-917f-596dc7edfa27)"
          />
        </svg>
        <svg
          className="absolute right-full bottom-0 -translate-x-1/2 transform"
          width={404}
          height={404}
          fill="none"
          viewBox="0 0 404 404"
          aria-hidden="true"
        >
          <defs>
            <pattern
              id="85737c0e-0916-41d7-917f-596dc7edfa27"
              x={0}
              y={0}
              width={20}
              height={20}
              patternUnits="userSpaceOnUse"
            >
              <rect
                x={0}
                y={0}
                width={4}
                height={4}
                className="text-gray-200"
                fill="currentColor"
              />
            </pattern>
          </defs>
          <rect
            width={404}
            height={404}
            fill="url(#85737c0e-0916-41d7-917f-596dc7edfa27)"
          />
        </svg>
        <div className="text-center">
          <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">
            Netlify Personalise
          </h2>
          <p className="mt-4 text-lg leading-6 text-gray-500">
            Enter your name and three favourite things to begin your
            personsalisation journey. {formError}
          </p>
        </div>
        <div className="mt-12">
          <form
            onSubmit={handleSubmit}
            className="grid grid-cols-1 gap-y-6 sm:grid-cols-2 sm:gap-x-8"
          >
            <div className="sm:col-span-2">
              <label
                htmlFor="favourite1"
                className="block text-sm font-medium "
              >
                Favourite Thing 1
              </label>
              <div className="mt-1">
                <input
                  type="text"
                  name="favourite1"
                  id="favourite1"
                  autoComplete="favourite1"
                  onChange={handleChange}
                  onBlur={preloadBlog}
                  value={formData["favourite1"]}
                  className="block w-full rounded-md text-black border-gray-300 py-3 px-4 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                />
              </div>
            </div>
            <div className="sm:col-span-2">
              <label
                htmlFor="favourite2"
                className="block text-sm font-medium  "
              >
                Favourite Thing 2
              </label>
              <div className="mt-1">
                <input
                  id="favourite2"
                  name="favourite2"
                  onChange={handleChange}
                  onBlur={preloadBlog}
                  value={formData["favourite2"]}
                  type="text"
                  className="block w-full rounded-md text-black border-gray-300 py-3 px-4 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                />
              </div>
            </div>
            <div className="sm:col-span-2">
              <label
                htmlFor="favourite3"
                className="block text-sm font-medium  "
              >
                Favourite Thing 3
              </label>
              <div className="mt-1">
                <input
                  id="favourite3"
                  name="favourite3"
                  onChange={handleChange}
                  onBlur={preloadBlog}
                  value={formData["favourite3"]}
                  type="text"
                  className="block w-full text-black rounded-md border-gray-300 py-3 px-4 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                />
              </div>
            </div>
            <div>
              <label
                htmlFor="firstName"
                className="block text-sm font-medium  "
              >
                First name
              </label>
              <div className="mt-1">
                <input
                  type="text"
                  name="firstName"
                  id="firstName"
                  autoComplete="given-name"
                  onChange={handleChange}
                  value={formData["firstName"]}
                  className="block w-full rounded-md border-gray-300 text-black py-3 px-4 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                />
              </div>
            </div>
            <div>
              <label htmlFor="lastName" className="block text-sm font-medium  ">
                Last name
              </label>
              <div className="mt-1">
                <input
                  type="text"
                  name="lastName"
                  id="lastName"
                  autoComplete="family-name"
                  onChange={handleChange}
                  value={formData["lastName"]}
                  className="block w-full rounded-md border-gray-300 text-black py-3 px-4 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                />
              </div>
            </div>

            <div className="sm:col-span-2">
              <div className="flex items-start">
                <div className="flex-shrink-0">
                  <Switch
                    checked={agreed}
                    onChange={setAgreed}
                    className={classNames(
                      agreed ? "bg-indigo-600" : "bg-gray-200",
                      "relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
                    )}
                  >
                    <span className="sr-only">Agree to policies</span>
                    <span
                      aria-hidden="true"
                      className={classNames(
                        agreed ? "translate-x-5" : "translate-x-0",
                        "inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out"
                      )}
                    />
                  </Switch>
                </div>
                <div className="ml-3">
                  <p className="text-base text-gray-500">
                    By selecting this, you agree to the{" "}
                    <Link
                      href="https://www.netlify.com/privacy/"
                      target={"_blank"}
                    >
                      <span className="font-medium text-indigo-600 underline">
                        Privacy Policy
                      </span>
                    </Link>
                    .
                  </p>
                </div>
              </div>
            </div>
            <div className="sm:col-span-2">
              <button
                type="submit"
                onClick={handleSubmit}
                className="inline-flex w-full items-center justify-center rounded-md border border-transparent bg-indigo-600 px-6 py-3 text-base font-medium text-white shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
              >
                Lets Go
              </button>
              {formError && (
                <div className="text-red-400 text-center pt-4 text-lg">
                  Error: {formError}
                </div>
              )}
            </div>
          </form>
        </div>
      </div>
      {loading && (
        <div className="fixed top-0 left-0 flex justify-center items-center flex-col w-screen h-screen bg-black bg-opacity-90 z-20">
          <svg
            aria-hidden="true"
            className="mr-2 w-20 h-20 text-gray-200 animate-spin dark:text-gray-600 fill-blue-600"
            viewBox="0 0 100 101"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z"
              fill="currentColor"
            />
            <path
              d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z"
              fill="currentFill"
            />
          </svg>
          <div className="text-lg text-white pt-10">
            Generating your personalised Experience
          </div>
        </div>
      )}
      <AbSwitch />
    </div>
  );
};

export default Landing;
