import React from 'react'
import styles from './CardBien.module.scss'
import { Link } from 'react-router-dom'

function CardBien({
  imgUrl,
  prix,
  localisation,
  caracteristique,
  title,
  status,
  index,
  reference,
}) {
  return (
    <Link to={`/dashboard/modifier-un-bien/${reference}`}>
      <div className={styles.allContainer}>
        <div className={styles.imageContainer}>
          <img
            src={`${process.env.REACT_APP_URL_BASE_IMAGE}${imgUrl}`}
            alt='imag-bien'
          />
          <div
            className={`${status === 'vendu' || status === 'non-disponible' ? styles.statusBienVendu : status === 'sous-compromis' ? styles.statusSousCompromis : null}`}
          >
            {status === 'vendu'
              ? 'bien vendu'
              : status === 'sous-compromis'
                ? 'sous compromis'
                : status === 'non-disponible'
                  ? 'Non disponible'
                  : null}
          </div>
        </div>

        <div className={styles.detailsContainer}>
          <div>
            {index > 0 && <div className={styles.positionBien}>{index}</div>}
            <h4 className={styles.localisation}>{localisation}</h4>
            <p className={styles.titleBien}>{title}</p>

            <div className={styles.partialCarteristique}>
              {caracteristique.split('#').map(
                (value, index) =>
                  index <= 3 && (
                    <div className={styles.oneCaractq}>
                      <p></p>
                      <p>{value}</p>
                    </div>
                  ),
              )}
            </div>
          </div>

          <h3 className={styles.prix}>{prix.toLocaleString('fr-FR')} €</h3>
        </div>
      </div>
    </Link>
  )
}

export default CardBien
