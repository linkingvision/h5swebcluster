/**
 * Created by superman on 17/2/16.
 * http配置
 */

import axios from 'axios'
import store from './store'
import router from '@/router'

// http request 拦截器
axios.interceptors.request.use(
  config => {
    // console.log('http request');
    if (store.state.token) {
      config.headers.Authorization = `token ${store.state.token}`
    }
    return config
  },
  err => {
    return Promise.reject(err)
  }
)

// http response 拦截器
axios.interceptors.response.use(
  response => {
    return response
  },
  error => {
    if (error.response) {
      // if(store.state.token!=null){
      //   console.log(store.state.token);
      //   return false
      // }
      switch (error.response.status) {
        case 401:
            // 401 清除token信息并跳转到登录页面
            // console.log('http auth');
            // 只有在当前路由不是登录页面才跳转
            localStorage.removeItem('mcutoken')
            store.state.token = null
            localStorage.removeItem('mcuuser')
            store.state.user = null
            localStorage.removeItem('mcuroot')
            store.state.root = null
            router.currentRoute.path !== 'login' &&
            router.replace({
              path: '/login',
              query: { redirect: router.currentRoute.path }
            })
      }
    }
    // console.log(JSON.stringify(error));//console : Error: Request failed with status code 402
    return Promise.reject(error.response.data)
  }
)

export default axios
