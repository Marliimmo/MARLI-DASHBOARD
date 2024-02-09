import { useNavigate } from 'react-router-dom'
import Cookies from 'js-cookie'
import { useEffect, useState } from 'react'

const AuthRequired = ({ children }) => {
  const navigate = useNavigate()
  const token = Cookies.get('_marli_tk_log')
  const [tokenVerif, setTokenVerif] = useState(false)

  useEffect(() => {
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
          setTokenVerif(true)
        } else {
          navigate('/dashboard/connexion')
          setTokenVerif(false)
        }
      } catch (error) {
        setTokenVerif(false)
        console.error('Erreur lors de la requête fetch :', error)
      }
    }
    fetchLog()
  }, [token, navigate])

  return tokenVerif ? <>{children}</> : null
}

export default AuthRequired
