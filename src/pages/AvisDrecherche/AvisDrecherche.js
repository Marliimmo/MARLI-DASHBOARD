import React, { useEffect, useState } from 'react'
import styles from './AvisDrecherche.module.scss'
import WantedForm from '../../components/WantedForm/WantedForm'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faXmarkCircle } from '@fortawesome/free-solid-svg-icons'
import Cookies from 'js-cookie'
import NotifFeedBackFecth from '../../components/NotifFeedBackFecth/NotifFeedBackFecth'
import GifLoading from '../../components/GifLoading/GifLoading'

function AvisDrecherche() {
  const [wanteds, setWanteds] = useState([])
  const [succesSave, setSuccesSave] = useState(false)
  const [modifAuthorize, setModifAuthorize] = useState('')
  const [messageFecth, setMessageFecth] = useState('')
  const [callBackMessage, setCallBackMessage] = useState('')
  const [loading, setLoading] = useState('')

  function resetFeedBack() {
    setTimeout(() => {
      setModifAuthorize('')
      setCallBackMessage('')
      setMessageFecth('')
    }, 6000)
  }

  const handleSuccesSave = () => {
    setSuccesSave(!succesSave)
  }

  const deleteWanted = async (key, id) => {
    const token = Cookies.get('_marli_tk_log')
    setLoading(id)
    try {
      const response = await fetch(
        `${process.env.REACT_APP_API_URL}/bien/delete-wanted?key=${key.split('imagesWanted/')[1]}&id=${id}`,
        {
          method: 'DELETE',
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        },
      )
      if (response.ok) {
        setTimeout(async () => {
          setLoading('')
          setModifAuthorize(true)
          setCallBackMessage('flex')
          setMessageFecth('Avis de recherche supprimé avec succès.')
          handleSuccesSave()

          resetFeedBack()
        }, 2000)
      } else {
        setTimeout(async () => {
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

      resetFeedBack()
      console.log('Erreur lors de la requette fecth', error)
    }
  }

  useEffect(() => {
    try {
      const fecthWanteds = async () => {
        const response = await fetch(
          `${process.env.REACT_APP_API_URL}/bien/get-wanteds`,
        )
        if (response.ok) {
          const result = await response.json()
          setWanteds(result)
        }
      }
      fecthWanteds()
    } catch (error) {
      console.log('Erreur serveur', error)
    }
  }, [succesSave])

  return (
    <div className={styles.allContainer}>
      <h2 className='titlePage'>Tous les avis de recherche</h2>
      <div className={styles.bodyContainer}>
        <div>
          <WantedForm succesSave={handleSuccesSave} />
        </div>

        <div className={styles.allWanted}>
          {wanteds.length > 0 ? (
            wanteds.map((wanted) => (
              <div key={wanted._id} className={styles.onWanted}>
                {loading === wanted._id && (
                  <GifLoading positionDiv='absolute' />
                )}
                <FontAwesomeIcon
                  icon={faXmarkCircle}
                  onClick={() => deleteWanted(wanted.urlImage, wanted._id)}
                />
                <img
                  src={`${process.env.REACT_APP_API_URL}/${wanted.urlImage}`}
                  alt='imag-avis'
                />
              </div>
            ))
          ) : (
            <div className={styles.notFoundWanted}>
              Aucun avis de recherche trouvé
            </div>
          )}
        </div>
      </div>
      <NotifFeedBackFecth
        modifAuthorizeValue={modifAuthorize}
        callBackMessageValue={callBackMessage}
        messageFecthValue={messageFecth}
      />
    </div>
  )
}

export default AvisDrecherche
