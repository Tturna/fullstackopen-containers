import axios from 'axios'
import BACKEND_URL from '../utils/util'
const baseUrl = `${BACKEND_URL}/blogs`

let token = null

const setToken = newToken => {
    token = `Bearer ${newToken}`
}

const getAll = () => {
    const request = axios.get(baseUrl)
    return request.then(response => response.data)
}

const create = async (newBlog) => {
    const response = await axios.post(baseUrl, newBlog, { headers: { Authorization: token } })
    return response.data
}

const update = async (newBlog) => {
    const response = await axios.put(`${baseUrl}/${newBlog.id}`, newBlog)
    return response.data
}

const remove = async (id) => {
    const response = await axios.delete(`${baseUrl}/${id}`, { headers: { Authorization: token } })
    return response.data
}

export default { getAll, create, update, remove, setToken }