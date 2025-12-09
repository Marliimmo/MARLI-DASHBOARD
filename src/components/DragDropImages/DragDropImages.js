import React, { useState, useEffect } from 'react'
import styles from './DragDropImages.module.scss'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faCamera, faXmarkCircle, faGripVertical, faSave } from '@fortawesome/free-solid-svg-icons'
import Cookies from 'js-cookie'
import NotifFeedBackFecth from '../NotifFeedBackFecth/NotifFeedBackFecth'
import GifLoading from '../GifLoading/GifLoading'
import ConfirmationRequired from '../ConfirmationRequired/ConfirmationRequired'

const DragDropImages = ({ bienId, modifAuthorizeValue, callBackMessageValue, messageFecthValue, onUpdate }) => {
  const [images, setImages] = useState([])
  const [confirmationContainer, setConfirmationContainer] = useState(false)
  const [imageToDelete, setImageToDelete] = useState(null)
  const [modifAuthorize, setModifAuthorize] = useState(modifAuthorizeValue)
  const [callBackMessage, setCallBackMessage] = useState(callBackMessageValue)
  const [messageFecth, setMessageFecth] = useState(messageFecthValue)
  const [loading, setLoading] = useState(false)
  const [hasChanges, setHasChanges] = useState(false)

  const API_URL = process.env.REACT_APP_API_URL || 'https://marli-backend.onrender.com'

  // Charge les images existantes du bien
  useEffect(() => {
    if (bienId) {
      loadExistingImages()
    }
  }, [bienId])

  const loadExistingImages = async () => {
    setLoading(true)
    try {
      const token = Cookies.get('token')
      const response = await fetch(`${API_URL}/user/tk_log:1`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      })

      if (response.ok) {
        const data = await response.json()
        // Trouve le bien correspondant
        const bien = data.biens?.find(b => b._id === bienId)
        if (bien && bien.images) {
          // Convertir les images existantes au bon format
          const existingImages = bien.images.map((imgUrl, index) => ({
            url: imgUrl,
            existing: true,
            id: index
          }))
          setImages(existingImages)
        }
      } else if (response.status === 401) {
        setModifAuthorize(false)
        setCallBackMessage(true)
        setMessageFecth('Session expirée. Reconnectez-vous.')
      }
    } catch (error) {
      console.error('Erreur lors du chargement des images:', error)
      setModifAuthorize(false)
      setCallBackMessage(true)
      setMessageFecth('Erreur de connexion au serveur.')
    } finally {
      setLoading(false)
    }
  }

  const handleDragStart = (e, index) => {
    e.dataTransfer.setData('dragIndex', index)
  }

  const handleDrop = (e, dropIndex) => {
    e.preventDefault()
    const dragIndex = parseInt(e.dataTransfer.getData('dragIndex'))
    if (isNaN(dragIndex) || dragIndex === dropIndex) return

    const newImages = [...images]
    const [draggedImage] = newImages.splice(dragIndex, 1)
    newImages.splice(dropIndex, 0, draggedImage)
    setImages(newImages)
    setHasChanges(true)
  }

  const handleDeleteClick = (index) => {
    setImageToDelete(index)
    setConfirmationContainer(true)
  }

  const confirmDelete = () => {
    if (imageToDelete !== null) {
      const newImages = [...images]
      newImages.splice(imageToDelete, 1)
      setImages(newImages)
      setImageToDelete(null)
      setConfirmationContainer(false)
      setHasChanges(true)
    }
  }

  const handleFileChange = (e) => {
    const files = Array.from(e.target.files)
    const fileObjects = files.map((file) => ({
      file,
      url: URL.createObjectURL(file),
      existing: false
    }))
    setImages([...images, ...fileObjects])
    setHasChanges(true)
  }

  const handleSave = async () => {
    if (!hasChanges) {
      setModifAuthorize(true)
      setCallBackMessage(true)
      setMessageFecth('Aucune modification à enregistrer.')
      return
    }

    setLoading(true)
    try {
      const token = Cookies.get('token')
      const formData = new FormData()

      // Ajouter les nouvelles images
      images.forEach((img, index) => {
        if (!img.existing && img.file) {
          formData.append('images', img.file)
        }
      })

      // Ajouter l'ordre des images existantes
      const existingUrls = images.filter(img => img.existing).map(img => img.url)
      formData.append('existingImages', JSON.stringify(existingUrls))
      formData.append('bienId', bienId)

      const response = await fetch(`${API_URL}/user/update-images`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`
        },
        body: formData
      })

      if (response.ok) {
        const data = await response.json()
        setModifAuthorize(true)
        setCallBackMessage(true)
        setMessageFecth('Images enregistrées avec succès !')
        setHasChanges(false)
        
        // Recharger les images pour avoir les URLs Cloudinary
        if (onUpdate) onUpdate()
        loadExistingImages()
      } else if (response.status === 401) {
        setModifAuthorize(false)
        setCallBackMessage(true)
        setMessageFecth('Session expirée. Reconnectez-vous.')
      } else {
        const error = await response.json()
        setModifAuthorize(false)
        setCallBackMessage(true)
        setMessageFecth(error.message || 'Erreur lors de l\'enregistrement.')
      }
    } catch (error) {
      console.error('Erreur:', error)
      setModifAuthorize(false)
      setCallBackMessage(true)
      setMessageFecth('Erreur de connexion au serveur.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <>
      <div className={styles.dragDropContainer}>
        <div className={styles.header}>
          <label htmlFor="file-upload" className={styles.uploadButton}>
            <FontAwesomeIcon icon={faCamera} />
            <span>Ajouter des images</span>
          </label>
          <input
            id="file-upload"
            type="file"
            multiple
            accept="image/*"
            onChange={handleFileChange}
            className={styles.fileInput}
          />
          {hasChanges && (
            <button onClick={handleSave} className={styles.saveButton}>
              <FontAwesomeIcon icon={faSave} />
              <span>Enregistrer</span>
            </button>
          )}
        </div>

        <div className={styles.imagesList}>
          {images.length === 0 ? (
            <p className={styles.emptyState}>Aucune image. Cliquez sur "Ajouter des images" pour commencer.</p>
          ) : (
            images.map((img, index) => (
              <div
                key={`${img.id || index}-${img.url}`}
                className={styles.imageItem}
                draggable
                onDragStart={(e) => handleDragStart(e, index)}
                onDrop={(e) => handleDrop(e, index)}
                onDragOver={(e) => e.preventDefault()}
              >
                <img src={img.url} alt={`upload-${index}`} />
                <button 
                  onClick={() => handleDeleteClick(index)}
                  className={styles.deleteButton}
                  type="button"
                >
                  <FontAwesomeIcon icon={faXmarkCircle} />
                </button>
                <span className={styles.dragHandle}>
                  <FontAwesomeIcon icon={faGripVertical} />
                </span>
                {index === 0 && <span className={styles.mainBadge}>Principal</span>}
              </div>
            ))
          )}
        </div>
      </div>

      <NotifFeedBackFecth
        modifAuthorizeValue={modifAuthorize}
        callBackMessageValue={callBackMessage}
        messageFecthValue={messageFecth}
      />

      {confirmationContainer && (
        <ConfirmationRequired
          contexte="Attention ! La suppression de cette image sera définitive."
          confirmation={confirmDelete}
          reset={() => setConfirmationContainer(false)}
        />
      )}

      {loading && <GifLoading />}
    </>
  )
}

export default DragDropImages