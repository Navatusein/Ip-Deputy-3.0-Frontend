import {createApi} from "@reduxjs/toolkit/dist/query/react";
import axiosBaseQuery from "../api";
import {IStudentTelegram} from "../models/IStudentTelegram.ts";

export const studentsTelegramApi = createApi({
  reducerPath: "studentsTelegramApi",
  baseQuery: axiosBaseQuery(),
  tagTypes: ["Telegram"],
  endpoints: (build) => ({
    fetchAll: build.query<IStudentTelegram[], void>({
      query: () => ({
        url: "/telegram",
        method: "GET"
      }),
      providesTags: () => ["Telegram"]
    }),
    add: build.mutation<IStudentTelegram, IStudentTelegram>({
      query: (obj) => ({
        url: "/telegram",
        method: "POST",
        data: obj
      }),
      invalidatesTags: ["Telegram"]
    }),
    update: build.mutation<IStudentTelegram, IStudentTelegram>({
      query: (obj) => ({
        url: "/telegram",
        method: "PUT",
        data: obj
      }),
      invalidatesTags: ["Telegram"]
    }),
    remove: build.mutation<IStudentTelegram, number>({
      query: (id) => ({
        url: "/telegram",
        method: "DELETE",
        params: {id: id}
      }),
      invalidatesTags: ["Telegram"]
    }),
  })
})