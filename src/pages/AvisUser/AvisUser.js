import React, { useEffect, useState } from 'react'
import CardAvis from '../../components/CardAvis/CardAvis'
import styles from './AvisUser.module.scss'
import Cookies from 'js-cookie'

function AvisUser() {
  const [reviews, setReviews] = useState([])
  const [reload, setReload] = useState(true)
  const [loading, setLoading] = useState('')

  const SetValidation = async (id, status) => {
    setLoading(id)
    const token = Cookies.get('_marli_tk_log')
    try {
      const response = await fetch(
        `${process.env.REACT_APP_API_URL}/user/validation-review?id=${id}&status=${status === 'not-valid' ? 'valid' : 'not-valid'}`,
        {
          method: 'PATCH',
          headers: { Authorization: `Bearer ${token}` },
        },
      )

      if (response.ok) {
        setTimeout(() => {
          setLoading('')
          setReload(!reload)
        }, 2000)
      } else {
        setTimeout(() => {
          setLoading('')
        }, 2000)
      }
    } catch (error) {
      setLoading('')
      console.log('Erreur lors de la requette fecth', error)
    }
  }

  useEffect(() => {
    try {
      const fectData = async () => {
        const response = await fetch(
          `${process.env.REACT_APP_API_URL}/user/reviews?allreviews=true`,
        )
        if (response.ok) {
          const result = await response.json()
          setReviews(result)
        }
      }

      fectData()
    } catch (error) {
      console.log('Erreur lors de la requette fecth', error)
    }
  }, [reload])

  return (
    <>
      <h2 className='titlePage'>Tous les avis client</h2>
      <div className={styles.cardContainer}>
        {reviews.map((review, index) => (
          <div className={styles.card} key={index}>
            <CardAvis avis={review} />
            <button
              onClick={() => SetValidation(review._id, review.status)}
              style={
                review.status === 'not-valid'
                  ? { backgroundColor: 'green' }
                  : { backgroundColor: 'red' }
              }
            >
              {loading === review._id
                ? 'Veuillez patienter'
                : review.status === 'not-valid'
                  ? "Valider l'avis"
                  : "Désactiver l'avis"}
            </button>
          </div>
        ))}
      </div>
    </>
  )
}

export default AvisUser
