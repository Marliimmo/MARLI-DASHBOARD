import React, { useEffect, useState } from 'react'
import CardAvis from '../../components/CardAvis/CardAvis'
import styles from './AvisUser.module.scss'
import Cookies from 'js-cookie'

function AvisUser() {
  const [reviews, setReviews] = useState([])
  const [reload, setReload] = useState(true)
  const [loading, setLoading] = useState('')
  // Formulaire d'ajout d'un avis par l'administratrice
  const [showForm, setShowForm] = useState(false)
  const [newAvis, setNewAvis] = useState({ pseudo: '', stars: 5, urlImage: 'women_1', description: '', publier: true })
  const [formMessage, setFormMessage] = useState('')

  const addAvis = async (e) => {
    e.preventDefault()
    setFormMessage('Enregistrement…')
    try {
      const token = Cookies.get('_marli_tk_log')
      const response = await fetch(`${process.env.REACT_APP_API_URL}/user/admin-review`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
        body: JSON.stringify(newAvis),
      })
      if (response.ok) {
        setFormMessage('')
        setShowForm(false)
        setNewAvis({ pseudo: '', stars: 5, urlImage: 'women_1', description: '', publier: true })
        setReload(!reload)
      } else {
        const r = await response.json().catch(() => ({}))
        setFormMessage(r.message || "Erreur lors de l'enregistrement")
      }
    } catch (error) {
      setFormMessage("Erreur lors de l'enregistrement")
    }
  }

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
        const token = Cookies.get('_marli_tk_log')
        const response = await fetch(
          `${process.env.REACT_APP_API_URL}/user/reviews?allreviews=true`,
          { headers: { Authorization: `Bearer ${token}` } },
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
    <div className={styles.allContainer}>
      <h2 className='titlePage'>Tous les avis client</h2>
      <div className={styles.addZone}>
        {!showForm ? (
          <button className={styles.addButton} onClick={() => setShowForm(true)}>
            + Ajouter un avis
          </button>
        ) : (
          <form className={styles.addForm} onSubmit={addAvis}>
            <label>Nom affiché *</label>
            <input
              value={newAvis.pseudo}
              onChange={(e) => setNewAvis({ ...newAvis, pseudo: e.target.value })}
              maxLength={60}
              required
            />
            <label>Note *</label>
            <select
              value={newAvis.stars}
              onChange={(e) => setNewAvis({ ...newAvis, stars: Number(e.target.value) })}
            >
              {[5, 4, 3, 2, 1].map((n) => (
                <option key={n} value={n}>{'★'.repeat(n)} ({n}/5)</option>
              ))}
            </select>
            <label>Avatar</label>
            <select
              value={newAvis.urlImage}
              onChange={(e) => setNewAvis({ ...newAvis, urlImage: e.target.value })}
            >
              <option value='women_1'>Femme 1</option>
              <option value='women_2'>Femme 2</option>
              <option value='women_3'>Femme 3</option>
              <option value='men_1'>Homme 1</option>
              <option value='men_2'>Homme 2</option>
              <option value='men_3'>Homme 3</option>
            </select>
            <label>Avis *</label>
            <textarea
              rows='5'
              value={newAvis.description}
              onChange={(e) => setNewAvis({ ...newAvis, description: e.target.value })}
              maxLength={2000}
              required
            />
            <label className={styles.checkbox}>
              <input
                type='checkbox'
                checked={newAvis.publier}
                onChange={(e) => setNewAvis({ ...newAvis, publier: e.target.checked })}
              />
              Publier directement sur le site
            </label>
            <div className={styles.formActions}>
              <button type='submit'>Enregistrer l'avis</button>
              <button type='button' onClick={() => { setShowForm(false); setFormMessage('') }}>
                Annuler
              </button>
            </div>
            {formMessage && <p className={styles.formMessage}>{formMessage}</p>}
          </form>
        )}
      </div>
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
    </div>
  )
}

export default AvisUser
