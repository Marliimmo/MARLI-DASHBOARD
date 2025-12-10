import React, { useState, useEffect } from 'react'
import styles from './DragDropImages.module.scss'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faCamera, faXmarkCircle, faGripVertical, faSave } from '@fortawesome/free-solid-svg-icons'
import Cookies from 'js-cookie'
import NotifFeedBackFecth from '../NotifFeedBackFecth/NotifFeedBackFecth'
import GifLoading from '../GifLoading/GifLoading'
import ConfirmationRequired from '../ConfirmationRequired/ConfirmationRequired'

const DragDropImages = ({ bienId, reference, modifAuthorizeValue, callBackMessageValue, messageFecthValue, onUpdate }) => {
  const [images, setImages] = useState([])
  const [confirmationContainer, setConfirmationContainer] = useState(false)
  const [imageToDelete, setImageToDelete] = useState(null)
  const [modifAuthorize, setModifAuthorize] = useState(modifAuthorizeValue)
  const [callBackMessage, setCallBackMessage] = useState(callBackMessageValue)
  const [messageFecth, setMessageFecth] = useState(messageFecthValue)
  const [loading, setLoading] = useState(false)
  const [hasChanges, setHasChanges] = useState(false)

  const API_URL = process.env.REACT_APP_API_URL || 'https://marli-backend.onrender.com'

  useEffect(() => {
    if (reference) {
      loadExistingImages()
    }
  }, [reference])

  const loadExistingImages = async () => {
    setLoading(true)
    try {
      const response = await fetch(`${API_URL}/bien/get-one?ref=${reference}`)

      if (response.ok) {
        const data = await response.json()
        console.log('Données bien chargées:', data)
        
        if (data._medias) {
          console.log('Structure _medias complète:', JSON.stringify(data._medias, null, 2))
          const imageUrls = []
          Object.keys(data._medias)
            .filter(key => key.startsWith('image_galerie_'))
            .sort((a, b) => {
              const numA = parseInt(a.replace('image_galerie_', ''))
              const numB = parseInt(b.replace('image_galerie_', ''))
              return numA - numB
            })
            .forEach(key => {
              const imageData = data._medias[key]
              console.log(`Image ${key}:`, imageData)
              
              let imageUrl = null
              if (typeof imageData === 'string') {
                imageUrl = imageData
              } else if (imageData && imageData.url) {
                imageUrl = imageData.url
              } else if (imageData && imageData.path) {
                imageUrl = imageData.path
              } else if (imageData && imageData.src) {
                imageUrl = imageData.src
              }
              
              if (imageUrl) {
                imageUrls.push({
                  url: imageUrl,
                  existing: true,
                  id: key
                })
              }
            })
          console.log('URLs extraites:', imageUrls)
          setImages(imageUrls)
        }
      } else {
        console.error('Erreur lors du chargement:', response.status)
        setModifAuthorize(false)
        setCallBackMessage(true)
        setMessageFecth('Erreur lors du chargement des images.')
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
      setTimeout(() => setCallBackMessage(false), 3000)
      return
    }

    setLoading(true)
    try {
      const token = Cookies.get('token')
      const formData = new FormData()

      images.forEach((img, index) => {
        if (!img.existing && img.file) {
          formData.append('images', img.file)
        }
      })

      const existingUrls = images.filter(img => img.existing).map(img => img.url)
      formData.append('existingImages', JSON.stringify(existingUrls))
      formData.append('reference', reference)

      const response = await fetch(`${API_URL}/user/update-images`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`
        },
        body: formData
      })

      if (response.ok) {
        setModifAuthorize(true)
        setCallBackMessage(true)
        setMessageFecth('Images enregistrées avec succès !')
        setHasChanges(false)
        
        if (onUpdate) onUpdate()
        setTimeout(() => {
          setCallBackMessage(false)
          loadExistingImages()
        }, 2000)
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