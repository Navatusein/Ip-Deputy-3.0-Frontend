import {createApi} from "@reduxjs/toolkit/dist/query/react";
import axiosBaseQuery from "../api";
import {ICoupleTime} from "../models/ICoupleTime.ts";

export const coupleTimeApi = createApi({
  reducerPath: "coupleTimeApi",
  baseQuery: axiosBaseQuery(),
  endpoints: (build) => ({
    fetchAll: build.query<ICoupleTime[], void>({
      query: () => ({
        url: "/couple-time",
        method: "GET"
      })
    }),
  })
})