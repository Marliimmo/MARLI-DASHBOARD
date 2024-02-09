import Cookies from 'js-cookie'
import { useEffect, useState } from 'react'

const ComponentAuthRequired = ({ children, valueDefault }) => {
  const token = Cookies.get('_marli_tk_log')
  const tokenLogSucces = Cookies.get('_marli_log_success')
  const tokenLogFailed = Cookies.get('_marli_log_failed')
  const [tokenVerif, setTokenVerif] = useState('')

  useEffect(() => {
    if (token !== undefined && token.length > 50) {
      const fetchLog = async () => {
        try {
          const response = await fetch(
            `${process.env.REACT_APP_API_URL}/user/tk-log`,
            {
              method: 'GET',
              headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${token}`,
              },
            },
          )
          if (response.ok) {
            const res = await response.json()
            Cookies.set('_marli_user_pseudo', res.userPseudo, {
              expires: 1,
              sameSite: 'Strict',
            })
            Cookies.set('_marli_log_success', token, {
              expires: 1,
              sameSite: 'Strict',
            })
            setTokenVerif(true)
          } else {
            Cookies.set('_marli_log_failed', token, {
              expires: 1,
              sameSite: 'Strict',
            })
            setTokenVerif(false)
          }
        } catch (error) {
          setTokenVerif(false)
          console.error('Erreur lors de la requête fetch :', error)
        }
      }
      if (token === tokenLogSucces) {
        setTokenVerif(true)
      } else if (token === tokenLogFailed) {
        setTokenVerif(false)
      } else {
        fetchLog()
      }
    } else {
      setTokenVerif(false)
    }
    // }, [ token ]);
  }, [token, tokenLogSucces, tokenLogFailed])

  return tokenVerif === true
    ? children
    : tokenVerif === false
      ? valueDefault
      : null
}

export default ComponentAuthRequired
