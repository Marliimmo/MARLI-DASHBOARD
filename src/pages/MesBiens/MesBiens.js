import styles from './MesBiens.module.scss'
import { useEffect, useMemo, useState } from 'react'
import Cookies from 'js-cookie'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faPlus, faSearch } from '@fortawesome/free-solid-svg-icons'
import GifLoading from '../../components/GifLoading/GifLoading'
// import { useNavigate } from 'react-router-dom'
import { Link } from 'react-router-dom'
import { Helmet } from 'react-helmet'
import CardBien from '../../components/CardBien/CardBien'

function Biens() {
  // const navigate = useNavigate()
  const [data, setData] = useState([])
  const [page, setPage] = useState(1)
  const [pageSize] = useState(6)
  const [loading, setLoading] = useState('fecthLoad')
  const [hasMore, setHasMore] = useState(false)
  const [reload, setReload] = useState(false)
  const [fecthUrl, setFecthUrl] = useState(
    `${process.env.REACT_APP_API_URL}/bien/all-biens?getAdmin=true&page=1&pageSize=6`,
  )

  // les constante pour gerer la recherche et filtre des biens
  const [bienSearch, setBienSearch] = useState('')

  // Filtre par nom d'bien
  const bienSearchFunction = (e) => {
    if (e.target.value !== '' && e.target.value !== null) {
      setBienSearch(`&bienId=${e.target.value}`)
    } else {
      setBienSearch('')
    }
    setPage(1)
  }
  //

  // function de création du lien de la requette de recherche ou filtre
  const NewUrlFecth = (e) => {
    e.preventDefault()
    setLoading('filtre')
    let newUrl = `${process.env.REACT_APP_API_URL}/bien/all-biens?getAdmin=true`
    if (bienSearch !== '') {
      newUrl = `${newUrl}${bienSearch}`
    }

    setTimeout(() => {
      setLoading('')
      setFecthUrl(`${newUrl}&page=1&pageSize=6`)
      setPage(1)
    }, 1000)
  }
  //

  // La fonction pour faire un fecth en recupérant des user en paginant la reponse.
  const loadMoreData = async () => {
    setLoading('seeMore')

    try {
      const response = await fetch(
        `${fecthUrl.split('&page')[0]}&page=${page + 1}&pageSize=${pageSize}`,
        resquestOptions,
      )
      if (!response.ok) {
        throw new Error(`Erreur HTTP : ${response.status}`)
      }
      const result = await response.json()
      setTimeout(() => {
        const { biens, hasMore } = result
        setData([...data, ...biens])
        setHasMore(hasMore)
        setPage(page + 1)
        setLoading('')
      }, 1000)
    } catch (error) {
      setLoading('')
      console.log('error lors de la requette fecth', error)
    }
  }

  // On englobe resquestOptions dans useMemo pour eviter de le recalculer si tokenLog ne change pas
  const tokenLog = Cookies.get('_marli_tk_log')
  const resquestOptions = useMemo(
    () => ({
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${tokenLog}`,
      },
    }),
    [tokenLog],
  )

  // Le premier rendu de la pagination
  useEffect(() => {
    setLoading('fecthLoad')
    const fetchInitialData = async () => {
      try {
        const response = await fetch(fecthUrl, resquestOptions)
        if (!response.ok) {
          setLoading('')
          throw new Error(`Erreur HTTP : ${response.status}`)
        }
        const result = await response.json()
        const { biens, hasMore } = result
        setData(biens)
        setHasMore(hasMore)
        setLoading('')
      } catch (error) {
        setLoading('')
        console.log('error lors de la requette fecth', error)
      }
    }

    fetchInitialData()
  }, [resquestOptions, fecthUrl, reload])

  return (
    <>
      <Helmet>
        <title>Tous les biens</title>
        <meta name='robots' content='noindex' />
      </Helmet>
      {loading === 'filtre' || loading === 'fecthLoad' ? (
        <GifLoading positionDiv='fixed' />
      ) : null}
      <h2 className='titlePage'>Tous les biens</h2>
      <div className={`${styles.allContainer}`}>
        {/* input de recherhe  */}
        <div className={styles.searhEfilterContainer}>
          <form onSubmit={NewUrlFecth} className={styles.containerSearch}>
            <div className={styles.champSearchBien}>
              <label htmlFor='searchBien'>
                <FontAwesomeIcon icon={faSearch} />
              </label>
              <input
                onChange={bienSearchFunction}
                id='searchBien'
                type='text'
                placeholder='ref du bien...'
              />
            </div>
            <button type='submit' className={styles.btnSubmitSearch}>
              <FontAwesomeIcon icon={faSearch} />
            </button>
          </form>

          <Link to='/creer-un-bien'>
            <button className={styles.btnAdd}>
              <p>Ajouter un bien</p>
              <FontAwesomeIcon icon={faPlus} />
            </button>
          </Link>
        </div>

        {/* liste des biens  */}
        {loading === 'fecthLoad' ? null : (
          <>
            <div className={styles.cardContainer}>
              {data.map((bien) => (
                <div key={bien?._id}>
                  <CardBien
                    imgUrl={bien?._medias?.image_galerie_0?.url}
                    prix={bien?.prix}
                    localisation={bien?.localisation}
                    caracteristique={bien?.caracteristiques}
                    title={bien?.title}
                    status={bien?.status}
                    index={bien?.index}
                    reference={bien?.ref}
                    reload={() => setReload(!reload)}
                  />

                  {/* <div className={styles.btnEditSeeOrClose}>
                    <Link to={`/dashboard/modifier-un-bien/${bien?.ref}`}>
                      <button
                        className={styles.btnEditBien}
                        onClick={(e) => {
                          e.preventDefault()
                          navigate(`/dashboard/modifier-un-bien/${bien?.ref}`)
                        }}
                      >
                        Modifiier le bien
                      </button>
                    </Link>

                    <Link
                      to={`https://erzaconnect.com/erzaconnect/bien/${bien?._id}`}
                    >
                      <button
                        className={styles.btnSeeBien}
                        onClick={(e) => {
                          e.preventDefault()
                          window.location.href = `https://erzaconnect.com/erzaconnect/bien/${bien?._id}`
                        }}
                      >
                        Voir le bien
                      </button>
                    </Link>
                  </div> */}
                </div>
              ))}
              {loading === 'fecthLoad' ? null : data.length > 0 ? null : (
                <div className={styles.notFoundBien}>Aucun bien trouver</div>
              )}
            </div>

            {hasMore && (
              <div className={styles.showMoreContainer}>
                <button onClick={loadMoreData}>
                  {loading === 'seeMore' ? 'Chargement...' : 'Afficher plus'}
                </button>
              </div>
            )}
          </>
        )}
      </div>
    </>
  )
}

export default Biens
