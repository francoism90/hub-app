import axios from 'axios'
import { stringify } from 'qs'
import { client, useForm } from 'laravel-precognition-vue'

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
  withCredentials: true,
  headers: {
    Accept: 'application/json',
    'Content-Type': 'application/json',
    'X-Requested-With': 'XMLHttpRequest'
  },
  paramsSerializer: {
    serialize: (params) =>
      stringify(params, { encode: false, skipNulls: true, arrayFormat: 'comma' })
  }
})

client.use(api)

export { api, axios, useForm, stringify }
