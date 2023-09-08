import {createApi} from "@reduxjs/toolkit/dist/query/react";
import axiosBaseQuery from "../api";
import {ITeacher} from "../models/ITeacher.ts";

export const teacherApi = createApi({
  reducerPath: "teacherApi",
  baseQuery: axiosBaseQuery(),
  tagTypes: ["Teacher"],
  endpoints: (build) => ({
    fetchAll: build.query<ITeacher[], void>({
      query: () => ({
        url: "/teacher",
        method: "GET"
      }),
      providesTags: () => ["Teacher"]
    }),
    add: build.mutation<ITeacher, ITeacher>({
      query: (obj) => ({
        url: "/teacher",
        method: "POST",
        data: obj
      }),
      invalidatesTags: ["Teacher"]
    }),
    update: build.mutation<ITeacher, ITeacher>({
      query: (obj) => ({
        url: "/teacher",
        method: "PUT",
        data: obj
      }),
      invalidatesTags: ["Teacher"]
    }),
    remove: build.mutation<ITeacher, number>({
      query: (id) => ({
        url: "/teacher",
        method: "DELETE",
        params: {id: id}
      }),
      invalidatesTags: ["Teacher"]
    }),
  })
})