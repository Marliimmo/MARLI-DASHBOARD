import styles from './UpdateImageBien.module.scss'
import React, { useEffect, useState } from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faCamera } from '@fortawesome/free-solid-svg-icons'
import { faXmarkCircle } from '@fortawesome/free-solid-svg-icons'
import Cookies from 'js-cookie'
import NotifFeedBackFecth from '../NotifFeedBackFecth/NotifFeedBackFecth'
import GifLoading from '../GifLoading/GifLoading'
import ConfirmationRequired from '../ConfirmationRequired/ConfirmationRequired'

function UpdateImageBien({ bienData, index, reference }) {
  const [loading, setLoading] = useState(false)
  const [selectedImage, setSelectedImage] = useState(null)
  const [imagePreview, setImagePreview] = useState(null)
  const [deleteButton, setDeleteButton] = useState(false)
  const [newModif, setNewModif] = useState(false)
  const [modifAuthorize, setModifAuthorize] = useState('')
  const [messageFecth, setMessageFecth] = useState('')
  const [callBackMessage, setCallBackMessage] = useState('')
  let imageURL = bienData?._medias?.[`image_galerie_${index}`]?.url

  const [confirmationContainer, setConfirmationContainer] = useState(false)

  const ShowConfirmationContainer = (e) => {
    e.preventDefault()
    setConfirmationContainer(!confirmationContainer)
  }
  const ConfirmationModif = () => {
    setConfirmationContainer(!confirmationContainer)
    deletePhoto()
  }

  function resetFeedBack() {
    setTimeout(() => {
      setModifAuthorize('')
      setCallBackMessage('')
      setMessageFecth('')
    }, 6000)
  }

  useEffect(() => {
    if (!newModif) {
      if (
        imageURL !== '' &&
        imageURL !== undefined &&
        imageURL !== null &&
        newModif === false
      ) {
        setDeleteButton(true)
        setImagePreview(imageURL)
      }
    }

    if (newModif) {
      async function fetchImage() {
        if (selectedImage) {
          setLoading(true)
          
          const formData = new FormData()
          formData.append('image', selectedImage)
          formData.append('nomDeLaPropiete', `_medias.image_galerie_${index}`)
          formData.append('reference', reference)
          
          try {
            const tokenLog = Cookies.get('_marli_tk_log')
            const response = await fetch(
              `${process.env.REACT_APP_API_URL}/bien/update-image-unique`,
              {
                method: 'PUT',
                headers: {
                  Authorization: `Bearer ${tokenLog}`,
                },
                body: formData,
              },
            )
            if (response.ok) {
              setTimeout(async () => {
                const result = await response.json()
                setImagePreview(result.result)
                setLoading(false)
                setDeleteButton(true)
                setNewModif(false)
                setModifAuthorize(true)
                setCallBackMessage('flex')
                setMessageFecth('Image modifiée avec succès.')
                resetFeedBack()
              }, 1000)
            } else {
              setTimeout(() => {
                setLoading(false)
                setModifAuthorize('error')
                setCallBackMessage('flex')
                setMessageFecth("Oups, une erreur s'est produite, veuillez réessayer plustard.")
                resetFeedBack()
              }, 1000)
            }
          } catch (error) {
            setLoading(false)
            setModifAuthorize('error')
            setCallBackMessage('flex')
            setMessageFecth("Oups, une erreur s'est produite, veuillez réessayer plustard.")
            console.error('Erreur lors de la requête fetch :', error)
            resetFeedBack()
          }
        }
      }
      fetchImage()
    }
  }, [selectedImage, imageURL, newModif, index, reference, bienData])

  const handleImageChange = async (e) => {
    const selectedFile = e.target.files[0]
    const tailleMaxAutorisee = 5 * 1024 * 1024

    if (selectedFile) {
      const allowedFormats = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp', 'image/svg+xml']

      if (allowedFormats.includes(selectedFile.type) && selectedFile.size <= tailleMaxAutorisee) {
        const reader = new FileReader()
        reader.onload = () => {
          setSelectedImage(selectedFile)
          setImagePreview(reader.result)
        }
        reader.readAsDataURL(selectedFile)
        setNewModif(true)
        resetFeedBack()
      } else {
        setModifAuthorize('error')
        setCallBackMessage('flex')
        setMessageFecth('Erreur, vérifier le format et la taille de votre image et réessayer.')
        e.target.value = ''
        resetFeedBack()
      }
    }
  }

  const deletePhoto = async () => {
    resetFeedBack()
    setLoading(true)
    try {
      const tokenLog = Cookies.get('_marli_tk_log')
      const response = await fetch(
        `${process.env.REACT_APP_API_URL}/bien/medias/${imageURL ? imageURL : imagePreview.split(`${process.env.REACT_APP_URL_BASE_IMAGE}`)[1]}?index=${index}&ref=${reference}`,
        {
          method: 'DELETE',
          headers: {
            Authorization: `Bearer ${tokenLog}`,
          },
        },
      )
      if (response.ok) {
        setTimeout(() => {
          setLoading(false)
          setSelectedImage(null)
          setImagePreview(null)
          setDeleteButton(false)
          setModifAuthorize(true)
          setCallBackMessage('flex')
          setMessageFecth('Image supprimée avec succès.')
          resetFeedBack()
        }, 1000)
      } else {
        setTimeout(() => {
          setLoading(false)
          setModifAuthorize('error')
          setCallBackMessage('flex')
          setMessageFecth("Oups, une erreur s'est produite, veuillez réessayer plustard.")
          resetFeedBack()
        }, 1000)
      }
    } catch (error) {
      setLoading(false)
      setModifAuthorize('error')
      setCallBackMessage('flex')
      setMessageFecth("Oups, une erreur s'est produite, veuillez réessayer plustard.")
      console.error('Erreur lors de la requête fetch :', error)
      resetFeedBack()
    }
  }

  return (
    <>
      <div className={styles.allContainer}>
        {loading ? <GifLoading positionDiv='absolute' /> : null}
        <form encType='multipart/form-data'>
          <div>
            {imagePreview && <img src={imagePreview} alt='Aperçu galerie' />}
          </div>
          <label htmlFor={`imageGalerie${index}`}>
            {!deleteButton && (
              <FontAwesomeIcon
                className={styles.faCamera}
                icon={faCamera}
                title="Modifier l'image"
              />
            )}
          </label>
          {deleteButton ? (
            <FontAwesomeIcon
              onClick={ShowConfirmationContainer}
              className={styles.faXmark}
              icon={faXmarkCircle}
              title="Supprimer l'image"
            />
          ) : ''}
          <input
            id={`imageGalerie${index}`}
            type='file'
            name='photo'
            accept='.jpg, .jpeg, .png, .webp, .svg'
            onChange={handleImageChange}
            required
          />
        </form>
      </div>
      <NotifFeedBackFecth
        modifAuthorizeValue={modifAuthorize}
        callBackMessageValue={callBackMessage}
        messageFecthValue={messageFecth}
      />
      {confirmationContainer && (
        <ConfirmationRequired
          contexte='Attention ! La suppression de cette image sera definitive, confirmez-vous sa suppression ?'
          confirmation={ConfirmationModif}
          reset={ShowConfirmationContainer}
        />
      )}
    </>
  )
}

export default UpdateImageBien
