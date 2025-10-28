import { useNavigate } from 'react-router-dom'
import Cookies from 'js-cookie'
import { useEffect, useState } from 'react'

const VerifLogActif = ({ children }) => {
  const navigate = useNavigate()
  const token = Cookies.get('_marli_tk_log')
  const [tokenVerif, setTokenVerif] = useState(true)

  useEffect(() => {
    if (token + '' !== 'undefined') {
      const fetchData = async () => {
        try {
          const response = await fetch(
            `${process.env.REACT_APP_API_URL}/user/tk_log`,
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
            navigate('/tous-les-biens')
          } else {
            setTokenVerif(false)
          }
        } catch (error) {
          setTokenVerif(false)
          console.error('Erreur lors de la requête fetch :', error)
        }
      }
      fetchData()
    } else {
      setTokenVerif(false)
    }
  }, [navigate, token])

  return tokenVerif === false ? children : ''
}

export default VerifLogActif
