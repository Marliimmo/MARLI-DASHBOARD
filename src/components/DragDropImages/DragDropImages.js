import React, { useState, useEffect, useCallback } from 'react'
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

  const loadExistingImages = useCallback(async () => {
    setLoading(true)
    try {
      const response = await fetch(`${API_URL}/bien/get-one?ref=${reference}`)
      if (response.ok) {
        const data = await response.json()
        if (data._medias) {
          const imageUrls = []
          Object.keys(data._medias)
            .filter(key => key.startsWith('image_galerie_'))
            .sort((a, b) => parseInt(a.replace('image_galerie_', '')) - parseInt(b.replace('image_galerie_', '')))
            .forEach(key => {
              const imageData = data._medias[key]
              let imageUrl = null
              if (typeof imageData === 'string') imageUrl = imageData
              else if (imageData && imageData.url) imageUrl = imageData.url
              if (imageUrl) {
                if (!imageUrl.startsWith('http')) {
                  const cleanUrl = imageUrl.replace('imagesBienMarli/', '')
                  imageUrl = `${API_URL}/bien/images/imagesBienMarli/${cleanUrl}`
                }
                imageUrls.push({ url: imageUrl, existing: true, isCloudinary: imageUrl.includes('cloudinary.com'), id: key })
              }
            })
          setImages(imageUrls)
        }
      }
    } catch (error) {
      console.error('Erreur chargement images:', error)
    } finally {
      setLoading(false)
    }
  }, [API_URL, reference])

  useEffect(() => {
    if (reference) loadExistingImages()
  }, [reference, loadExistingImages])

  const handleFileChange = (e) => {
    const files = Array.from(e.target.files)
    const fileObjects = files.map((file) => ({ file, url: URL.createObjectURL(file), existing: false, isCloudinary: false }))
    setImages(prev => [...prev, ...fileObjects])
    setHasChanges(true)
  }

  const saveImages = async (imageList) => {
    setLoading(true)
    try {
      const token = Cookies.get('_marli_tk_log')
      const formData = new FormData()
      formData.append('reference', reference)

      const keepUrls = []
      imageList.forEach((img) => {
        if (img.existing && img.isCloudinary) {
          keepUrls.push(img.url)
        } else if (img.file) {
          formData.append('images', img.file)
        }
      })

      formData.append('keepUrls', JSON.stringify(keepUrls))

      const response = await fetch(`${API_URL}/bien/update-multiple-images`, {
        method: 'POST',
        headers: { 'Authorization': `Bearer ${token}` },
        body: formData
      })

      if (response.ok) {
        setModifAuthorize(true)
        setCallBackMessage(true)
        setMessageFecth('Images enregistrées avec succès !')
        setHasChanges(false)
        await loadExistingImages()
        if (onUpdate) onUpdate()
        setTimeout(() => setCallBackMessage(false), 2000)
      } else {
        const err = await response.json()
        setModifAuthorize(false)
        setCallBackMessage(true)
        setMessageFecth(err.message || 'Erreur serveur')
        setTimeout(() => setCallBackMessage(false), 3000)
      }
    } catch (error) {
      setModifAuthorize(false)
      setCallBackMessage(true)
      setMessageFecth('Erreur réseau')
      setTimeout(() => setCallBackMessage(false), 3000)
    } finally {
      setLoading(false)
    }
  }

  const handleSave = () => saveImages(images)

  const handleDragStart = (e, index) => {
    e.dataTransfer.effectAllowed = 'move'
    e.dataTransfer.setData('text/html', index)
  }

  const handleDrop = (e, dropIndex) => {
    e.preventDefault()
    const dragIndex = parseInt(e.dataTransfer.getData('text/html'))
    if (dragIndex === dropIndex) return
    const newImages = [...images]
    const draggedImage = newImages[dragIndex]
    newImages.splice(dragIndex, 1)
    newImages.splice(dropIndex, 0, draggedImage)
    setImages(newImages)
    setHasChanges(true)
  }

  const handleDeleteClick = (index) => {
    setImageToDelete(index)
    setConfirmationContainer(true)
  }

  const confirmDelete = async () => {
    if (imageToDelete !== null) {
      const newImages = images.filter((_, i) => i !== imageToDelete)
      setImageToDelete(null)
      setConfirmationContainer(false)
      await saveImages(newImages)
    }
  }

  const cancelDelete = () => {
    setImageToDelete(null)
    setConfirmationContainer(false)
  }

  return (
    <div className={styles.dragDropContainer}>
      {loading && <GifLoading />}
      {callBackMessage && <NotifFeedBackFecth message={messageFecth} authorize={modifAuthorize} />}
      {confirmationContainer && (
        <ConfirmationRequired
          contexte="Êtes-vous sûr de vouloir supprimer cette image ?"
          confirmation={confirmDelete}
          reset={cancelDelete}
        />
      )}
      <div className={styles.header}>
        <label htmlFor="file-upload" className={styles.uploadButton}>
          <FontAwesomeIcon icon={faCamera} />
          <span>Ajouter des images</span>
        </label>
        <input id="file-upload" type="file" multiple accept="image/*" onChange={handleFileChange} className={styles.fileInput} />
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
              <button onClick={() => handleDeleteClick(index)} className={styles.deleteButton} type="button">
                <FontAwesomeIcon icon={faXmarkCircle} />
              </button>
              <span className={styles.dragHandle}>
                <FontAwesomeIcon icon={faGripVertical} />
              </span>
            </div>
          ))
        )}
      </div>
    </div>
  )
}

export default DragDropImages
