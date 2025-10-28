import styles from './LeftMenu.module.scss'
import { Link, NavLink, useNavigate } from 'react-router-dom'
import Logo from '../../assets/images/marli-logo.png'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import {
  faChartSimple,
  faHome,
  faRightFromBracket,
  faSearch,
  faStar,
} from '@fortawesome/free-solid-svg-icons'
import { useState } from 'react'
import Cookies from 'js-cookie'
import ConfirmationRequired from '../ConfirmationRequired/ConfirmationRequired'
import ComponentAuthRequired from '../../middlewares/ComponentAuthRequired/ComponentAuthRequired'

function LeftMenu() {
  const [confirmationContainer, setConfirmationContainer] = useState(false)

  const navigate = useNavigate()
  const deconnexion = () => {
    setConfirmationContainer(!confirmationContainer)
    const cookieerzaconnect = Cookies.get()
    for (const nameCookie in cookieerzaconnect) {
      if (nameCookie.startsWith('_marli')) {
        Cookies.remove(nameCookie)
      }
    }
    navigate('/dashboard/connexion')
  }

  return (
    <>
      <ComponentAuthRequired valueDefault={null}>
        <div className={`p-20 ${styles.full_container}`}>
          {/* logo  */}
          <div className='w_sp_800'>
            <Link to='/'>
              <div className={styles.imageLogo}>
                <img src={Logo} alt='Logo' />
                <p>PASSEUR D'HISTOIRES IMMOBILIERES</p>
              </div>
            </Link>
          </div>

          <div
            className={`d-flex justify-content-spacebetween align-items-center w_inf_800 ${styles.menuSuperieur}`}
          >
            <p>Menu</p>
          </div>

          {/* link Menu */}
          <div>
            <NavLink
              className={({ isActive }) =>
                isActive ? `link_active` : 'link_menu'
              }
              to='/'
            >
              <div>
                <FontAwesomeIcon icon={faChartSimple} />
                <span className={styles.menuTitle}>Dashboard</span>
              </div>
            </NavLink>

            <NavLink
              className={({ isActive }) =>
                isActive ? `link_active` : 'link_menu'
              }
              to='/tous-les-biens/'
            >
              <div>
                <FontAwesomeIcon icon={faHome} />
                <span className={styles.menuTitle}>Tous les biens</span>
              </div>
            </NavLink>

            <NavLink
              className={({ isActive }) =>
                isActive ? `link_active` : 'link_menu'
              }
              to='/avis-de-recherche/'
            >
              <div>
                <FontAwesomeIcon icon={faSearch} />
                <span className={styles.menuTitle}>Avis de recherche</span>
              </div>
            </NavLink>

            <NavLink
              className={({ isActive }) =>
                isActive ? `link_active` : 'link_menu'
              }
              to='/avis-client/'
            >
              <div>
                <FontAwesomeIcon icon={faStar} />
                <span className={styles.menuTitle}>Avis clients</span>
              </div>
            </NavLink>

            {/* <NavLink className={({ isActive }) => (isActive ? `link_active` : 'link_menu')} to="/dashboard/users">
              <div>
                <FontAwesomeIcon icon={faUsers}/>
                <span className={styles.menuTitle}>Utilisateurs</span>
              </div>
            </NavLink>
            
            <NavLink className={({ isActive }) => (isActive ? `link_active` : 'link_menu')} to="/dashboard/projects">
              <div>
                <FontAwesomeIcon icon={faBriefcase}/>
                <span className={styles.menuTitle}>Projets</span>
              </div>
            </NavLink> */}
          </div>

          {/* deconnexion */}
          <div
            onClick={() => {
              setConfirmationContainer(!confirmationContainer)
            }}
            className={styles.containerLogOut}
          >
            <div className={`${styles.logOut_link_mobile}`}>
              <Link to='#'>
                <FontAwesomeIcon icon={faRightFromBracket} />
                <span className={styles.menuTitle}>Déconnexion</span>
              </Link>
            </div>
          </div>
        </div>
      </ComponentAuthRequired>

      {confirmationContainer && (
        <ConfirmationRequired
          contexte='Confirmez-vous vouloir vous deconnecter ?'
          confirmation={deconnexion}
          reset={() => setConfirmationContainer(!confirmationContainer)}
        />
      )}
    </>
  )
}

export default LeftMenu
