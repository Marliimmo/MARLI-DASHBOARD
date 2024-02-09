import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import Cookies from 'js-cookie'
import { Helmet } from 'react-helmet'

import styles from './connexion.module.scss'
import NotifFeedBackFecth from '../../components/NotifFeedBackFecth/NotifFeedBackFecth'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faEye, faEyeSlash } from '@fortawesome/free-solid-svg-icons'

function Connexion() {
  const [loading, setLoading] = useState('')
  const [modifAuthorize, setModifAuthorize] = useState('')
  const [messageFecth, setMessageFecth] = useState('')
  const [callBackMessage, setCallBackMessage] = useState('')
  const [visibilityPassword, setVisibilityPassword] = useState(false)

  const [formData, setFormData] = useState({
    pseudo: '',
    password: '',
  })
  const navigate = useNavigate()

  const handleVisibilityPassword = () => {
    setVisibilityPassword(!visibilityPassword)
  }

  // pour eviter un espace vide dans un champs
  const handleKeyDown = (e) => {
    if (e.key === ' ') {
      e.preventDefault()
    }
  }

  const handleInputChange = (e) => {
    const { name, value } = e.target
    setFormData({ ...formData, [name]: value })

    setModifAuthorize('')
    setCallBackMessage('')
    setMessageFecth('')
  }

  const handleSubmit = async (e) => {
    setLoading('connexion')
    e.preventDefault()
    try {
      const response = await fetch(
        `${process.env.REACT_APP_API_URL}/user/login`,
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(formData),
        },
      )
      if (response.ok) {
        setTimeout(async () => {
          setLoading('')
          const user = await response.json()
          Cookies.set('_marli_tk_log', user.token, {
            expires: 1,
            sameSite: 'Strict',
          })
          navigate(`/dashboard/tous-les-biens`)
        }, 1000)
      } else {
        setTimeout(async () => {
          setLoading('')
          setModifAuthorize('error')
          setCallBackMessage('flex')
          setMessageFecth('Utilisateur ou mot de passe incorrect !')
        }, 1000)
      }
    } catch (error) {
      setLoading('')
      console.error('Erreur lors de la requête fetch :', error)
    }
  }

  useEffect(() => {
    Cookies.set('_marli_tk_log', 'defaut', { expires: 1, sameSite: 'Strict' })
  }, [])

  return (
    <>
      <Helmet>
        <title>Connexion</title>
        <meta name='robots' content='noindex' />
      </Helmet>
      <div className={`fadinAnimation ${styles.allContainer}`}>
        <h2>Se connecter</h2>
        <p>Entrez vos informations de connexion dans les champs ci-dessous.</p>

        <form onSubmit={handleSubmit}>
          <input
            name='pseudo'
            type='text'
            placeholder='Votre pseudo'
            required
            onChange={handleInputChange}
            onKeyDown={handleKeyDown}
          />
          <br />

          <div className={styles.passwordInput}>
            <input
              name='password'
              minLength={6}
              type={visibilityPassword ? 'text' : 'password'}
              placeholder='Mot de passe* (6 crtès minimum)'
              required
              onChange={handleInputChange}
            />
            <div>
              {visibilityPassword ? (
                <FontAwesomeIcon
                  onClick={handleVisibilityPassword}
                  icon={faEyeSlash}
                />
              ) : (
                <FontAwesomeIcon
                  onClick={handleVisibilityPassword}
                  icon={faEye}
                />
              )}
            </div>
          </div>
          <br />
          <button type='submit'>
            {loading === 'connexion' ? 'Connexion encours...' : 'Se connecter'}
          </button>
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

export default Connexion
