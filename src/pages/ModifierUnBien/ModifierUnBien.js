import React from 'react'
import styles from './ModifierUnBien.module.scss'
import FormCreateOrEditBien from '../../components/FormCreateOrEditBien/FormCreateOrEditBien'
import DragDropImages from '../../components/DragDropImages/DragDropImages'
import UpdateVideoBien from '../../components/UpdateVideoBien/UpdateVideoBien'
import { useState, useEffect } from 'react'
import { useParams } from 'react-router-dom'
import { Helmet } from 'react-helmet'

function ModifierUnBien() {
  const { reference } = useParams()
  const [data, setData] = useState([])
  const [reload, setReload] = useState(false)

  useEffect(() => {
    try {
      const fectchData = async () => {
        const response = await fetch(
          `${process.env.REACT_APP_API_URL}/bien/get-one?ref=${reference}`,
        )
        if (response.ok) {
          const result = await response.json()
          console.log('DATA DU BIEN:', result)
          setData(result)
        }
      }
      fectchData()
    } catch (error) {
      console.log('Erreur lors de la requette fecth', error)
    }
  }, [reference, reload])

  return (
    <>
      <Helmet>
        <title>Modifier un bien</title>
        <meta name='robots' content='noindex' />
      </Helmet>
      <div className={styles.allContainer}>
        <h2 className='titlePage'>Modification d'un bien</h2>
        {data.length <= 0 ? (
          <p className={styles.bienNotFound}>Aucun bien non trouvé</p>
        ) : (
          <>
            <FormCreateOrEditBien
              dataBien={data}
              reference={reference}
              context='update'
            />
            <DragDropImages
              bienId={data._id}
              reference={reference}
              onUpdate={() => setReload(!reload)}
            />

            <div className={styles.SectionVideo}>
              <h3>Section vidéo</h3>
              <p className={styles.videoHint}>Vidéo de présentation du bien (facultatif)</p>
              <UpdateVideoBien bienData={data} reference={reference} />
            </div>
          </>
        )}
      </div>
    </>
  )
}

export default ModifierUnBien
