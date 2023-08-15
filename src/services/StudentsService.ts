import {createApi} from "@reduxjs/toolkit/dist/query/react";
import axiosBaseQuery from "../api";
import {IStudent} from "../models/IStudent";

export const studentApi = createApi({
  reducerPath: "studentApi",
  baseQuery: axiosBaseQuery(),
  tagTypes: ["students"],
  endpoints: (build) => ({
    fetchAll: build.query<IStudent[], void>({
      query: () => ({
        url: "/student",
        method: "GET"
      }),
      providesTags: () => ["students"]
    }),
    add: build.mutation<IStudent, IStudent>({
      query: (obj) => ({
        url: "/student",
        method: "POST",
        data: obj
      }),
      invalidatesTags: ["students"]
    }),
    update: build.mutation<IStudent, IStudent>({
      query: (obj) => ({
        url: "/student",
        method: "PUT",
        data: obj
      }),
      invalidatesTags: ["students"]
    }),
    remove: build.mutation<IStudent, number>({
      query: (id) => ({
        url: "/student",
        method: "DELETE",
        params: {id: id}
      }),
      invalidatesTags: ["students"]
    }),
  })
})