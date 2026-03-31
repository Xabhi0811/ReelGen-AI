import axios from 'axios';


const api = axios.create({
    baseURL: import.meta.env.VITE_BASEURL || 'https://reelgen-ai.duckdns.org'
})

export default api