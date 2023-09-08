import axios, {AxiosError, AxiosRequestConfig} from "axios";
import {userSlice} from "../store/slices/UserSlice";
import {AppStore} from "../store/store";
import jwt_decode from "jwt-decode";
import {IJwtToken} from "../models/IJwtToken";
import {BaseQueryFn} from "@reduxjs/toolkit/query";

axios.defaults.withCredentials = true;

// @ts-ignore
export const API_URL = window["env"]["apiUrl"] || "localhost:9999";

const api = axios.create({
  withCredentials: true,
  baseURL: API_URL,
})

let store: AppStore;

export const injectStore = (_store: AppStore) => {
  store = _store
}

api.interceptors.request.use(async (config) => {
  let user = store.getState().userReducer.user;
  const {setUser, logout} = userSlice.actions;

  if (user != null) {
    const decodedToken: IJwtToken = jwt_decode(user.jwtToken);

    if (decodedToken.exp * 1000 < Date.now() && decodedToken.refresh === 'True') {
      //TODO Remove log
      console.log("Refresh token");

      await axios.post(API_URL + '/authentication/refresh', user)
        .then(response => {
          user = response.data;
          store.dispatch(setUser(user));
        })
        .catch(error => {
          console.error(error);
          console.log("Logout")
          store.dispatch(logout());
        });
    }

    config.headers["Authorization"] = 'Bearer ' + user.jwtToken;
  }

  return config;
});

const axiosBaseQuery = (): BaseQueryFn<AxiosRequestConfig, unknown, AxiosError> =>
    async ({url, method, data, params}) => {
      try {
        const result = await api({url, method, data, params});
        return {data: result.data};
      }
      catch (axiosError) {
        return {error: axiosError as AxiosError};
      }
    };

export default axiosBaseQuery;