import Head from "next/head";
import styles from "./my-list.module.css";

import NavBar from "../../components/nav/navbar";
import SectionCards from "../../components/card/section-cards";

import { getFavouritedVideos } from "../../utils/videos";

import { redirectUser } from "../../utils/redirectUser";

export async function getServerSideProps(context) {
  // watch it again video
  const { userId, token } = redirectUser(context);

  // if (!userId) {
  //   return {
  //     props: {},
  //     redirect: {
  //       destination: "/login",
  //       permanent: false,
  //     },
  //   };
  // }

  const getVideo = await getFavouritedVideos(userId, token);
  const myListVideos = getVideo ? getVideo : [];

  return {
    props: {
      myListVideos,
    }, // will be passed to the page component as props
  };
}

const MyList = ({ myListVideos }) => {
  return (
    <div>
      <Head>
        <title>My list</title>
      </Head>
      <main className={styles.main}>
        <NavBar />
        <div className={styles.sectionWrapper}>
          <SectionCards
            title='My List'
            videos={myListVideos || []}
            size='small'
            shouldWrap={true}
            shouldScale={false}
          />
        </div>
      </main>
    </div>
  );
};

export default MyList;
