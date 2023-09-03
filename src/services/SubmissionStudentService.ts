import {createApi} from "@reduxjs/toolkit/dist/query/react";
import axiosBaseQuery from "../api";
import {ISubmissionStudent} from "../models/ISubmissionStudent.ts";

export const submissionStudentApi = createApi({
  reducerPath: "submissionStudentApi",
  baseQuery: axiosBaseQuery(),
  tagTypes: ["SubmissionStudent"],
  endpoints: (build) => ({
    fetchByStudent: build.query<ISubmissionStudent[], number>({
      query: (studentId) => ({
        url: "/submission-student",
        method: "GET",
        params: {studentId: studentId}
      }),
      providesTags: () => ["SubmissionStudent"]
    }),
    add: build.mutation<ISubmissionStudent, ISubmissionStudent>({
      query: (obj) => ({
        url: "/submission-student",
        method: "POST",
        data: obj
      }),
      invalidatesTags: ["SubmissionStudent"]
    }),
    update: build.mutation<ISubmissionStudent, ISubmissionStudent>({
      query: (obj) => ({
        url: "/submission-student",
        method: "PUT",
        data: obj
      }),
      invalidatesTags: ["SubmissionStudent"]
    }),
    remove: build.mutation<ISubmissionStudent, number>({
      query: (id) => ({
        url: "/submission-student",
        method: "DELETE",
        params: {id: id}
      }),
      invalidatesTags: ["SubmissionStudent"]
    }),
  })
})