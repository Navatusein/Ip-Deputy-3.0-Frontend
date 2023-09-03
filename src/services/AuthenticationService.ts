import {createApi} from '@reduxjs/toolkit/query/react';
import {IUser} from "../models/IUser.ts";
import {ILoginData} from "../models/ILoginData.ts";
import {userSlice} from "../store/slices/UserSlice.ts";
import axiosBaseQuery from "../api";

const {setUser, logout} = userSlice.actions;

export const authenticationApi = createApi({
  reducerPath: 'authenticationApi',
  baseQuery: axiosBaseQuery(),
  endpoints: (builder) => ({
    loginUser: builder.mutation<IUser, ILoginData>({
      query: (data) => ({
        url: '/authentication/login',
        method: 'POST',
        data: data
      }),
      async onQueryStarted(_, { dispatch, queryFulfilled }) {
        try {
          const { data } = await queryFulfilled;
          await dispatch(setUser(data));
        }
        catch (error) {
          await dispatch(logout());
        }
      },
    }),
    loginBotUser: builder.mutation<IUser, number>({
      query: (telegramId) => ({
        url: '/authentication/login-bot',
        method: 'POST',
        params: {telegramId: telegramId}
      }),
      async onQueryStarted(_, { dispatch, queryFulfilled }) {
        try {
          const { data } = await queryFulfilled;
          await dispatch(setUser(data));
        }
        catch (error) {
          await dispatch(logout());
        }
      },
    }),
  }),
});