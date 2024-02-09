import React from 'react'
import styles from './CreerUnBien.module.scss'
import FormCreateOrEditBien from '../../components/FormCreateOrEditBien/FormCreateOrEditBien'
import UpdateImageBien from '../../components/UpdateImageBien/UpdateImageBien'
import { useState } from 'react'
import { Helmet } from 'react-helmet'

function CreateOrEditBien() {
  const [successCreate, setSuccessCreate] = useState(false)
  const [reference, setReference] = useState('')

  const HandleSucces = (value) => {
    setSuccessCreate(true)
    setReference(value)
    console.log(value)
  }

  return (
    <>
      <Helmet>
        <title>Créer un bien</title>
        <meta name='robots' content='noindex' />
      </Helmet>
      <div className={styles.allContainer}>
        <h2 className='titlePage'>Ajout d'un nouveau bien</h2>
        <FormCreateOrEditBien successCreate={HandleSucces} context='create' />

        {successCreate && (
          <div className={styles.SectionImage}>
            <h3>Section image</h3>

            <div className={styles.imageContent}>
              <div className={styles.imagePremierePlan}>
                <UpdateImageBien reference={reference} index='0' />
              </div>

              <div className={styles.galerieSection}>
                <div>
                  <UpdateImageBien reference={reference} index='1' />
                </div>
                <div>
                  <UpdateImageBien reference={reference} index='2' />
                </div>
                <div>
                  <UpdateImageBien reference={reference} index='3' />
                </div>
                <div>
                  <UpdateImageBien reference={reference} index='4' />
                </div>
                <div>
                  <UpdateImageBien reference={reference} index='5' />
                </div>
                <div>
                  <UpdateImageBien reference={reference} index='6' />
                </div>
                <div>
                  <UpdateImageBien reference={reference} index='7' />
                </div>
                <div>
                  <UpdateImageBien reference={reference} index='8' />
                </div>
                <div>
                  <UpdateImageBien reference={reference} index='9' />
                </div>
                <div>
                  <UpdateImageBien reference={reference} index='10' />
                </div>
                <div>
                  <UpdateImageBien reference={reference} index='11' />
                </div>
                <div>
                  <UpdateImageBien reference={reference} index='12' />
                </div>
                <div>
                  <UpdateImageBien reference={reference} index='13' />
                </div>
                <div>
                  <UpdateImageBien reference={reference} index='14' />
                </div>
                <div>
                  <UpdateImageBien reference={reference} index='15' />
                </div>
                <div>
                  <UpdateImageBien reference={reference} index='16' />
                </div>
                <div>
                  <UpdateImageBien reference={reference} index='17' />
                </div>
                <div>
                  <UpdateImageBien reference={reference} index='18' />
                </div>
                <div>
                  <UpdateImageBien reference={reference} index='19' />
                </div>
                <div>
                  <UpdateImageBien reference={reference} index='20' />
                </div>
                <div>
                  <UpdateImageBien reference={reference} index='21' />
                </div>
                <div>
                  <UpdateImageBien reference={reference} index='22' />
                </div>
                <div>
                  <UpdateImageBien reference={reference} index='23' />
                </div>
                <div>
                  <UpdateImageBien reference={reference} index='24' />
                </div>
                <div>
                  <UpdateImageBien reference={reference} index='25' />
                </div>
                <div>
                  <UpdateImageBien reference={reference} index='26' />
                </div>
                <div>
                  <UpdateImageBien reference={reference} index='27' />
                </div>
                <div>
                  <UpdateImageBien reference={reference} index='28' />
                </div>
                <div>
                  <UpdateImageBien reference={reference} index='29' />
                </div>
                <div>
                  <UpdateImageBien reference={reference} index='30' />
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </>
  )
}

export default CreateOrEditBien
