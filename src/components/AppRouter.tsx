import {FC} from 'react';
import {Route, Routes} from 'react-router-dom';
import AuthenticationPage from "../pages/AuthenticationPage.tsx";
import StudentsInformationPage from "../pages/dashboard/students/StudentsInformationPage.tsx";
import DashboardLayout from "./DashboardLayout.tsx";
import {useAppSelector} from "../hooks/useAppSelector.ts";
import HomePage from "../pages/dashboard/HomePage.tsx";
import SchedulePage from "../pages/dashboard/subjects/SchedulePage.tsx";
import SubjectsInformationPage from "../pages/dashboard/subjects/SubjectsInformationPage.tsx";
import StudentsSubgroupsPage from "../pages/dashboard/students/SubgroupsInformationPage.tsx";
import TeachersInformationPage from "../pages/dashboard/teachers/TeachersInformationPage.tsx";
import StudentsTelegramPage from "../pages/dashboard/students/TelegramInformationPage.tsx";
import SubmissionsConfigPage from "../pages/dashboard/submissions/SubmissionsConfigPage.tsx";
import SubmissionRegistrationPage from "../pages/bot/SubmissionRegistrationPage.tsx";
import BotLayout from "./BotLayout.tsx";
import SubmissionControlPage from "../pages/bot/SubmissionControlPage.tsx";

const AppRouter: FC = () => {
  const {user} = useAppSelector(state => state.userReducer);
  return (
    <>
      <Routes>
        {user !== null ?
          <Route element={<DashboardLayout/>}>
            <Route path="/*" element={<HomePage/>}/>
            <Route path="/students/information" element={<StudentsInformationPage/>}/>
            <Route path="/students/subgroups" element={<StudentsSubgroupsPage/>}/>
            <Route path="/students/telegram-information" element={<StudentsTelegramPage/>}/>
            <Route path="/teachers/information" element={<TeachersInformationPage/>}/>
            <Route path="/subjects/information" element={<SubjectsInformationPage/>}/>
            <Route path="/subjects/schedule" element={<SchedulePage/>}/>
            <Route path="/submissions/config" element={<SubmissionsConfigPage/>}/>
          </Route>:
          <>
            <Route path="/*" element={<AuthenticationPage/>}/>
          </>
        }
        <Route element={<BotLayout/>}>
          <Route path="/bot/submission/register" element={<SubmissionRegistrationPage/>}/>
          <Route path="/bot/submission/control" element={<SubmissionControlPage/>}/>
        </Route>
      </Routes>
    </>
  );
};

export default AppRouter;