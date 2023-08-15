import {combineReducers, configureStore} from "@reduxjs/toolkit";

import userReducer from "./slices/UserSlice.ts";
import {authenticationApi} from "../services/AuthenticationService.ts";
import {studentApi} from "../services/StudentsService.ts";
import {subgroupApi} from "../services/SubgroupService.ts";
import {subjectApi} from "../services/SubjectService.ts";
import {teacherApi} from "../services/TeacherService.ts";
import {coupleApi} from "../services/CoupleService.ts";
import {coupleTimeApi} from "../services/CoupleTimeService.ts";
import {subjectTypeApi} from "../services/SubjectTypeService.ts";
import {studentsTelegramApi} from "../services/StudentTelegramsService.ts";
import {submissionsConfigApi} from "../services/SubmissionsConfigsService.ts";

const rootReducer = combineReducers({
  userReducer,
  [authenticationApi.reducerPath]: authenticationApi.reducer,
  [studentApi.reducerPath]: studentApi.reducer,
  [subgroupApi.reducerPath]: subgroupApi.reducer,
  [subjectApi.reducerPath]: subjectApi.reducer,
  [teacherApi.reducerPath]: teacherApi.reducer,
  [coupleApi.reducerPath]: coupleApi.reducer,
  [coupleTimeApi.reducerPath]: coupleTimeApi.reducer,
  [subjectTypeApi.reducerPath]: subjectTypeApi.reducer,
  [studentsTelegramApi.reducerPath]: studentsTelegramApi.reducer,
  [submissionsConfigApi.reducerPath]: submissionsConfigApi.reducer,
})

const middlewares = [
  authenticationApi.middleware,
  studentApi.middleware,
  subgroupApi.middleware,
  subjectApi.middleware,
  teacherApi.middleware,
  coupleApi.middleware,
  coupleTimeApi.middleware,
  subjectTypeApi.middleware,
  studentsTelegramApi.middleware,
  submissionsConfigApi.middleware,
]

export const setupStore = () => {
  return configureStore({
    reducer: rootReducer,
    devTools: true,
    middleware: (getDefaultMiddleware) => getDefaultMiddleware({
      serializableCheck: false
    }).concat(middlewares)
  });
}

export type RootState = ReturnType<typeof rootReducer>
export type AppStore = ReturnType<typeof setupStore>
export type AppDispatch = AppStore['dispatch']
