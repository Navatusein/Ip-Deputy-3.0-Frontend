import {createApi} from "@reduxjs/toolkit/dist/query/react";
import axiosBaseQuery from "../api";
import {ISubjectType} from "../models/ISubjectType.ts";

export const subjectTypeApi = createApi({
  reducerPath: "subjectTypeApi",
  baseQuery: axiosBaseQuery(),
  endpoints: (build) => ({
    fetchAll: build.query<ISubjectType[], void>({
      query: () => ({
        url: "/subject-type",
        method: "GET"
      })
    }),
  })
})