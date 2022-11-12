import styles from "./card.module.css";
import Image from "next/image";
import { useState } from "react";

import { motion } from "framer-motion";

const Card = ({
  imgUrl = "https://images.unsash.com/photo-1485846234645-a62644f84728?ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&ixlib=rb-1.2.1&auto=format&fit=crop&w=1340&q=80",
  size = "medium",
  id,
  shouldScale=true,
}) => {
  const classMap = {
    large: styles.lgItem,
    medium: styles.mdItem,
    small: styles.smItem,
  };

  const [imgSrc, setImgSrc] = useState(imgUrl);

  const handleOnError = () => {
    setImgSrc(
      "https://images.unsplash.com/photo-1485846234645-a62644f84728?ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&ixlib=rb-1.2.1&auto=format&fit=crop&w=1340&q=80"
    );
  };

  const scale = id === 0 ? { scaleY: 1.1 } : { scale: 1.1 };

  const shouldHover =
    shouldScale &&
    {
      whileHover: {
        ...scale,
        transition: { duration: 0.2 },
      },
    };

  return (
    <div className={styles.container}>
      <motion.div
        className={`${classMap[size]} ${styles.imgMotionWrapper}`}
        {...shouldHover}
      >
        <Image
          src={imgSrc}
          alt='card'
          fill={true}
          sizes='100%'
          className={styles.cardImg}
          onError={handleOnError}
        />
      </motion.div>
    </div>
  );
};

export default Card;
