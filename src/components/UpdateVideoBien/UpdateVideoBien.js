import styles from './UpdateVideoBien.module.scss'
import React, { useEffect, useState } from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faVideo } from '@fortawesome/free-solid-svg-icons'
import { faXmarkCircle } from '@fortawesome/free-solid-svg-icons'
import Cookies from 'js-cookie'
import NotifFeedBackFecth from '../NotifFeedBackFecth/NotifFeedBackFecth'
import GifLoading from '../GifLoading/GifLoading'
import ConfirmationRequired from '../ConfirmationRequired/ConfirmationRequired'

// Composant équivalent à UpdateImageBien, mais pour la vidéo de présentation unique du bien.
// Stockée côté backend dans _medias.video_bien (au lieu de _medias.image_galerie_N).
function UpdateVideoBien({ bienData, reference }) {
  const [loading, setLoading] = useState(false)
  const [selectedVideo, setSelectedVideo] = useState(null)
  const [videoPreview, setVideoPreview] = useState(null)
  const [deleteButton, setDeleteButton] = useState(false)
  const [newModif, setNewModif] = useState(false)
  const [modifAuthorize, setModifAuthorize] = useState('')
  const [messageFecth, setMessageFecth] = useState('')
  const [callBackMessage, setCallBackMessage] = useState('')
  let videoURL = bienData?._medias?.video_bien?.url

  const [confirmationContainer, setConfirmationContainer] = useState(false)

  const ShowConfirmationContainer = (e) => {
    e.preventDefault()
    setConfirmationContainer(!confirmationContainer)
  }
  const ConfirmationModif = () => {
    setConfirmationContainer(!confirmationContainer)
    deleteVideo()
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
        videoURL !== '' &&
        videoURL !== undefined &&
        videoURL !== null &&
        newModif === false
      ) {
        setDeleteButton(true)
        setVideoPreview(videoURL)
      }
    }

    if (newModif) {
      async function fetchVideo() {
        if (selectedVideo) {
          setLoading(true)

          const formData = new FormData()
          formData.append('image', selectedVideo) // même champ que pour les images, le backend accepte tout type de fichier
          formData.append('nomDeLaPropiete', '_medias.video_bien')
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
                setVideoPreview(result.result)
                setLoading(false)
                setDeleteButton(true)
                setNewModif(false)
                setModifAuthorize(true)
                setCallBackMessage('flex')
                setMessageFecth('Vidéo modifiée avec succès.')
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
      fetchVideo()
    }
  }, [selectedVideo, videoURL, newModif, reference, bienData])

  const handleVideoChange = async (e) => {
    const selectedFile = e.target.files[0]
    const tailleMaxAutorisee = 100 * 1024 * 1024 // 100 Mo (limite Cloudinary en compte gratuit)

    if (selectedFile) {
      const allowedFormats = ['video/mp4', 'video/quicktime', 'video/webm']

      if (allowedFormats.includes(selectedFile.type) && selectedFile.size <= tailleMaxAutorisee) {
        setSelectedVideo(selectedFile)
        setVideoPreview(URL.createObjectURL(selectedFile))
        setNewModif(true)
        resetFeedBack()
      } else {
        setModifAuthorize('error')
        setCallBackMessage('flex')
        setMessageFecth(
          'Erreur, vérifiez le format (.mp4, .mov, .webm) et la taille (100 Mo max) de votre vidéo et réessayez.',
        )
        e.target.value = ''
        resetFeedBack()
      }
    }
  }

  const deleteVideo = async () => {
    resetFeedBack()
    setLoading(true)
    try {
      const tokenLog = Cookies.get('_marli_tk_log')
      const response = await fetch(
        `${process.env.REACT_APP_API_URL}/bien/medias/${encodeURIComponent(videoURL || videoPreview)}?field=_medias.video_bien&ref=${reference}`,
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
          setSelectedVideo(null)
          setVideoPreview(null)
          setDeleteButton(false)
          setModifAuthorize(true)
          setCallBackMessage('flex')
          setMessageFecth('Vidéo supprimée avec succès.')
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
            {videoPreview && <video src={videoPreview} controls muted />}
          </div>
          <label htmlFor='videoBien'>
            {!deleteButton && (
              <FontAwesomeIcon
                className={styles.faVideo}
                icon={faVideo}
                title='Ajouter la vidéo de présentation'
              />
            )}
          </label>
          {deleteButton ? (
            <FontAwesomeIcon
              onClick={ShowConfirmationContainer}
              className={styles.faXmark}
              icon={faXmarkCircle}
              title='Supprimer la vidéo'
            />
          ) : (
            ''
          )}
          <input
            id='videoBien'
            type='file'
            name='video'
            accept='.mp4, .mov, .webm'
            onChange={handleVideoChange}
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
          contexte='Attention ! La suppression de cette vidéo sera définitive, confirmez-vous sa suppression ?'
          confirmation={ConfirmationModif}
          reset={ShowConfirmationContainer}
        />
      )}
    </>
  )
}

export default UpdateVideoBien
