import React, { useState, useEffect } from 'react'
import { Modal, Button } from "@wordpress/components"
import Sidebar from "./components/sidebar"
import Header from "./components/header"
import PreviewBlock from './components/preview_block'
import $ from 'jquery'
import { get_saved_forms } from '../../../block/functions'



export default function Settings({ onClose, status }) {

    const [columns, setColumns] = useState(3);
    const [catagory, setCatagory] = useState('Hero');
    const [data, setData] = useState([])




    useEffect(() => {
        get_saved_forms().then(forms => {
            setData(forms);
        }).catch(err => {
            console.error(err);
        })
    }, [])

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
                            currentCatagory={catagory}
                            applyCatagory={(c) => setCatagory(c)}
                            columns={columns}
                            setColumns={c => setColumns(c)}
                        />
                        <div className="cwp__data__wrapper">
                            <Header currentCatagory={catagory} />
                            <div className="cwp__data" data-cols={columns}>
                                {data.map((data, index) => {
                                    return <PreviewBlock data={data} />
                                })}
                            </div>
                        </div>
                    </div>
                </Modal>
            }
        </div>
    )
}
