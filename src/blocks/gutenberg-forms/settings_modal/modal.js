import React, { useState, useEffect, Fragment } from 'react'
import { Modal, Button, Spinner } from "@wordpress/components"
import Sidebar from "./components/sidebar"
import Header from "./components/header"
import PreviewBlock from './components/preview_block'
import PostTypeBlock from './components/PostTypeBlock'
import Templates from "./components/templates"
import { isEqual, isEmpty } from 'lodash'
import { getTemplates } from '../../../block/api'
import Empty from './components/Empty'


function Settings({ onClose, status, clientId, cpt }) {

    const [catagory, setCatagory] = useState('Hero');
    const [data, setData] = useState([]);
    const [loading, setLoading] = useState(false);

    const [templates, setTemplates] = useState([]);
    const [currentTemplate, setCurrentTemplate] = useState({});

    useEffect(() => {

        setLoading(true);

        getTemplates()
            .then(templates => {

                setData(templates);

                setLoading(false);

            })
            .catch(err => {

                console.error(err);

            })

    }, []);

    const handleCatagory = (c) => {

        setCatagory(c);

        if (!isEqual(c, 'Saved Forms')) {

            const catagoryTemplates = data.filter(v => {
                return isEqual(v.fields.Category, c);
            });

            setTemplates(catagoryTemplates);

            if (catagoryTemplates[0]) {
                setCurrentTemplate(catagoryTemplates[0]);
            }

        }


    }

    const saved_forms = cwpGlobal["cwp-cpt-forms"];

    // const templates = data.map((data, index) => {
    //     return <PreviewBlock onSelect={onClose} clientId={clientId} key={index} data={data} />
    // });

    const post_types = !isEmpty(saved_forms) ? saved_forms.map((form, index) => {
        return <PostTypeBlock onSelect={onClose} clientId={clientId} key={index} form={form} />
    }) : <Empty message="No Saved Forms!" />

    const currentPreview = <PreviewBlock onSelect={onClose} clientId={clientId} data={currentTemplate} />

    const wrapperClass = isEqual(catagory, 'Saved Forms') ? 'cpt' : 'templates';

    return (
        <div className="cwp-settings_modal">
            {
                status && <Modal
                    title="Insert a Saved Form or choose from a template."
                    className="cwp_lib_modal"
                    onRequestClose={onClose}
                >
                    <div className="cwp__lib">
                        <Sidebar
                            data={data}
                            isCpt={cpt}
                            currentCatagory={catagory}
                            applyCatagory={(c) => handleCatagory(c)}
                        />
                        <div className={`cwp__data__wrapper ${wrapperClass}`}>

                            {
                                !loading ? (
                                    <Fragment>
                                        {
                                            !isEqual(catagory, 'Saved Forms') && <Templates
                                                onSelect={(template) => setCurrentTemplate(template)}
                                                currentTemplate={currentTemplate}
                                                templates={templates}
                                            />
                                        }
                                        <div className="cwp__data">
                                            {
                                                isEqual(catagory, 'Saved Forms') ? post_types : currentPreview
                                            }
                                        </div>
                                    </Fragment>
                                ) : (
                                        <div>
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
