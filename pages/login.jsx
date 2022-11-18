import styles from "../styles/login.module.css";

import Head from "next/head";
import Link from "next/link";
import Image from "next/image";
import { useState, useEffect } from "react";

import { loginInWithMagicLink } from "../utils/magicClient";
import { useRouter } from "next/router";

export default function Login() {
  const router = useRouter();

  const [inputEmail, setInputEmail] = useState("");
  const [userMsg, setUserMsg] = useState("");
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

  const isEmail = (email) => /^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/g.test(email);

  const handleEmailOnChange = (e) => {
    setUserMsg("");
    const email = e.target.value;
    setInputEmail(email);
    if (!isEmail(e.target.value)) {
      setUserMsg("Please enter a valid email address");
    } else {
      setUserMsg("");
    }
  };

  const handleLoginWithEmail = async (e) => {
    e.preventDefault();
    if (!inputEmail) {
      setUserMsg("Empty input, please enter a valid email address");
      setIsLoading(false);
    }
    if (isEmail(inputEmail) && inputEmail) {
      try {
        setIsLoading(true);
        const didToken = await loginInWithMagicLink(inputEmail);
        if (didToken) {
          const response = await fetch("/api/login", {
            method: "POST",
            headers: {
              authorization: `${didToken}`,
              "Content-Type": `application/json`,
            },
          });

          const loggedInResponse = await response.json();
          console.log({ loggedInResponse });
          if (loggedInResponse.done) {
            console.log("firing router push");
            router.push("/");
          } else {
            setIsLoading(false);
            setUserMsg("Something went wrong logging in");
          }
        }
      } catch (err) {
        console.error("Error getting user", err);
        setIsLoading(false);
      }
    }
  };

  return (
    <div className={styles.container}>
      <div className={styles.radialBg}></div>
      <Image
        className={styles.bgImg}
        src={"/static/images/signin-bg.jpg"}
        alt='background'
        fill
        sizes='100vw'
      />
      <Head>
        <title>Netflix SignIn</title>
      </Head>

      <header className={styles.header}>
        <div className={styles.headerWrapper}>
          <Link className={styles.logoLink} href='/'>
            <div className={styles.logoWrapper}>
              <Image
                src='/static/svg/netflix.svg'
                alt='Netflix logo'
                width={128}
                height={34}
              />
            </div>
          </Link>
        </div>
      </header>

      <main className={styles.main}>
        <div className={styles.mainWrapper}>
          <h1 className={styles.signinHeader}>Sign In</h1>

          <input
            type='text'
            placeholder='Email address'
            className={styles.emailInput}
            onChange={handleEmailOnChange}
          />

          <p className={styles.userMsg}>{userMsg}</p>
          <button onClick={handleLoginWithEmail} className={styles.loginBtn}>
            {isLoading ? "Loading" : "Sign In"}
          </button>
        </div>
      </main>
    </div>
  );
}
