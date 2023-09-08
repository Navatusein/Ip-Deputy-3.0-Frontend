import {createApi} from "@reduxjs/toolkit/dist/query/react";
import axiosBaseQuery from "../api";
import {ICouple} from "../models/ICouple.ts";

export const coupleApi = createApi({
  reducerPath: "coupleApi",
  baseQuery: axiosBaseQuery(),
  tagTypes: ["Couples"],
  endpoints: (build) => ({
    fetchAll: build.query<ICouple[], number>({
      query: (dayOfWeekId) => ({
        url: "/couple",
        method: "GET",
        params: {dayOfWeekId: dayOfWeekId}
      }),
      providesTags: () => ["Couples"]
    }),
    add: build.mutation<ICouple, ICouple>({
      query: (obj) => ({
        url: "/couple",
        method: "POST",
        data: obj
      }),
      invalidatesTags: ["Couples"]
    }),
    update: build.mutation<ICouple, ICouple>({
      query: (obj) => ({
        url: "/couple",
        method: "PUT",
        data: obj
      }),
      invalidatesTags: ["Couples"]
    }),
    remove: build.mutation<ICouple, number>({
      query: (id) => ({
        url: "/couple",
        method: "DELETE",
        params: {id: id}
      }),
      invalidatesTags: ["Couples"]
    }),
  })
})