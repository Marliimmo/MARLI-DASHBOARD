import React from 'react'
import styles from './ModifierUnBien.module.scss'
import FormCreateOrEditBien from '../../components/FormCreateOrEditBien/FormCreateOrEditBien'
import UpdateImageBien from '../../components/UpdateImageBien/UpdateImageBien'
import { useState } from 'react'
import { useParams } from 'react-router-dom'
import { useEffect } from 'react'
import { Helmet } from 'react-helmet'

function ModifierUnBien() {
  const { reference } = useParams()
  const [data, setData] = useState([])

  useEffect(() => {
    try {
      const fectchData = async () => {
        const response = await fetch(
          `${process.env.REACT_APP_API_URL}/bien/get-one?ref=${reference}`,
        )
        if (response.ok) {
          const result = await response.json()
          setData(result)
        }
      }
      fectchData()
    } catch (error) {
      console.log('Erreur lors de la requette fecth', error)
    }
  }, [reference])

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

            <div className={styles.SectionImage}>
              <h3>Section image</h3>

              <div className={styles.imageContent}>
                <div className={styles.imagePremierePlan}>
                  <UpdateImageBien
                    bienData={data}
                    reference={reference}
                    index='0'
                  />
                </div>

                <div className={styles.galerieSection}>
                  <div>
                    <UpdateImageBien
                      bienData={data}
                      reference={reference}
                      index='1'
                    />
                  </div>
                  <div>
                    <UpdateImageBien
                      bienData={data}
                      reference={reference}
                      index='2'
                    />
                  </div>
                  <div>
                    <UpdateImageBien
                      bienData={data}
                      reference={reference}
                      index='3'
                    />
                  </div>
                  <div>
                    <UpdateImageBien
                      bienData={data}
                      reference={reference}
                      index='4'
                    />
                  </div>
                  <div>
                    <UpdateImageBien
                      bienData={data}
                      reference={reference}
                      index='5'
                    />
                  </div>
                  <div>
                    <UpdateImageBien
                      bienData={data}
                      reference={reference}
                      index='6'
                    />
                  </div>
                  <div>
                    <UpdateImageBien
                      bienData={data}
                      reference={reference}
                      index='7'
                    />
                  </div>
                  <div>
                    <UpdateImageBien
                      bienData={data}
                      reference={reference}
                      index='8'
                    />
                  </div>
                  <div>
                    <UpdateImageBien
                      bienData={data}
                      reference={reference}
                      index='9'
                    />
                  </div>
                  <div>
                    <UpdateImageBien
                      bienData={data}
                      reference={reference}
                      index='10'
                    />
                  </div>
                  <div>
                    <UpdateImageBien
                      bienData={data}
                      reference={reference}
                      index='11'
                    />
                  </div>
                  <div>
                    <UpdateImageBien
                      bienData={data}
                      reference={reference}
                      index='12'
                    />
                  </div>
                  <div>
                    <UpdateImageBien
                      bienData={data}
                      reference={reference}
                      index='13'
                    />
                  </div>
                  <div>
                    <UpdateImageBien
                      bienData={data}
                      reference={reference}
                      index='14'
                    />
                  </div>
                  <div>
                    <UpdateImageBien
                      bienData={data}
                      reference={reference}
                      index='15'
                    />
                  </div>
                  <div>
                    <UpdateImageBien
                      bienData={data}
                      reference={reference}
                      index='16'
                    />
                  </div>
                  <div>
                    <UpdateImageBien
                      bienData={data}
                      reference={reference}
                      index='17'
                    />
                  </div>
                  <div>
                    <UpdateImageBien
                      bienData={data}
                      reference={reference}
                      index='18'
                    />
                  </div>
                  <div>
                    <UpdateImageBien
                      bienData={data}
                      reference={reference}
                      index='19'
                    />
                  </div>
                  <div>
                    <UpdateImageBien
                      bienData={data}
                      reference={reference}
                      index='20'
                    />
                  </div>
                  <div>
                    <UpdateImageBien
                      bienData={data}
                      reference={reference}
                      index='21'
                    />
                  </div>
                  <div>
                    <UpdateImageBien
                      bienData={data}
                      reference={reference}
                      index='22'
                    />
                  </div>
                  <div>
                    <UpdateImageBien
                      bienData={data}
                      reference={reference}
                      index='23'
                    />
                  </div>
                  <div>
                    <UpdateImageBien
                      bienData={data}
                      reference={reference}
                      index='24'
                    />
                  </div>
                  <div>
                    <UpdateImageBien
                      bienData={data}
                      reference={reference}
                      index='25'
                    />
                  </div>
                  <div>
                    <UpdateImageBien
                      bienData={data}
                      reference={reference}
                      index='26'
                    />
                  </div>
                  <div>
                    <UpdateImageBien
                      bienData={data}
                      reference={reference}
                      index='27'
                    />
                  </div>
                  <div>
                    <UpdateImageBien
                      bienData={data}
                      reference={reference}
                      index='28'
                    />
                  </div>
                  <div>
                    <UpdateImageBien
                      bienData={data}
                      reference={reference}
                      index='29'
                    />
                  </div>
                  <div>
                    <UpdateImageBien
                      bienData={data}
                      reference={reference}
                      index='30'
                    />
                  </div>
                </div>
              </div>
            </div>
          </>
        )}
      </div>
    </>
  )
}

export default ModifierUnBien
