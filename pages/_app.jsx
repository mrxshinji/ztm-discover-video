import "../styles/globals.css";
import { useRouter } from "next/router";

import { m } from "../utils/magicClient";
import { useEffect, useState } from "react";

import Loading from "../components/loading/loading";

function MyApp({ Component, pageProps }) {
  // if logged in route to /
  // else route to /login
  const router = useRouter();

  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const handleComplete = () => {
      setIsLoading(false);
    };

    router.events.on("routeChangeComplete", handleComplete);
    router.events.on("routeChangeError", handleComplete);

    return () => {
      router.events.off("routeChangeComplete", handleComplete);
      router.events.off("routeChangeError", handleComplete);
    };
  }, [router]);



  return isLoading ? <Loading /> : <Component {...pageProps} />;
}

export default MyApp;
