import {createApi} from "@reduxjs/toolkit/dist/query/react";
import axiosBaseQuery from "../api";
import {ISubmissionsConfig} from "../models/ISubmissionsConfig.ts";

export const submissionsConfigApi = createApi({
  reducerPath: "submissionsConfigApi",
  baseQuery: axiosBaseQuery(),
  tagTypes: ["SubmissionsConfig"],
  endpoints: (build) => ({
    fetchAll: build.query<ISubmissionsConfig[], void>({
      query: () => ({
        url: "/submissions-config",
        method: "GET"
      }),
      providesTags: () => ["SubmissionsConfig"]
    }),
    fetchForStudent: build.query<ISubmissionsConfig[], number>({
      query: (studentId) => ({
        url: "/submissions-config/for-student",
        method: "GET",
        params: {studentId: studentId}
      }),
      providesTags: () => ["SubmissionsConfig"]
    }),
    add: build.mutation<ISubmissionsConfig, ISubmissionsConfig>({
      query: (obj) => ({
        url: "/submissions-config",
        method: "POST",
        data: obj
      }),
      invalidatesTags: ["SubmissionsConfig"]
    }),
    update: build.mutation<ISubmissionsConfig, ISubmissionsConfig>({
      query: (obj) => ({
        url: "/submissions-config",
        method: "PUT",
        data: obj
      }),
      invalidatesTags: ["SubmissionsConfig"]
    }),
    remove: build.mutation<ISubmissionsConfig, number>({
      query: (id) => ({
        url: "/submissions-config",
        method: "DELETE",
        params: {id: id}
      }),
      invalidatesTags: ["SubmissionsConfig"]
    }),
  })
})