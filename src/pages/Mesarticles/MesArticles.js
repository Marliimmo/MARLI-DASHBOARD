import styles from './MesArticles.module.scss'
import { useEffect, useState } from 'react'
import Cookies from 'js-cookie'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faPlus, faEdit, faTrash } from '@fortawesome/free-solid-svg-icons'
import GifLoading from '../../components/GifLoading/GifLoading'
import { Link } from 'react-router-dom'
import { Helmet } from 'react-helmet'
import ConfirmationRequired from '../../components/ConfirmationRequired/ConfirmationRequired'
import NotifFeedBackFecth from '../../components/NotifFeedBackFecth/NotifFeedBackFecth'

function MesArticles() {
  const [articles, setArticles] = useState([])
  const [loading, setLoading] = useState(true)
  const [confirmationContainer, setConfirmationContainer] = useState(false)
  const [articleToDelete, setArticleToDelete] = useState(null)
  const [modifAuthorize, setModifAuthorize] = useState(false)
  const [callBackMessage, setCallBackMessage] = useState(false)
  const [messageFecth, setMessageFecth] = useState('')

  const API_URL = process.env.REACT_APP_API_URL || 'https://marli-backend.onrender.com'

  useEffect(() => {
    loadArticles()
  }, [])

  const loadArticles = async () => {
    setLoading(true)
    try {
      const response = await fetch(`${API_URL}/article/get-articles`)
      if (response.ok) {
        const data = await response.json()
        setArticles(data)
      } else {
        console.error('Erreur lors du chargement des articles')
      }
    } catch (error) {
      console.error('Erreur réseau:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleDeleteClick = (article) => {
    setArticleToDelete(article)
    setConfirmationContainer(true)
  }

  const confirmDelete = async () => {
    if (!articleToDelete) return

    setLoading(true)
    try {
      const token = Cookies.get('_marli_tk_log')
      const response = await fetch(`${API_URL}/article/delete/${articleToDelete._id}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      })

      if (response.ok) {
        setModifAuthorize(true)
        setMessageFecth('Article supprimé avec succès !')
        setCallBackMessage(true)
        setTimeout(() => setCallBackMessage(false), 3000)
        loadArticles() // Recharger la liste
      } else {
        setModifAuthorize(false)
        setMessageFecth('Erreur lors de la suppression')
        setCallBackMessage(true)
        setTimeout(() => setCallBackMessage(false), 3000)
      }
    } catch (error) {
      console.error('Erreur:', error)
      setModifAuthorize(false)
      setMessageFecth('Erreur réseau')
      setCallBackMessage(true)
      setTimeout(() => setCallBackMessage(false), 3000)
    } finally {
      setLoading(false)
      setConfirmationContainer(false)
      setArticleToDelete(null)
    }
  }

  const cancelDelete = () => {
    setArticleToDelete(null)
    setConfirmationContainer(false)
  }

  const formatDate = (dateString) => {
    const date = new Date(dateString)
    return date.toLocaleDateString('fr-FR', {
      day: '2-digit',
      month: 'long',
      year: 'numeric'
    })
  }

  return (
    <>
      <Helmet>
        <title>Mes Articles - Dashboard Marli</title>
      </Helmet>

      <div className={styles.container}>
        {loading && <GifLoading />}
        {callBackMessage && (
          <NotifFeedBackFecth
            message={messageFecth}
            authorize={modifAuthorize}
          />
        )}
        {confirmationContainer && (
          <ConfirmationRequired
            contexte={`Voulez-vous vraiment supprimer l'article "${articleToDelete?.title}" ?`}
            confirmation={confirmDelete}
            reset={cancelDelete}
          />
        )}

        <div className={styles.header}>
          <h1>Mes Articles</h1>
          <Link to="/gerer-article" className={styles.createButton}>
            <FontAwesomeIcon icon={faPlus} />
            <span>Créer un article</span>
          </Link>
        </div>

        {articles.length === 0 ? (
          <div className={styles.emptyState}>
            <p>Aucun article pour le moment.</p>
            <Link to="/gerer-article">Créer votre premier article</Link>
          </div>
        ) : (
          <div className={styles.articlesList}>
            {articles.map((article) => (
              <div key={article._id} className={styles.articleCard}>
                <div className={styles.articleImage}>
                  <img src={article.urlImage} alt={article.title} />
                </div>
                <div className={styles.articleContent}>
                  <h2>{article.title}</h2>
                  <p className={styles.excerpt}>{article.excerpt}</p>
                  <div className={styles.articleMeta}>
                    <span className={styles.date}>
                      Créé le {formatDate(article.createdAt)}
                    </span>
                    {article.updatedAt !== article.createdAt && (
                      <span className={styles.updated}>
                        (modifié le {formatDate(article.updatedAt)})
                      </span>
                    )}
                  </div>
                  <div className={styles.actions}>
                    <Link
                      to={`/gerer-article/${article._id}`}
                      className={styles.editButton}
                    >
                      <FontAwesomeIcon icon={faEdit} />
                      <span>Modifier</span>
                    </Link>
                    <button
                      onClick={() => handleDeleteClick(article)}
                      className={styles.deleteButton}
                    >
                      <FontAwesomeIcon icon={faTrash} />
                      <span>Supprimer</span>
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </>
  )
}

export default MesArticles
