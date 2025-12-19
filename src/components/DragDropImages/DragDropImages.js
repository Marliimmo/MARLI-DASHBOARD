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
              let imageUrl = null
              
              if (typeof imageData === 'string') {
                imageUrl = imageData
              } else if (imageData && imageData.url) {
                imageUrl = imageData.url
              }
              
              if (imageUrl) {
                // Si c'est une URL Cloudinary, on la garde telle quelle
                if (!imageUrl.startsWith('http')) {
                  const cleanUrl = imageUrl.replace('imagesBienMarli/', '')
                  imageUrl = `${API_URL}/bien/images/imagesBienMarli/${cleanUrl}`
                }
                
                imageUrls.push({
                  url: imageUrl,
                  existing: true,
                  isCloudinary: imageUrl.includes('cloudinary.com'),
                  id: key
                })
              }
            })
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
      setMessageFecth('Erreur réseau.')
    } finally {
      setLoading(false)
    }
  }

  const handleFileChange = (e) => {
    const files = Array.from(e.target.files)
    const fileObjects = files.map((file) => ({
      file,
      url: URL.createObjectURL(file),
      existing: false,
      isCloudinary: false
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
      const token = Cookies.get('_marli_tk_log')
      const formData = new FormData()
      
      // Séparer les images existantes (Cloudinary) des nouvelles à uploader
      const existingCloudinaryUrls = []
      const newFiles = []
      
      images.forEach((img) => {
        if (img.existing && img.isCloudinary) {
          // Image déjà sur Cloudinary : on garde juste l'URL
          existingCloudinaryUrls.push(img.url)
        } else if (img.file) {
          // Nouvelle image : on l'ajoute au FormData pour upload
          newFiles.push(img.file)
        }
      })
      
      // Ajouter les URLs Cloudinary existantes
      formData.append('existingImages', JSON.stringify(existingCloudinaryUrls))
      
      // Ajouter les nouvelles images à uploader
      newFiles.forEach((file) => {
        formData.append('images', file)
      })
      
      // Ajouter la référence
      formData.append('reference', reference)
      
      // Utiliser /update-multiple-images au lieu de /update-image
      const response = await fetch(`${API_URL}/bien/update-multiple-images`, {
        method: 'POST',
        headers: { 
          'Authorization': `Bearer ${token}`
          // Pas de Content-Type : le navigateur le gère automatiquement avec FormData
        },
        body: formData
      })
      
      if (response.ok) {
        setModifAuthorize(true)
        setCallBackMessage(true)
        setMessageFecth('Images enregistrées avec succès !')
        setHasChanges(false)
        
        // Recharger les images pour avoir les nouvelles URLs Cloudinary
        await loadExistingImages()
        
        if (onUpdate) onUpdate()
        
        setTimeout(() => {
          setCallBackMessage(false)
        }, 2000)
      } else {
        const errorData = await response.json()
        throw new Error(errorData.message || 'Erreur lors de la sauvegarde')
      }
    } catch (error) {
      console.error('Erreur lors de la sauvegarde:', error)
      setModifAuthorize(false)
      setCallBackMessage(true)
      setMessageFecth(`Erreur: ${error.message}`)
      setTimeout(() => setCallBackMessage(false), 3000)
    } finally {
      setLoading(false)
    }
  }

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

  const confirmDelete = () => {
    if (imageToDelete !== null) {
      const newImages = images.filter((_, i) => i !== imageToDelete)
      setImages(newImages)
      setHasChanges(true)
      setImageToDelete(null)
      setConfirmationContainer(false)
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
          message="Êtes-vous sûr de vouloir supprimer cette image ?"
          onConfirm={confirmDelete}
          onCancel={cancelDelete}
        />
      )}
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
            </div>
          ))
        )}
      </div>
    </div>
  )
}

export default DragDropImages
