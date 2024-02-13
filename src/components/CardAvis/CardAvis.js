import { faStar } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import React, { useState } from 'react'
import styles from './CardAvis.module.scss'

function CardAvis({ avis }) {
  const [fullContent, setFullContent] = useState(false)
  return (
    <>
      <div className={styles.allContainer}>
        <div className={styles.imgContainer}>
          <div>
            {avis && avis.urlImage && (
              <img
                src={`${process.env.REACT_APP_URL_BASE_IMAGE}${avis.urlImage}`}
                alt='img-user'
              />
            )}
          </div>
        </div>

        <div className={styles.textContainer}>
          <h3>{avis.pseudo}</h3>
          <p
            onClick={() => setFullContent(!fullContent)}
            style={
              fullContent ? { height: 'fit-content' } : { height: '130px' }
            }
          >
            {avis.description.toLocaleString('fr-FR')}
          </p>

          <div className={`${styles.starContent} _${avis.stars}star`}>
            <FontAwesomeIcon icon={faStar} />
            <FontAwesomeIcon icon={faStar} />
            <FontAwesomeIcon icon={faStar} />
            <FontAwesomeIcon icon={faStar} />
            <FontAwesomeIcon icon={faStar} />
          </div>
        </div>
      </div>
    </>
  )
}

export default CardAvis
