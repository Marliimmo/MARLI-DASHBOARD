import React from 'react'
import styles from './LoadingAllSite.module.scss'
import Logo from '../../assets/images/marli-logo.png'
// import GifLoading from "../../assets/images/loadingpoint.gif";

function LoadingAllSite() {
  return (
    <div className={styles.allContainer}>
      <p className={styles.logo}>
        <img src={Logo} alt='erzaconnect logo' />
      </p>
      {/* <p className={styles.loadingPoint}><img src={GifLoading} alt="Gift Loading Point" /></p> */}
    </div>
  )
}

export default LoadingAllSite
