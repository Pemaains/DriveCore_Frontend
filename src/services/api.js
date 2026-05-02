import axios from 'axios'

const api = axios.create({
    baseURL: 'https://localhost:7196/api',
    headers: {
        'Content-Type': 'application/json'
    }
})

export default api