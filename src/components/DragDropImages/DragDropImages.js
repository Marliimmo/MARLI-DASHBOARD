import React, { useState, useEffect } from 'react'
import styles from './DragDropImages.module.scss'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faCamera, faXmarkCircle, faGripVertical, faSave } from '@fortawesome/free-solid-svg-icons'
import Cookies from 'js-cookie'
import NotifFeedBackFecth from '../NotifFeedBackFecth/NotifFeedBackFecth'
import GifLoading from '../GifLoading/GifLoading'
import ConfirmationRequired from '../ConfirmationRequired/ConfirmationRequired'

const DragDropImages = ({ modifAuthorizeValue, callBackMessageValue, messageFecthValue, onUpdate }) => {
  const [images, setImages] = useState([])
  const [confirmationContainer, setConfirmationContainer] = useState(false)
  const [imageToDelete, setImageToDelete] = useState(null)
  const [modifAuthorize, setModifAuthorize] = useState(modifAuthorizeValue)
  const [callBackMessage, setCallBackMessage] = useState(callBackMessageValue)
  const [messageFecth, setMessageFecth] = useState(messageFecthValue)
  const [loading, setLoading] = useState(false)

  // Charge les images si besoin
  useEffect(() => {
    // Ici tu peux charger les images existantes via API ou props
  }, [])

  const handleDragStart = (e, index) => {
    e.dataTransfer.setData('dragIndex', index)
  }

  const handleDrop = (e, dropIndex) => {
    const dragIndex = e.dataTransfer.getData('dragIndex')
    if (dragIndex === null) return
    const newImages = [...images]
    const [draggedImage] = newImages.splice(dragIndex, 1)
    newImages.splice(dropIndex, 0, draggedImage)
    setImages(newImages)
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
    }
  }

  const handleFileChange = (e) => {
    const files = Array.from(e.target.files)
    const fileObjects = files.map((file) => ({ file, url: URL.createObjectURL(file) }))
    setImages([...images, ...fileObjects])
  }

  return (
    <>
      <div className={styles.dragDropContainer}>
        <input
          type="file"
          multiple
          accept="image/*"
          onChange={handleFileChange}
          className={styles.fileInput}
        />
        <div className={styles.imagesList}>
          {images.map((img, index) => (
            <div
              key={index}
              className={styles.imageItem}
              draggable
              onDragStart={(e) => handleDragStart(e, index)}
              onDrop={(e) => handleDrop(e, index)}
              onDragOver={(e) => e.preventDefault()}
            >
              <img src={img.url} alt={`upload-${index}`} />
              <button onClick={() => handleDeleteClick(index)}>
                <FontAwesomeIcon icon={faXmarkCircle} />
              </button>
              <span className={styles.dragHandle}>
                <FontAwesomeIcon icon={faGripVertical} />
              </span>
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
