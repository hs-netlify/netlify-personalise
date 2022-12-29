import { useRouter } from "next/router";
import Cookies from "js-cookie";

const AbSwitch = ({ cookies }) => {
  const router = useRouter();
  const handleABSwitch = () => {
    let bucket = Cookies.get("ab-test");
    Cookies.set("ab-test", bucket === "a" ? "b" : "a");
    router.reload(window.location.pathname);
  };

  const clearCookies = () => {
    Cookies.remove("netlifyPersonalise");
    router.reload(window.location.pathname);
  };

  return (
    <div className="md:fixed bottom-0 flex flex-col z-50 px-4 py-10">
      <a
        onClick={handleABSwitch}
        className="text-center px-4  w-48  bg-indigo-600 hover:bg-indigo-700 rounded text-white  p-2 text-large cursor-pointer left-10"
      >
        Switch A/B Test
      </a>
      {cookies ? (
        <a
          onClick={clearCookies}
          className="mt-4 text-center bottom-10 w-48 z-50 bg-indigo-600 hover:bg-indigo-700 rounded text-white  p-2 text-large cursor-pointer left-10"
        >
          Clear Cookies
        </a>
      ) : (
        <></>
      )}
    </div>
  );
};

export default AbSwitch;
