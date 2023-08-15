import {createApi} from "@reduxjs/toolkit/dist/query/react";
import axiosBaseQuery from "../api";
import {ISubject} from "../models/ISubject.ts";

export const subjectApi = createApi({
  reducerPath: "subjectApi",
  baseQuery: axiosBaseQuery(),
  tagTypes: ["Subject"],
  endpoints: (build) => ({
    fetchAll: build.query<ISubject[], void>({
      query: () => ({
        url: "/subject",
        method: "GET"
      }),
      providesTags: () => ["Subject"]
    }),
    add: build.mutation<ISubject, ISubject>({
      query: (obj) => ({
        url: "/subject",
        method: "POST",
        data: obj
      }),
      invalidatesTags: ["Subject"]
    }),
    update: build.mutation<ISubject, ISubject>({
      query: (obj) => ({
        url: "/subject",
        method: "PUT",
        data: obj
      }),
      invalidatesTags: ["Subject"]
    }),
    remove: build.mutation<ISubject, number>({
      query: (id) => ({
        url: "/subject",
        method: "DELETE",
        params: {id: id}
      }),
      invalidatesTags: ["Subject"]
    }),
  })
})