import React, { useState, useEffect } from 'react'
import { Modal, Button, Spinner } from "@wordpress/components"
import Sidebar from "./components/sidebar"
import Header from "./components/header"
import PreviewBlock from './components/preview_block'
import PostTypeBlock from './components/PostTypeBlock'
import { isEqual } from 'lodash'
import { getTemplates } from '../../../block/api'


function Settings({ onClose, status, clientId, cpt }) {

    const [columns, setColumns] = useState(3);
    const [catagory, setCatagory] = useState('Hero');
    const [data, setData] = useState([]);
    const [loading, setLoading] = useState(false);


    useEffect(() => {

        getTemplates()
            .then(templates => {

                console.log(data);
                setData(templates)

            })
            .catch(err => {

                console.error(err);

            })

    }, [])

    const saved_forms = cwpGlobal["cwp-cpt-forms"];


    const templates = data.map((data, index) => {
        return <PreviewBlock onSelect={onClose} clientId={clientId} key={index} data={data} />
    });

    const post_types = saved_forms.map((form, index) => {
        return <PostTypeBlock onSelect={onClose} clientId={clientId} key={index} form={form} />
    });

    return (
        <div className="cwp-settings_modal">
            {
                status && <Modal
                    title="Insert Form"
                    className="cwp_lib_modal"
                    onRequestClose={onClose}
                >
                    <div className="cwp__lib">
                        <Sidebar
                            isCpt={cpt}
                            currentCatagory={catagory}
                            applyCatagory={(c) => setCatagory(c)}
                            columns={columns}
                            setColumns={c => setColumns(c)}
                        />
                        <div className="cwp__data__wrapper">
                            <Header currentCatagory={catagory} />
                            {
                                !loading ? (
                                    <div className="cwp__data" data-cols={columns}>
                                        {
                                            isEqual(catagory, 'Saved Forms') ? post_types : templates
                                        }
                                    </div>
                                ) : (
                                        <div className="cwp_loader">
                                            <Spinner />
                                        </div>
                                    )
                            }
                        </div>
                    </div>
                </Modal>
            }
        </div>
    )
}


export default Settings;