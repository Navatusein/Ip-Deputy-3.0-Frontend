import {createApi} from "@reduxjs/toolkit/dist/query/react";
import axiosBaseQuery from "../api";
import {ISubgroup} from "../models/ISubgroup.ts";

export const subgroupApi = createApi({
  reducerPath: "subgroupApi",
  baseQuery: axiosBaseQuery(),
  tagTypes: ["Subgroup"],
  endpoints: (build) => ({
    fetchAll: build.query<ISubgroup[], void>({
      query: () => ({
        url: "/subgroup",
        method: "GET"
      }),
      providesTags: () => ["Subgroup"]
    }),
    add: build.mutation<ISubgroup, ISubgroup>({
      query: (obj) => ({
        url: "/subgroup",
        method: "POST",
        data: obj
      }),
      invalidatesTags: ["Subgroup"]
    }),
    update: build.mutation<ISubgroup, ISubgroup>({
      query: (obj) => ({
        url: "/subgroup",
        method: "PUT",
        data: obj
      }),
      invalidatesTags: ["Subgroup"]
    }),
    remove: build.mutation<ISubgroup, number>({
      query: (id) => ({
        url: "/subgroup",
        method: "DELETE",
        params: {id: id}
      }),
      invalidatesTags: ["Subgroup"]
    }),
  })
})