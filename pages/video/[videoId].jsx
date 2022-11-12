import { useRouter } from "next/router";
import Modal from "react-modal";

import styles from "../../styles/video.module.css";

import { getVideoById } from "../../utils/videos";
import Navbar from "../../components/nav/navbar";

import Like from "../../components/icons/like-icon";
import Dislike from "../../components/icons/dislike-icon";
import { useState, useEffect } from "react";

Modal.setAppElement("#__next");

export const getStaticProps = async (context) => {
  const videoId = context.params.videoId;

  const videoArray = await getVideoById(videoId);

  return {
    props: {
      video: videoArray.length > 0 ? videoArray[0] : {},
    },
    revalidate: 10, // In seconds
  };
};

export const getStaticPaths = () => {
  const listofVideos = ["mYfJxlgR2jw", "4zH5iYM4wJo", "KCPEHsAViiQ"];
  const paths = listofVideos.map((id) => {
    return {
      params: {
        videoId: id,
      },
    };
  });
  return {
    paths,
    fallback: "blocking",
  };
};

const Video = ({ video }) => {
  const router = useRouter();
  const { videoId } = router.query;

  const [toggleLike, setToggleLike] = useState(false);
  const [toggleDislike, setToggleDislike] = useState(false);

  const {
    title,
    publishTime,
    description,
    channelTitle,
    statistics: { viewCount } = { viewCount: 0 },
  } = video;

  useEffect(() => {
    const getFavourite = async () => {
      const response = await fetch(`/api/stats?videoId=${videoId}`, {
        method: "GET",
        headers: {
          "Content-Type": `application/json`,
        },
      });
      const data = await response.json();
      if (data.length > 0) {
        const fav = data[0].favourited === 1 ? true : false
        setToggleLike(fav)
        setToggleDislike(!fav)
      }
    };

    getFavourite();
  }, [videoId]);

  const runRatingService = async (fav) => {
    return await fetch("/api/stats", {
      method: "POST",
      headers: {
        "Content-Type": `application/json`,
      },
      body: JSON.stringify({
        videoId,
        favourited: fav,
      }),
    });
  };

  const handleToggleLike = async () => {
    const val = true;
    setToggleDislike(false);
    setToggleLike(true);
    const fav = val ? 1 : 0;
    const response = await runRatingService(fav);
  };

  const handleToggleDislike = async () => {
    const val = false;
    setToggleDislike(true);
    setToggleLike(false);
    const fav = val ? 1 : 0;
    const response = await runRatingService(fav);
  };

  return (
    <div className={styles.container}>
      <Navbar />
      <Modal
        isOpen={true}
        contentLabel='Watch the video'
        onRequestClose={() => router.back()}
        className={styles.modal}
        overlayClassName={styles.overlay}
      >
        <iframe
          className={styles.videoPlayer}
          id='ytplayer'
          type='text/html'
          width='100%'
          height='360'
          src={`https://www.youtube.com/embed/${videoId}?autoplay=0&origin=http://example.com&controls=0&rel=1`}
          frameBorder='0'
        ></iframe>

        <div className={styles.likeDislikeBtnWrapper}>
          <div className={styles.likeBtnWrapper}>
            <button onClick={handleToggleLike}>
              <div className={styles.btnWrapper}>
                <Like selected={toggleLike} />
              </div>
            </button>
          </div>
          <button onClick={handleToggleDislike}>
            <div className={styles.btnWrapper}>
              <Dislike selected={toggleDislike} />
            </div>
          </button>
        </div>

        <div className={styles.modalBody}>
          <div className={styles.modalBodyContent}>
            <div className={styles.col1}>
              <p className={styles.publishTime}>{publishTime}</p>
              <p className={styles.title}>{title}</p>
              <p className={styles.description}>{description}</p>
            </div>
            <div className={styles.col2}>
              <p className={`${styles.subText} ${styles.subTextWrapper}`}>
                <span className={styles.textColor}>Cast: </span>
                <span className={styles.channelTitle}>{channelTitle}</span>
              </p>
              <p className={`${styles.subText} ${styles.subTextWrapper}`}>
                <span className={styles.textColor}>View Count: </span>
                <span className={styles.channelTitle}>{viewCount}</span>
              </p>
            </div>
          </div>
        </div>
      </Modal>
    </div>
  );
};

export default Video;
