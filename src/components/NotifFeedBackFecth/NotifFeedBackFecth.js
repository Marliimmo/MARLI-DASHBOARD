import { useEffect, useState } from 'react'
import styles from './NotifFeedBackFecth.module.scss'

function NotifFeedBackFecth({
  modifAuthorizeValue,
  callBackMessageValue,
  messageFecthValue,
}) {
  const [modifAuthorize, setModifAuthorize] = useState('')
  const [callBackMessage, setCallBackMessage] = useState('')
  const [messageFecth, setMessageFecth] = useState('')

  const closeMessage = () => {
    setModifAuthorize('')
    setCallBackMessage('')
    setMessageFecth('')
  }

  useEffect(() => {
    setModifAuthorize(modifAuthorizeValue)
    setCallBackMessage(callBackMessageValue)
    setMessageFecth(messageFecthValue)
  }, [modifAuthorizeValue, callBackMessageValue, messageFecthValue])

  return (
    <div className={styles.messageFeedBack}>
      {modifAuthorize === true ? (
        <div
          style={{ display: `${callBackMessage}` }}
          className={styles.messageSucces}
        >
          <div>{messageFecth}</div>
          <p onClick={closeMessage}>X</p>
        </div>
      ) : modifAuthorize === 'error' ? (
        <div
          style={{ display: `${callBackMessage}` }}
          className={styles.messageError}
        >
          <div>{messageFecth}</div>
          <p onClick={closeMessage}>X</p>
        </div>
      ) : null}
    </div>
  )
}

export default NotifFeedBackFecth
