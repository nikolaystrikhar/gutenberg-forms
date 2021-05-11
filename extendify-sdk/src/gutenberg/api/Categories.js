import { Axios as api } from '.'

const Categories = {
    getAll() {
        return api.get('categories')
    },
}

export default Categories
