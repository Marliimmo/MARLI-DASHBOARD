import styles from './DragDropImages.module.scss'
import React, { useEffect, useState } from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faCamera, faXmarkCircle, faGripVertical, faSave } from '@fortawesome/free-solid-svg-icons'
import Cookies from 'js-cookie'
import NotifFeedBackFecth from '../NotifFeedBackFecth/NotifFeedBackFecth'
import GifLoading from '../GifLoading/GifLoading'
import ConfirmationRequired from '../ConfirmationRequired/ConfirmationRequired'

function DragDropImages({ bienData, reference, onUpdate }) {
  const [loading, setLoading] = useState(false)
  const [images, setImages] = useState([])
  const [draggedIndex, setDraggedIndex] = useState(null)
  const [hasChanges, setHasChanges] = useState(false)
  const [confirmationContainer, setConfirmationContainer] = useState(false)
  const [deleteTarget, setDeleteTarget] = useState(null)
  const [modifAuthorize, setModifAuthorize] = useState('')
  const [messageFecth, setMessageFecth] = useState('')
  const [callBackMessage, setCallBackMessage] = useState('')

  useEffect(() => {
    if (bienData?._medias) {
      const loadedImages = []
      for (let i = 0; i <= 30; i++) {
        const imageData = bienData._medias[`image_galerie_${i}`]
        loadedImages.push({
          index: i,
          url: imageData?.url || null,
          file: null
        })
      }
      setImages(loadedImages)
    }
  }, [bienData])

  const resetFeedBack = () => {
    setTimeout(() => {
      setModifAuthorize('')
      setCallBackMessage('')
      setMessageFecth('')
    }, 6000)
  }

  const handleImageChange = (index, e) => {
    const selectedFile = e.target.files[0]
    const tailleMaxAutorisee = 5 * 1024 * 1024

    if (selectedFile) {
      const allowedFormats = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp', 'image/svg+xml']

      if (allowedFormats.includes(selectedFile.type) && selectedFile.size <= tailleMaxAutorisee) {
        const reader = new FileReader()
        reader.onload = () => {
          const newImages = [...images]
          newImages[index] = {
            ...newImages[index],
            url: reader.result,
            file: selectedFile,
            isNew: true
          }
          setImages(newImages)
          setHasChanges(true)
        }
        reader.readAsDataURL(selectedFile)
      } else {
        setModifAuthorize('error')
        setCallBackMessage('flex')
        setMessageFecth('Erreur: format ou taille incorrecte (max 5MB)')
        e.target.value = ''
        resetFeedBack()
      }
    }
  }

  const handleDragStart = (index) => {
    setDraggedIndex(index)
  }

  const handleDragOver = (e) => {
    e.preventDefault()
  }

  const handleDrop = (targetIndex) => {
    if (draggedIndex === null || draggedIndex === targetIndex) return

    const newImages = [...images]
    const draggedImage = newImages[draggedIndex]
    const targetImage = newImages[targetIndex]

    newImages[draggedIndex] = targetImage
    newImages[targetIndex] = draggedImage

    setImages(newImages)
    setDraggedIndex(null)
    setHasChanges(true)
  }

  const showDeleteConfirmation = (index, e) => {
    e.preventDefault()
    setDeleteTarget(index)
    setConfirmationContainer(true)
  }

  const confirmDelete = async () => {
    if (deleteTarget === null) return
    
    setConfirmationContainer(false)
    setLoading(true)

    try {
      const imageToDelete = images[deleteTarget]
      if (imageToDelete.url && !imageToDelete.isNew) {
        const tokenLog = Cookies.get('_marli_tk_log')
        const response = await fetch(
          `${process.env.REACT_APP_API_URL}/bien/medias/${imageToDelete.url}?index=${deleteTarget}&ref=${reference}`,
          {
            method: 'DELETE',
            headers: {
              Authorization: `Bearer ${tokenLog}`,
            },
          }
        )

        if (!response.ok) throw new Error('Erreur de suppression')
      }

      const newImages = [...images]
      newImages[deleteTarget] = { index: deleteTarget, url: null, file: null }
      setImages(newImages)
      setHasChanges(true)
      
      setLoading(false)
      setModifAuthorize(true)
      setCallBackMessage('flex')
      setMessageFecth('Image supprimée avec succès')
      resetFeedBack()
    } catch (error) {
      setLoading(false)
      setModifAuthorize('error')
      setCallBackMessage('flex')
      setMessageFecth('Erreur lors de la suppression')
      resetFeedBack()
    }

    setDeleteTarget(null)
  }

  const saveChanges = async () => {
    setLoading(true)
    const tokenLog = Cookies.get('_marli_tk_log')
    let successCount = 0
    let errorCount = 0

    try {
      for (let i = 0; i < images.length; i++) {
        const image = images[i]
        
        if (image.file && image.isNew) {
          const formData = new FormData()
          formData.append('image', image.file)

          try {
            const response = await fetch(
              `${process.env.REACT_APP_API_URL}/bien/update-image?index=${i}&ref=${reference}`,
              {
                method: 'PUT',
                headers: {
                  Authorization: `Bearer ${tokenLog}`,
                },
                body: formData,
              }
            )

            if (response.ok) {
              const result = await response.json()
              const newImages = [...images]
              newImages[i] = {
                index: i,
                url: result.imagePath,
                file: null,
                isNew: false
              }
              setImages(newImages)
              successCount++
            } else {
              errorCount++
            }
          } catch (error) {
            errorCount++
          }
        }
      }

      setLoading(false)
      setHasChanges(false)
      
      if (errorCount === 0) {
        setModifAuthorize(true)
        setCallBackMessage('flex')
        setMessageFecth(`${successCount} image(s) sauvegardée(s) avec succès`)
      } else {
        setModifAuthorize('error')
        setCallBackMessage('flex')
        setMessageFecth(`${successCount} réussite(s), ${errorCount} erreur(s)`)
      }
      
      resetFeedBack()
      
      if (onUpdate) onUpdate()
    } catch (error) {
      setLoading(false)
      setModifAuthorize('error')
      setCallBackMessage('flex')
      setMessageFecth('Erreur lors de la sauvegarde')
      resetFeedBack()
    }
  }

  return (
    <>
      <div className={styles.container}>
        {loading && <GifLoading positionDiv='fixed' />}
        
        <div className={styles.header}>
          <h3>Gestion des images (Glisser-Déposer pour réorganiser)</h3>
          {hasChanges && (
            <button className={styles.btnSave} onClick={saveChanges}>
              <FontAwesomeIcon icon={faSave} /> Sauvegarder les modifications
            </button>
          )}
        </div>

        <div className={styles.imagesGrid}>
          {images.map((image, index) => (
            <div
              key={index}
              className={`${styles.imageCard} ${draggedIndex === index ? styles.dragging : ''}`}
              draggable={!!image.url}
              onDragStart={() => handleDragStart(index)}
              onDragOver={handleDragOver}
              onDrop={() => handleDrop(index)}
            >
              <div className={styles.imageNumber}>{index}</div>
              
              {image.url ? (
                <>
                  <img src={image.url} alt={`Galerie ${index}`} />
                  <div className={styles.imageOverlay}>
                    <FontAwesomeIcon icon={faGripVertical} className={styles.dragIcon} />
                    <label htmlFor={`image-${index}`} className={styles.editIcon}>
                      <FontAwesomeIcon icon={faCamera} />
                    </label>
                    <FontAwesomeIcon
                      icon={faXmarkCircle}
                      className={styles.deleteIcon}
                      onClick={(e) => showDeleteConfirmation(index, e)}
                    />
                  </div>
                </>
              ) : (
                <label htmlFor={`image-${index}`} className={styles.emptySlot}>
                  <FontAwesomeIcon icon={faCamera} />
                  <span>Ajouter une image</span>
                </label>
              )}

              <input
                id={`image-${index}`}
                type='file'
                accept='.jpg, .jpeg, .png, .webp, .svg'
                onChange={(e) => handleImageChange(index, e)}
                style={{ display: 'none' }}
              />
            </div>
          ))}
        </div>
      </div>

      <NotifFeedBackFecth
        modifAuthorizeValue={modifAuthorize}
        callBackMessageValue={callBackMessage}
        messageFecthValue={messageFecth}
      />

      {confirmationContainer && (
        <ConfirmationRequired
          contexte='Attention ! La suppression de cette image sera définitive. Confirmez-vous ?'
          confirmation={confirmDelete}
          reset={() => setConfirmationContainer(false)}
        />
      )}
    </>
  )
}

export default DragDropImages
