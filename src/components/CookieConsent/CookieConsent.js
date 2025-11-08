import React, { useState, useEffect } from 'react'
import Cookies from 'js-cookie'
import styles from './CookieConsent.module.scss'

function CookieConsent() {
  const [showBanner, setShowBanner] = useState(false)
  const [showSettings, setShowSettings] = useState(false)
  const [preferences, setPreferences] = useState({
    necessary: true,
    analytics: false,
    marketing: false
  })

  useEffect(() => {
    const consent = Cookies.get('marli_cookie_consent')
    if (!consent) {
      setShowBanner(true)
    } else {
      const saved = JSON.parse(consent)
      setPreferences(saved)
      if (saved.analytics) loadGA4()
    }
  }, [])

  const loadGA4 = () => {
    const GA_ID = 'G-S23DTRN7LY'
    const script1 = document.createElement('script')
    script1.async = true
    script1.src = `https://www.googletagmanager.com/gtag/js?id=${GA_ID}`
    document.head.appendChild(script1)
    window.dataLayer = window.dataLayer || []
    function gtag(){window.dataLayer.push(arguments)}
    gtag('js', new Date())
    gtag('config', GA_ID)
  }

  const acceptAll = () => {
    const prefs = { necessary: true, analytics: true, marketing: true }
    setPreferences(prefs)
    Cookies.set('marli_cookie_consent', JSON.stringify(prefs), { expires: 365 })
    loadGA4()
    setShowBanner(false)
  }

  const acceptNecessary = () => {
    const prefs = { necessary: true, analytics: false, marketing: false }
    setPreferences(prefs)
    Cookies.set('marli_cookie_consent', JSON.stringify(prefs), { expires: 365 })
    setShowBanner(false)
  }

  const savePreferences = () => {
    Cookies.set('marli_cookie_consent', JSON.stringify(preferences), { expires: 365 })
    if (preferences.analytics) loadGA4()
    setShowBanner(false)
    setShowSettings(false)
  }

  if (!showBanner) return null

  return (
    <div className={styles.overlay}>
      <div className={styles.banner}>
        <h3>🍪 Gestion des cookies</h3>
        {!showSettings ? (
          <>
            <p>Nous utilisons des cookies pour améliorer votre expérience et analyser le trafic de notre site.</p>
            <div className={styles.buttons}>
              <button onClick={acceptAll} className={styles.btnAccept}>Tout accepter</button>
              <button onClick={acceptNecessary} className={styles.btnNecessary}>Cookies nécessaires uniquement</button>
              <button onClick={() => setShowSettings(true)} className={styles.btnSettings}>Personnaliser</button>
            </div>
          </>
        ) : (
          <>
            <div className={styles.settings}>
              <div className={styles.option}>
                <input type="checkbox" checked disabled />
                <div><strong>Cookies nécessaires</strong><p>Indispensables au fonctionnement</p></div>
              </div>
              <div className={styles.option}>
                <input type="checkbox" checked={preferences.analytics} onChange={(e) => setPreferences({...preferences, analytics: e.target.checked})} />
                <div><strong>Cookies analytiques</strong><p>Google Analytics pour comprendre l'utilisation</p></div>
              </div>
              <div className={styles.option}>
                <input type="checkbox" checked={preferences.marketing} onChange={(e) => setPreferences({...preferences, marketing: e.target.checked})} />
                <div><strong>Cookies marketing</strong><p>Personnalisation des publicités</p></div>
              </div>
            </div>
            <div className={styles.buttons}>
              <button onClick={savePreferences} className={styles.btnAccept}>Enregistrer</button>
              <button onClick={() => setShowSettings(false)} className={styles.btnCancel}>Retour</button>
            </div>
          </>
        )}
      </div>
    </div>
  )
}

export default CookieConsent