import { useEffect } from 'react';
import { Outlet } from 'react-router-dom';
import LoadingAllSite from './components/LoadingAllSite/LoadingAllSite';
import ScrollToTop from './components/ScrollToTop/ScrollToTop';
import LeftMenu from './components/LeftMenu/LeftMenu';
import CookieConsent from './components/CookieConsent/CookieConsent';
function App() {
  useEffect(()=>{
    window.scrollTo(0, 0);
  }, [])

  return (
    <>
      <ScrollToTop />
return (
  <>
    <ScrollToTop />
    <CookieConsent />
    <LoadingAllSite />
    <div style={{minHeight:'70vh'}}>
      <LeftMenu />
      <Outlet />
    </div>
  </>
);
      <LoadingAllSite />
      <div style={{minHeight:'70vh'}}>
        <LeftMenu />
        <Outlet />
      </div>
    </>
    
  )
}

export default App;
