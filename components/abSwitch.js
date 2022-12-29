import { useRouter } from "next/router";
import Cookies from "js-cookie";

const AbSwitch = ({}) => {
  const router = useRouter();
  const handleABSwitch = () => {
    let bucket = Cookies.get("ab-test");
    Cookies.set("ab-test", bucket === "a" ? "b" : "a");
    router.reload(window.location.pathname);
  };

  return (
    <a
      onClick={handleABSwitch}
      className="md:fixed text-center bottom-24 w-48 z-50 bg-indigo-600 hover:bg-indigo-700 rounded text-white  p-2 text-large cursor-pointer left-10"
    >
      Switch A/B Test
    </a>
  );
};

export default AbSwitch;
