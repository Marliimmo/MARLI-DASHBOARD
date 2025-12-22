import styles from './GererArticle.module.scss'
import { useEffect, useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import Cookies from 'js-cookie'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faSave, faArrowLeft, faImage } from '@fortawesome/free-solid-svg-icons'
import GifLoading from '../../components/GifLoading/GifLoading'
import { Helmet } from 'react-helmet'
import NotifFeedBackFecth from '../../components/NotifFeedBackFecth/NotifFeedBackFecth'

function GererArticle() {
  const { id } = useParams() // Si id existe, on est en mode édition
  const navigate = useNavigate()
  const isEditMode = !!id

  const [title, setTitle] = useState('')
  const [excerpt, setExcerpt] = useState('')
  const [content, setContent] = useState('')
  const [urlImage, setUrlImage] = useState('')
  const [imageFile, setImageFile] = useState(null)
  const [imagePreview, setImagePreview] = useState(null)
  
  const [loading, setLoading] = useState(false)
  const [modifAuthorize, setModifAuthorize] = useState(false)
  const [callBackMessage, setCallBackMessage] = useState(false)
  const [messageFecth, setMessageFecth] = useState('')

  const API_URL = process.env.REACT_APP_API_URL || 'https://marli-backend.onrender.com'

  useEffect(() => {
    if (isEditMode) {
      loadArticle()
    }
  }, [id])

  const loadArticle = async () => {
    setLoading(true)
    try {
      const response = await fetch(`${API_URL}/article/get-articles`)
      if (response.ok) {
        const articles = await response.json()
        const article = articles.find(a => a._id === id)
        
        if (article) {
          setTitle(article.title)
          setExcerpt(article.excerpt)
          setContent(article.content)
          setUrlImage(article.urlImage)
          setImagePreview(article.urlImage)
        }
      }
    } catch (error) {
      console.error('Erreur:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleImageChange = (e) => {
    const file = e.target.files[0]
    if (file) {
      setImageFile(file)
      setImagePreview(URL.createObjectURL(file))
    }
  }

  const uploadImage = async () => {
    if (!imageFile) return urlImage // Si pas de nouvelle image, garder l'ancienne URL

    const formData = new FormData()
    formData.append('image', imageFile)

    try {
      const token = Cookies.get('_marli_tk_log')
      const response = await fetch(`${API_URL}/article/upload-image`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`
        },
        body: formData
      })

      if (response.ok) {
        const data = await response.json()
        return data.url // URL Cloudinary
      } else {
        throw new Error('Erreur upload image')
      }
    } catch (error) {
      console.error('Erreur upload:', error)
      throw error
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()

    if (!title || !excerpt || !content) {
      setModifAuthorize(false)
      setMessageFecth('Veuillez remplir tous les champs')
      setCallBackMessage(true)
      setTimeout(() => setCallBackMessage(false), 3000)
      return
    }

    if (!imageFile && !urlImage) {
      setModifAuthorize(false)
      setMessageFecth('Veuillez ajouter une image')
      setCallBackMessage(true)
      setTimeout(() => setCallBackMessage(false), 3000)
      return
    }

    setLoading(true)
    try {
      // Upload l'image si une nouvelle a été sélectionnée
      const finalImageUrl = await uploadImage()

      const token = Cookies.get('_marli_tk_log')
      const url = isEditMode
        ? `${API_URL}/article/update/${id}`
        : `${API_URL}/article/create`
      
      const method = isEditMode ? 'PUT' : 'POST'

      const response = await fetch(url, {
        method,
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          title,
          excerpt,
          content,
          urlImage: finalImageUrl
        })
      })

      if (response.ok) {
        setModifAuthorize(true)
        setMessageFecth(
          isEditMode
            ? 'Article modifié avec succès !'
            : 'Article créé avec succès !'
        )
        setCallBackMessage(true)
        
        setTimeout(() => {
          navigate('/mes-articles')
        }, 2000)
      } else {
        throw new Error('Erreur serveur')
      }
    } catch (error) {
      console.error('Erreur:', error)
      setModifAuthorize(false)
      setMessageFecth('Erreur lors de la sauvegarde')
      setCallBackMessage(true)
      setTimeout(() => setCallBackMessage(false), 3000)
    } finally {
      setLoading(false)
    }
  }

  return (
    <>
      <Helmet>
        <title>
          {isEditMode ? 'Modifier l\'article' : 'Créer un article'} - Dashboard Marli
        </title>
      </Helmet>

      <div className={styles.container}>
        {loading && <GifLoading />}
        {callBackMessage && (
          <NotifFeedBackFecth
            message={messageFecth}
            authorize={modifAuthorize}
          />
        )}

        <div className={styles.header}>
          <button onClick={() => navigate('/mes-articles')} className={styles.backButton}>
            <FontAwesomeIcon icon={faArrowLeft} />
            <span>Retour</span>
          </button>
          <h1>{isEditMode ? 'Modifier l\'article' : 'Créer un article'}</h1>
        </div>

        <form onSubmit={handleSubmit} className={styles.form}>
          <div className={styles.formGroup}>
            <label htmlFor="title">Titre *</label>
            <input
              type="text"
              id="title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Titre de l'article"
              required
            />
          </div>

          <div className={styles.formGroup}>
            <label htmlFor="excerpt">Extrait / Résumé *</label>
            <textarea
              id="excerpt"
              value={excerpt}
              onChange={(e) => setExcerpt(e.target.value)}
              placeholder="Court résumé de l'article (2-3 lignes)"
              rows="3"
              required
            />
          </div>

          <div className={styles.formGroup}>
            <label htmlFor="content">Contenu *</label>
            <textarea
              id="content"
              value={content}
              onChange={(e) => setContent(e.target.value)}
              placeholder="Contenu complet de l'article"
              rows="12"
              required
            />
          </div>

          <div className={styles.formGroup}>
            <label htmlFor="image">Image de couverture *</label>
            <div className={styles.imageUpload}>
              {imagePreview && (
                <div className={styles.imagePreview}>
                  <img src={imagePreview} alt="Aperçu" />
                </div>
              )}
              <label htmlFor="image-input" className={styles.imageButton}>
                <FontAwesomeIcon icon={faImage} />
                <span>{imagePreview ? 'Changer l\'image' : 'Ajouter une image'}</span>
              </label>
              <input
                type="file"
                id="image-input"
                accept="image/*"
                onChange={handleImageChange}
                style={{ display: 'none' }}
              />
            </div>
          </div>

          <div className={styles.actions}>
            <button type="submit" className={styles.submitButton}>
              <FontAwesomeIcon icon={faSave} />
              <span>{isEditMode ? 'Enregistrer les modifications' : 'Créer l\'article'}</span>
            </button>
          </div>
        </form>
      </div>
    </>
  )
}

export default GererArticle
