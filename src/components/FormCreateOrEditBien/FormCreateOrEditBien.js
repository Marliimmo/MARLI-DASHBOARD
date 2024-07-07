import React from 'react'
import styles from './FormCreateOrEditBien.module.scss'
import { useState } from 'react'
import Cookies from 'js-cookie'
import NotifFeedBackFecth from '../NotifFeedBackFecth/NotifFeedBackFecth'
import { useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'

function FormCreateOrEditBien({ successCreate, context, dataBien, reference }) {
  const navigate = useNavigate()
  const [title, setTitle] = useState('')
  const [status, setStatus] = useState('non-disponible')
  const [index, setIndex] = useState(0)
  const [histoire, setHistoire] = useState('')
  const [localisation, setLocalisation] = useState('')
  const [prix, setPrix] = useState('')
  const [caracteristique, setCaracteristique] = useState('')
  const [successCreateBien, setSuccessCreateBien] = useState(false)

  const [loading, setLoading] = useState('')
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

  const handleKeyDown = (e) => {
    // Récupérer le code de la touche appuyée
    const keyCode = e.keyCode || e.which

    // Autoriser les touches de direction (codes 37 à 40)
    // Autoriser uniquement les chiffres (codes de 48 à 57) et la touche backspace (code 8)
    if (
      (keyCode < 37 || keyCode > 40) &&
      (keyCode < 48 || keyCode > 57) &&
      keyCode !== 8
    ) {
      e.preventDefault()
    }
  }

  const token = Cookies.get('_marli_tk_log')
  const CreateBien = async (e) => {
    e.preventDefault()
    setLoading('create')
    try {
      const data = JSON.stringify({
        title: title,
        status: status,
        index: index,
        histoire: histoire,
        localisation: localisation,
        prix: prix,
        caracteristiques: caracteristique,
      })

      const response = await fetch(
        `${process.env.REACT_APP_API_URL}/bien/create`,
        {
          method: 'POST',
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
          body: data,
        },
      )

      if (response.ok) {
        const result = await response.json()
        setTimeout(() => {
          setLoading('')
          successCreate(result.ref)
          setSuccessCreateBien(true)
          setModifAuthorize(true)
          setCallBackMessage('flex')
          setMessageFecth('Bien créer avec succès')

          setTimeout(() => {
            navigate(`/dashboard/modifier-un-bien/${result.ref}`)
          }, 1500)

          resetFeedBack()
        }, 1000)
      } else {
        setTimeout(() => {
          setLoading('')
          setModifAuthorize('error')
          setCallBackMessage('flex')
          setMessageFecth("Oups, une erreur s'est produite")

          resetFeedBack()
        }, 1000)
      }
    } catch (error) {
      setLoading('')
      setModifAuthorize('error')
      setCallBackMessage('flex')
      setMessageFecth("Oups, une erreur s'est produite")

      resetFeedBack()
      console.log('Erreur lors de la requette fecth')
    }
  }

  const UpdateBien = async (e) => {
    setLoading('update')
    e.preventDefault()
    try {
      const data = JSON.stringify({
        title: title,
        status: status,
        index: index,
        histoire: histoire,
        localisation: localisation,
        prix: prix,
        caracteristiques: caracteristique,
      })

      const response = await fetch(
        `${process.env.REACT_APP_API_URL}/bien/update?ref=${reference}`,
        {
          method: 'PATCH',
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
          body: data,
        },
      )

      if (response.ok) {
        setTimeout(() => {
          setLoading('')
          setSuccessCreateBien(true)
          setModifAuthorize(true)
          setCallBackMessage('flex')
          setMessageFecth('Mise à jour effectué avec succès')

          resetFeedBack()
        }, 1000)
      } else {
        setTimeout(() => {
          setLoading('')
          setModifAuthorize('error')
          setCallBackMessage('flex')
          setMessageFecth("Oups, une erreur s'est produite")

          resetFeedBack()
        }, 1000)
      }
    } catch (error) {
      setLoading('')
      setModifAuthorize('error')
      setCallBackMessage('flex')
      setMessageFecth("Oups, une erreur s'est produite")

      resetFeedBack()
      console.log('Erreur lors de la requette fecth')
    }
  }

  useEffect(() => {
    if (dataBien) {
      if (dataBien.title) {
        setTitle(dataBien.title)
      }

      if (dataBien.status) {
        setStatus(dataBien.status)
      }

      if (dataBien.index) {
        setIndex(dataBien.index)
      }

      if (dataBien.histoire) {
        setHistoire(dataBien.histoire)
      }

      if (dataBien.localisation) {
        setLocalisation(dataBien.localisation)
      }

      if (dataBien.prix) {
        setPrix(dataBien.prix)
      }

      if (dataBien.caracteristiques) {
        setCaracteristique(dataBien.caracteristiques)
      }
    }
  }, [dataBien])

  return (
    <>
      <div className={styles.allContainer}>
        <form
          onSubmit={
            context === 'create'
              ? CreateBien
              : context === 'update'
                ? UpdateBien
                : null
          }
        >
          <div className={styles.twoElement}>
            <div>
              <label htmlFor='titleBien'>Titre du bien</label>
              <br />
              <input
                onChange={(e) => setTitle(e.target.value)}
                value={title}
                type='text'
                id='titleBien'
                required
              />
              <br />
            </div>

            <div>
              <label htmlFor='statusBien'>Status du bien</label>
              <br />
              <select
                value={status}
                onChange={(e) => setStatus(e.target.value)}
                id='statusBien'
              >
                <option value='non-disponible'>Non disponible</option>
                <option value='disponible'>Disponible</option>
                <option value='sous-compromis'>Sous compromis</option>
                <option value='vendu'>Bien vendu</option>
              </select>
              <br />
            </div>

            <div>
              <label htmlFor='indexBien'>Position du bien</label>
              <br />
              <input
                onChange={(e) => setIndex(e.target.value)}
                value={index}
                type='number'
                id='indexBien'
                style={{ maxWidth: '150px' }}
                min={0}
              />
              <br />
            </div>
          </div>

          <label htmlFor='histoire'>Histoire du bien</label>
          <br />
          <textarea
            onChange={(e) => setHistoire(e.target.value)}
            value={histoire}
            name='histoire'
            id='histoire'
            cols='30'
            rows='10'
            required
          ></textarea>
          <br />

          <div className={styles.twoElement}>
            <div>
              <label htmlFor='localisation'>Localisation</label>
              <br />
              <input
                onChange={(e) => setLocalisation(e.target.value)}
                value={localisation}
                type='text'
                id='localisation'
                required
              />
              <br />
            </div>

            <div>
              <label htmlFor='prix'>Prix (€)</label>
              <br />
              <input
                onKeyDown={handleKeyDown}
                onChange={(e) => setPrix(e.target.value)}
                value={prix}
                type='number'
                id='prix'
                min='1'
                required
              />
              <br />
            </div>
          </div>

          <label htmlFor='caracteristique'>
            Caracteristiques (séparé par des #)
          </label>
          <br />
          <input
            onChange={(e) => setCaracteristique(e.target.value)}
            value={caracteristique}
            type='text'
            id='caracteristique'
            required
          />
          <br />

          {context === 'create' && !successCreateBien && (
            <button type='submit'>
              {loading === 'create' ? 'Veuillez patienter...' : 'Créer le bien'}
            </button>
          )}
          {(context === 'update' || successCreateBien) && (
            <button type='submit'>
              {loading === 'update' ? 'Veuillez patienter...' : 'Mettre à jour'}
            </button>
          )}
          {(context === 'update' || successCreateBien) && (
            <Link
              target='_blank'
              to={`https://choosews.com/marli/bien/${dataBien?.ref ? dataBien?.ref : reference}`}
            >
              <span
                className={styles.seeBien}
                style={{ backgroundColor: 'gray', color: 'white' }}
              >
                {dataBien?.status === 'non-disponible'
                  ? 'Prévisualiser'
                  : 'Voir le bien'}
              </span>
            </Link>
          )}
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

export default FormCreateOrEditBien
