import styles from "./section-cards.module.css";
import Link from "next/link";

import Card from "./card";

const SectionCards = ({ title, videos = [], size = "medium", shouldWrap = false, shouldScale=true }) => {
  const classMap = {
    large: styles.lgItem,
    medium: styles.mdItem,
    small: styles.smItem,
  };

  return (
    <section className={styles.container}>
      <h2 className={styles.title}>{title}</h2>
      <div className={`${styles.cardWrapper} ${classMap[size]} ${shouldWrap && styles.wrap}`}>
        {videos.map((video, idx) => {
          return (
            <Link key={idx} href={`/video/${video.id}`}>
              <Card key={idx} id={idx} imgUrl={video.imgUrl} size={size} shouldScale={shouldScale}/>;
            </Link>
          );
        })}
      </div>
    </section>
  );
};

export default SectionCards;
