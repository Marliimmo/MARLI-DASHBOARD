import React from 'react'
import styles from './ConfirmationRequired.module.scss'

function ConfirmationRequired({ contexte, confirmation, reset, loading }) {
  return (
    <>
      <div className={styles.container}>
        <div className={styles.contentContainer}>
          <div className={styles.content}>
            <div>
              <h3>Voulez-vous continuer ?</h3>
              <p>{contexte}</p>
              <div className={styles.buttonContainer}>
                <button onClick={confirmation}>
                  {loading ? 'Veuillez patienter...' : 'Confirmer'}
                </button>
                <button onClick={reset}>Annuler</button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}

export default ConfirmationRequired
