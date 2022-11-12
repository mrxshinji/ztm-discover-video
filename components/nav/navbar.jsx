import Link from "next/link";
import styles from "./navbar.module.css";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import Image from "next/image";

import { m } from "../../utils/magicClient";
const Navbar = () => {
  //route
  const router = useRouter();
  const [username, setUsername] = useState("");
  const [token, setToken ] = useState('')

  // getMetaData from magic
  useEffect(() => {
    const getMetadata = async () => {
      try {
        if (await m.user.isLoggedIn()) {
          const didToken = await m.user.getIdToken();
          const { email } = await m.user.getMetadata(); // string
          if (email) {
            setUsername(email);
            setToken(didToken)
          }
        }
      } catch (err) {
        console.error("Error retrieving metaData", err);
      }
    };
    getMetadata();
  }, []);

  const handleOnClickHome = (e) => {
    e.preventDefault();
    router.push("/");
  };

  const handleOnClickMyList = (e) => {
    e.preventDefault();
    router.push("/browse/my-list");
  };

  const handleSignout = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch("/api/logout", {
        method: "POST",
        headers: {
          Authorization: `${token}`,
          "Content-Type": "application/json",
        },
      });

      const res = await response.json();
    } catch (error) {
      console.error("Error logging out", error);
      router.push("/login");
    }
  };

  // dropdown
  const [showDropdown, setShowDropdown] = useState(false);

  const handleShowDropdown = (e) => {
    e.preventDefault();
    setShowDropdown(!showDropdown);
  };

  return (
    <div className={styles.container}>
      <div className={styles.wrapper}>
        <Link className={styles.logoLink} href='/'>
          <div className={styles.logoWrapper}>
            <Image
              src={"/static/svg/netflix.svg"}
              alt='Netflix logo'
              width={128}
              height={38}
            />
          </div>
        </Link>
        <ul className={styles.navItems}>
          <li className={styles.navItem} onClick={handleOnClickHome}>
            Home
          </li>
          <li className={styles.navItem2} onClick={handleOnClickMyList}>
            My List
          </li>
        </ul>
        <nav className={styles.navContainer}>
          <div>
            <button className={styles.usernameBtn} onClick={handleShowDropdown}>
              <p className={styles.username}>{username}</p>
              <Image
                src={"/static/svg/expand.svg"}
                alt='Expand Dropdown'
                width={24}
                height={24}
              />
            </button>
            {showDropdown && (
              <div className={styles.navDropdown}>
                <div>
                  <a className={styles.linkName} onClick={handleSignout}>
                    Sign Out
                  </a>
                  <div className={styles.lineWrapper}></div>
                </div>
              </div>
            )}
          </div>
        </nav>
      </div>
    </div>
  );
};

export default Navbar;
