import styles from "./banner.module.css";
import Image from "next/image";
import { useRouter } from "next/router";

const Banner = ({ title, subTitle, imgUrl, videoId }) => {
  const router = useRouter()

  const handleOnplay = () => {
    router.push(`video/${videoId}`)
  };
  return (
    <div className={styles.container}>
      <div className={styles.leftWrapper}>
        <div className={styles.left}>
          <div className={styles.nseriesWrapper}>
            <p className={styles.firstLetter}>N</p>
            <p className={styles.series}>S E R I E S</p>
          </div>

          <h3 className={styles.title}>{title}</h3>
          <h3 className={styles.subTitle}>{subTitle}</h3>
          <div className={styles.playBtnWrapper}>
            <button className={styles.btnWithIcon} onClick={handleOnplay}>
              <Image
                src='/static/svg/play_arrow.svg'
                alt='play button icon'
                width={32}
                height={32}
              />
              <span className={styles.playText}>Play</span>
            </button>
          </div>
        </div>
      </div>
      <div
        className={styles.bannerImg}
        style={{
          backgroundImage: `url(${imgUrl})`,
        }}
      ></div>
    </div>
  );
};

export default Banner;
