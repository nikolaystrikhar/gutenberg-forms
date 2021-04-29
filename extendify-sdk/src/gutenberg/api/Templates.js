import { createTemplatesFilterFormula } from '../functions/index'
import { get } from 'lodash'
import { Axios as api } from '.'

const Templates = {
    get(filters, params) {
        return api.post('templates', {
            filterByFormula: createTemplatesFilterFormula(filters),
            pageSize: 9,
            categories: get(filters, 'categories'),
            search: get(filters, 'search'),
            type: get(filters, 'type'),
            ...params,
        })
    },
    import(template) {
        return api.post(`templates/${template.id}`, {
            template_id: template.id,
            pageSize: 9,
            template_name: template.fields?.title,
        })
    },
}

export default Templates
