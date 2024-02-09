import React from 'react'
import styles from "./GifLoading.module.scss";
import LoadingGif from "../../assets/images/loading.gif";

function GifLoading({ positionDiv }) {
  return (
    <div style={{position: `${positionDiv}`}} className={styles.loadingContainer}><img src={LoadingGif} alt="Loading" /></div>
  )
}

export default GifLoading