import React, { useEffect, useState } from 'react'
import Cookies from 'js-cookie'
import styles from './Messages.module.scss'

// Messages reçus par les formulaires du site (contact, vendre, recherche).
// Ils sont enregistrés même si l'e-mail à l'agence n'a pas pu partir.
const TYPES = { contact: 'Nous contacter', vendre: 'Vendre', recherche: 'Avis de recherche' }

function Messages() {
  const [messages, setMessages] = useState([])
  const [etat, setEtat] = useState('chargement')
  const [filtre, setFiltre] = useState('tous')
  const [reload, setReload] = useState(false)

  const appel = (url, options = {}) =>
    fetch(`${process.env.REACT_APP_API_URL}${url}`, {
      ...options,
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${Cookies.get('_marli_tk_log')}`,
      },
    })

  useEffect(() => {
    appel('/form/messages')
      .then((r) => (r.ok ? r.json() : Promise.reject(r.status)))
      .then((data) => { setMessages(data); setEtat('') })
      .catch(() => setEtat('erreur'))
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [reload])

  const marquer = async (m, lu) => {
    await appel(`/form/messages/${m._id}`, { method: 'PATCH', body: JSON.stringify({ lu }) })
    setReload(!reload)
  }
  const supprimer = async (m) => {
    if (!window.confirm(`Supprimer le message de ${m.name} ?`)) return
    await appel(`/form/messages/${m._id}`, { method: 'DELETE' })
    setReload(!reload)
  }

  const visibles = messages.filter((m) =>
    filtre === 'tous' ? true : filtre === 'non-lus' ? !m.lu : m.type === filtre,
  )
  const nonLus = messages.filter((m) => !m.lu).length
  const date = (d) => new Date(d).toLocaleString('fr-FR', { dateStyle: 'long', timeStyle: 'short' })

  return (
    <div className={styles.container}>
      <h2 className='titlePage'>Messages reçus {nonLus > 0 && <span className={styles.badge}>{nonLus} non lu{nonLus > 1 ? 's' : ''}</span>}</h2>

      <div className={styles.filtres}>
        {[['tous', 'Tous'], ['non-lus', 'Non lus'], ['contact', 'Nous contacter'], ['vendre', 'Vendre'], ['recherche', 'Recherche']].map(([v, l]) => (
          <button key={v} className={filtre === v ? styles.actif : ''} onClick={() => setFiltre(v)}>{l}</button>
        ))}
      </div>

      {etat === 'chargement' && <p className={styles.info}>Chargement…</p>}
      {etat === 'erreur' && <p className={styles.info}>Impossible de charger les messages. Reconnectez-vous puis réessayez.</p>}
      {etat === '' && visibles.length === 0 && <p className={styles.info}>Aucun message.</p>}

      {visibles.map((m) => (
        <div key={m._id} className={`${styles.carte} ${m.lu ? styles.lu : ''}`}>
          <div className={styles.entete}>
            <span className={styles.type}>{TYPES[m.type] || m.type}</span>
            <span className={styles.date}>{date(m.dateAdd)}</span>
            {!m.emailEnvoye && <span className={styles.alerte}>e-mail non reçu : message visible uniquement ici</span>}
          </div>
          <h3>{m.name}</h3>
          <p className={styles.contact}>
            <a href={`mailto:${m.email}`}>{m.email}</a>
            {m.phone && <> · <a href={`tel:${m.phone}`}>{m.phone}</a></>}
          </p>
          <ul className={styles.details}>
            {m.titre && <li>Titre : {m.titre}</li>}
            {m.motif && <li>Motif : {m.motif}</li>}
            {m.localisation && <li>Localisation : {m.localisation}</li>}
            {m.typeBien && <li>Type de bien : {m.typeBien}</li>}
            {m.superficie && <li>Superficie : {m.superficie} m²</li>}
            {m.pieces && <li>Pièces : {m.pieces}</li>}
            {m.budget && <li>Budget : {m.budget} €</li>}
          </ul>
          {m.contenu && <p className={styles.contenu}>{m.contenu}</p>}
          <div className={styles.actions}>
            <button onClick={() => marquer(m, !m.lu)}>{m.lu ? 'Marquer non lu' : 'Marquer comme lu'}</button>
            <a className={styles.repondre} href={`mailto:${m.email}?subject=${encodeURIComponent('Votre demande à Marli Immobilier')}`}>Répondre</a>
            <button className={styles.supprimer} onClick={() => supprimer(m)}>Supprimer</button>
          </div>
        </div>
      ))}
    </div>
  )
}

export default Messages
