import { faStar } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import React, { useState } from 'react'
import styles from './CardAvis.module.scss'
import women_1 from '../../assets/avatar/women_1.png'
import women_2 from '../../assets/avatar/women_2.png'
import women_3 from '../../assets/avatar/women_3.png'
import men_1 from '../../assets/avatar/men_1.png'
import men_2 from '../../assets/avatar/men_2.png'
import men_3 from '../../assets/avatar/men_3.png'

function CardAvis({ avis }) {
  const [fullContent, setFullContent] = useState(false)
  return (
    <>
      <div className={styles.allContainer}>
        <div className={styles.imgContainer}>
          <div>
            {avis && avis.urlImage && (
              <img
                src={
                  avis.urlImage === 'women_1'
                    ? women_1
                    : avis.urlImage === 'women_2'
                      ? women_2
                      : avis.urlImage === 'women_3'
                        ? women_3
                        : avis.urlImage === 'men_1'
                          ? men_1
                          : avis.urlImage === 'men_2'
                            ? men_2
                            : avis.urlImage === 'men_3'
                              ? men_3
                              : null
                }
                alt='avatar-user'
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
