import React, { useState, useEffect } from 'react'
import styles from './DragDropImages.module.scss'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faCamera, faXmarkCircle, faGripVertical, faSave } from '@fortawesome/free-solid-svg-icons'
import Cookies from 'js-cookie'
import NotifFeedBackFecth from '../NotifFeedBackFecth/NotifFeedBackFecth'
import GifLoading from '../GifLoading/GifLoading'
import ConfirmationRequired from '../ConfirmationRequired/ConfirmationRequired'

const DragDropImages = ({ modifAuthorizeValue, callBackMessageValue, messageFecthValue, onUpdate }) => {
  const [confirmationContainer, setConfirmationContainer] = useState(false)
  const [modifAuthorize, setModifAuthorize] = useState(modifAuthorizeValue)
  const [callBackMessage, setCallBackMessage] = useState(callBackMessageValue)
  const [messageFecth, setMessageFecth] = useState(messageFecthValue)

  const confirmDelete = () => {
    // logique suppression
  }

  return (
    <>
      <NotifFeedBackFecth
        modifAuthorizeValue={modifAuthorize}
        callBackMessageValue={callBackMessage}
        messageFecthValue={messageFecth}
      />

      {confirmationContainer && (
        <ConfirmationRequired
          contexte="Attention ! La suppression de cette image sera définitive."
          confirmation={confirmDelete}
          reset={() => setConfirmationContainer(false)}
        />
      )}
    </>
  )
}

export default DragDropImages
