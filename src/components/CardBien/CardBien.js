import React, { useState } from 'react'
import styles from './CardBien.module.scss'
import { Link } from 'react-router-dom'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faTrash } from '@fortawesome/free-solid-svg-icons'
import Cookies from 'js-cookie'
import ConfirmationRequired from '../ConfirmationRequired/ConfirmationRequired'

function CardBien({
  imgUrl,
  prix,
  localisation,
  caracteristique,
  title,
  status,
  index,
  reference,
  reload,
}) {
  const token = Cookies.get('_marli_tk_log')
  const [confirmationContainer, setConfirmationContainer] = useState(false)
  const [loading, setLoading] = useState('')

  const deleteBien = async (e) => {
    setLoading(true)
    e.preventDefault()
    try {
      const response = await fetch(
        `${process.env.REACT_APP_API_URL}/bien/delete?ref=${reference}`,
        {
          method: 'DELETE',
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        },
      )

      if (response.ok) {
        setTimeout(() => {
          setLoading(false)
          setConfirmationContainer(false)
          reload()
        }, 1000)
      } else {
        setTimeout(() => {
          setLoading(false)
          setConfirmationContainer(false)
        }, 1000)
      }
    } catch (error) {
      setLoading(false)
      setConfirmationContainer(false)
      console.log('Erreur lors de la requette fecth', error)
    }
  }

  return (
    <div style={{ position: 'relative' }}>
      <div className={styles.btnContainer}>
        {index > 0 && <div className={styles.positionBien}>{index}</div>}
        <div
          className={styles.deleteIcon}
          onClick={() => setConfirmationContainer(true)}
        >
          <FontAwesomeIcon icon={faTrash} />
        </div>
      </div>

      <Link to={`/dashboard/modifier-un-bien/${reference}`}>
        <div className={styles.allContainer}>
          <div className={styles.imageContainer}>
            <img
              src={imgUrl}
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

      {confirmationContainer && (
        <ConfirmationRequired
          contexte={`Confirmez-vous vraiment supprimer ce bien "${title}" ?`}
          confirmation={deleteBien}
          reset={() => setConfirmationContainer(false)}
          loading={loading}
        />
      )}
    </div>
  )
}

export default CardBien
