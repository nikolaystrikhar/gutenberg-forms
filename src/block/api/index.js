import { get } from 'lodash'
import { DATA_PROXY, LIBRARY_PROXY } from "../constants"

export function getCatagories() {

    return new Promise((resolve, reject) => {


        fetch(DATA_PROXY, {
            method: 'GET'
        })
            .then((res) => res.json())
            .then((data) => {

                let records = data.records,
                    fields = get(records, '[0].fields'),
                    Catagories = get(fields, 'Catagories');

                resolve(Catagories);

            })
            .catch(err => {
                reject(err);
            });

    })

}

export function getTemplates() {

    return new Promise((resolve, reject) => {

        fetch(LIBRARY_PROXY, {
            method: 'GET'
        })
            .then(res => res.json())
            .then((data) => {

                let records = get(data, 'records');

                resolve(records);

            })
            .catch(err => {
                reject(err);
            })

    });

}