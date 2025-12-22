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
import MesArticles from './pages/MesArticles/MesArticles' // ✅ NOUVEAU
import GererArticle from './pages/GererArticle/GererArticle' // ✅ NOUVEAU
// middlewares de vérification
import AuthRequired from './middlewares/AuthRequired/AuthRequired'
import VerifLogActif from './middlewares/VerifLogActif/VerifLogActif'
// page d'erreur
import NotFound from './not-found'

export const router = createBrowserRouter([
  {
    path: '/',
    element: <App />,
    children: [
      {
        path: '/*',
        caseSensitive: true,
        element: <NotFound />,
      },
      {
        path: '/',
        element: (
          <AuthRequired>
            <Dashboard />
          </AuthRequired>
        ),
      },
      {
        path: '/tous-les-biens',
        element: (
          <AuthRequired>
            <TousLesBiens />
          </AuthRequired>
        ),
      },
      {
        path: '/creer-un-bien',
        element: (
          <AuthRequired>
            <CreateBien />
          </AuthRequired>
        ),
      },
      {
        path: '/modifier-un-bien/:reference',
        element: (
          <AuthRequired>
            <ModifierUnBien />
          </AuthRequired>
        ),
      },
      {
        path: '/avis-client',
        element: (
          <AuthRequired>
            <AvisUser />
          </AuthRequired>
        ),
      },
      {
        path: '/avis-de-recherche',
        element: (
          <AuthRequired>
            <AvisDrecherche />
          </AuthRequired>
        ),
      },
      // ✅ NOUVELLES ROUTES ARTICLES
      {
        path: '/mes-articles',
        element: (
          <AuthRequired>
            <MesArticles />
          </AuthRequired>
        ),
      },
      {
        path: '/gerer-article',
        element: (
          <AuthRequired>
            <GererArticle />
          </AuthRequired>
        ),
      },
      {
        path: '/gerer-article/:id',
        element: (
          <AuthRequired>
            <GererArticle />
          </AuthRequired>
        ),
      },
      // FIN NOUVELLES ROUTES
      {
        path: '/connexion',
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
