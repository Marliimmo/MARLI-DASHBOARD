import { createBrowserRouter } from 'react-router-dom'
import App from './App'

// composants de pages
import TousLesBiens from './pages/MesBiens/MesBiens'
import Connexion from './pages/connexion/connexion'
import CreateBien from './pages/CreerUnBien/CreerUnBien'
import ModifierUnBien from './pages/ModifierUnBien/ModifierUnBien'
import AvisUser from './pages/AvisUser/AvisUser'
import AvisDrecherche from './pages/AvisDrecherche/AvisDrecherche'
import Dashboard from './pages/Dashboard/Dashboard'

// middlewares de vérification
import AuthRequired from './middlewares/AuthRequired/AuthRequired'
import VerifLogActif from './middlewares/VerifLogActif/VerifLogActif'

// page d'erreur
import NotFound from './not-found'

export const router = createBrowserRouter([
  {
    path: '/dashboard/',
    element: <App />,
    children: [
      {
        path: '/dashboard/*',
        caseSensitive: true,
        element: <NotFound />,
      },
      {
        path: '/dashboard/',
        element: (
          <AuthRequired>
            <Dashboard />
          </AuthRequired>
        ),
      },
      {
        path: '/dashboard/tous-les-biens',
        element: (
          <AuthRequired>
            <TousLesBiens />
          </AuthRequired>
        ),
      },
      {
        path: '/dashboard/creer-un-bien',
        element: (
          <AuthRequired>
            <CreateBien />
          </AuthRequired>
        ),
      },
      {
        path: '/dashboard/modifier-un-bien/:reference',
        element: (
          <AuthRequired>
            <ModifierUnBien />
          </AuthRequired>
        ),
      },
      {
        path: '/dashboard/avis-client',
        element: (
          <AuthRequired>
            <AvisUser />
          </AuthRequired>
        ),
      },
      {
        path: '/dashboard/avis-de-recherche',
        element: (
          <AuthRequired>
            <AvisDrecherche />
          </AuthRequired>
        ),
      },
      {
        path: '/dashboard/connexion',
        caseSensitive: true,
        element: (
          <VerifLogActif>
            <Connexion />
          </VerifLogActif>
        ),
      },
    ],
  },
])
