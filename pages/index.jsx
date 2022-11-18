import Head from "next/head";
import styles from "../styles/Home.module.css";
import Banner from "../components/banner/banner";
import Navbar from "../components/nav/navbar";
import SectionCards from "../components/card/section-cards";
import {
  getPopularVideos,
  getVideos,
  getWatchItAgainVideos,
} from "../utils/videos";

import { redirectUser } from "../utils/redirectUser";

export async function getServerSideProps(context) {
  // watch it again video
  const { userId, token } = redirectUser(context);
  const getVideo = await getWatchItAgainVideos(userId, token.toString());
  const watchedItAgainVideos = getVideo ? getVideo : [];

  // each section video
  const disneyVideos = await getVideos("disney trailer");
  const travelVideos = await getVideos("travel");
  const productivityVideos = await getVideos("productivity");
  const popularVideos = await getPopularVideos();
  return {
    props: {
      disneyVideos,
      productivityVideos,
      travelVideos,
      popularVideos,
      watchedItAgainVideos,
    }, // will be passed to the page component as props
  };
}

export default function Home({
  disneyVideos,
  productivityVideos,
  travelVideos,
  popularVideos,
  watchedItAgainVideos,
}) {
  return (
    <div className={styles.container}>
      <Head>
        <title>Mockflix</title>
        <meta name='description' content='Discover videos with Mockflix' />
        <link rel='icon' href='/favicon.ico' />
      </Head>
      <header>
        <Navbar />
      </header>
      <main>
        <div className={styles.main}>
          <Banner
            videoId='4zH5iYM4wJo'
            title='test title'
            subTittle='subtitle test'
            imgUrl='/static/images/clifford.webp'
          />
          <div className={styles.sectionWrapper}>
            {disneyVideos.length !== 0 && (
              <SectionCards
                title='Disney'
                videos={disneyVideos || []}
                size='large'
              />
            )}
            {productivityVideos.length !== 0 && (
              <SectionCards
                title='Travel'
                videos={travelVideos || []}
                size='small'
              />
            )}
            <SectionCards
              title='Productivity'
              videos={productivityVideos || []}
              size='medium'
            />
            <SectionCards
              title='Watch It Again'
              videos={watchedItAgainVideos || []}
              size='small'
            />
            <SectionCards title='Popular' videos={popularVideos} size='small' />
          </div>
        </div>
      </main>
    </div>
  );
}
