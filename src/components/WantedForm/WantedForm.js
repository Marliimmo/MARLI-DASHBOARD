import React, { useState } from 'react'
import styles from './WantedForm.module.scss'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faPen } from '@fortawesome/free-solid-svg-icons'
import Cookies from 'js-cookie'
import NotifFeedBackFecth from '../NotifFeedBackFecth/NotifFeedBackFecth'

function WantedForm({ succesSave }) {
  const [loading, setLoading] = useState('')
  const [selectedImage, setSelectedImage] = useState(null)
  const [imagePreview, setImagePreview] = useState(null)
  const [modifAuthorize, setModifAuthorize] = useState('')
  const [messageFecth, setMessageFecth] = useState('')
  const [callBackMessage, setCallBackMessage] = useState('')

  function resetFeedBack() {
    setTimeout(() => {
      setModifAuthorize('')
      setCallBackMessage('')
      setMessageFecth('')
    }, 6000)
  }

  const handleImageChange = (e) => {
    const selectedFile = e.target.files[0]
    const tailleMaxAutorisee = 5 * 1024 * 1024

    if (selectedFile) {
      const allowedFormats = [
        'image/jpeg',
        'image/jpg',
        'image/png',
        'image/webp',
        'image/svg+xml',
      ]

      if (
        allowedFormats.includes(selectedFile.type) &&
        selectedFile.size <= tailleMaxAutorisee
      ) {
        const reader = new FileReader()
        reader.onload = () => {
          setSelectedImage(selectedFile)
          setImagePreview(reader.result)
        }
        reader.readAsDataURL(selectedFile)
        setModifAuthorize('')
        setCallBackMessage('')
        setMessageFecth('')
      } else {
        setModifAuthorize('error')
        setCallBackMessage('flex')
        setMessageFecth(
          'Erreur, vérifier le format et la taille de votre image et réessayer.',
        )
        e.target.value = ''
        setSelectedImage(null)

        resetFeedBack()
      }
    }
  }

  // Engistrement d'un avis de recherche
  const handleImageSubmit = async (e) => {
    e.preventDefault()
    if (selectedImage) {
      setLoading('editImage')
      const formData = new FormData()
      formData.append('image', selectedImage)
      try {
        const tokenLog = Cookies.get('_marli_tk_log')
        const response = await fetch(
          `${process.env.REACT_APP_API_URL}/bien/wanted-image`,
          {
            method: 'POST',
            headers: {
              Authorization: `Bearer ${tokenLog}`,
            },
            body: formData,
          },
        )
        if (response.ok) {
          setTimeout(async () => {
            setLoading('')
            setImagePreview(null)
            setModifAuthorize(true)
            setCallBackMessage('flex')
            setMessageFecth('Avis enregistré avec succès.')
            setSelectedImage(null)
            succesSave()

            resetFeedBack()
          }, 2000)
        } else {
          setTimeout(() => {
            setLoading('')
            setModifAuthorize('error')
            setCallBackMessage('flex')
            setMessageFecth(
              "Oups, une erreur s'est produite, veuillez réessayer plustard.",
            )

            resetFeedBack()
          }, 2000)
        }
      } catch (error) {
        setLoading('')
        setModifAuthorize('error')
        setCallBackMessage('flex')
        setMessageFecth(
          "Oups, une erreur s'est produite, veuillez réessayer plustard.",
        )
        console.error('Erreur lors de la requête fetch :', error)

        resetFeedBack()
      }
    }
  }

  return (
    <>
      <div className={`fadinAnimation ${styles.allContainer}`}>
        <h3>Entrez une image d'avis de recherche</h3>
        <form encType='multipart/form-data'>
          <label htmlFor='imageWanted'>
            <div>
              {imagePreview && (
                <img
                  src={imagePreview}
                  alt="Aperçu de l'img de l'avis de recherche"
                />
              )}
            </div>
            <FontAwesomeIcon icon={faPen} />
          </label>
          <input
            id='imageWanted'
            type='file'
            name='photo'
            accept='.jpg, .jpeg, .png, .webp, .svg'
            onChange={handleImageChange}
            required
          />

          <div>
            <p>
              <span>Formats :</span> .jpg, .jpeg, .png, .webp, .svg
            </p>
            <p>
              <span>Taille maximum :</span> 5 Mo
            </p>
          </div>

          <div className={styles.button}>
            <div onClick={handleImageSubmit} className={styles.save}>
              {loading === 'editImage' ? 'Enregistrement...' : 'Enregistré'}
            </div>
          </div>
        </form>
      </div>
      <NotifFeedBackFecth
        modifAuthorizeValue={modifAuthorize}
        callBackMessageValue={callBackMessage}
        messageFecthValue={messageFecth}
      />
    </>
  )
}

export default WantedForm
