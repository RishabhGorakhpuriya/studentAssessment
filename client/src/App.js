import AddQuestionForm from "./component/AddQuestionForm";
import AssessmentDetails from "./component/AssessmentDetails";
import AssessmentFrom from "./component/AssessmentForm";
import Home from "./component/Home";
import LoginForm from "./component/LoginForm";
import Signup from "./component/Signup";
import * as React from "react";
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import UserAssessment from "./component/UserAssessment";
import SuccessPage from "./component/SuccessPage";
import AssessmentHistory from "./component/student/AssessmentHistory";
import AssessmentUpdate from "./component/AssessmentUpdate";
import AssessmentQuestionUpdate from "./component/AssessmentQuestionUpdate";
import UserListPage from "./component/UserListPage";
import UserProfile from "./component/UserProfile";
import StudentFeedback from "./component/StudentFeedback";
const router = createBrowserRouter([
  {
    path: "/login",
    element: (<LoginForm />),
  },
  {
    path: "/signup",
    element: (<Signup />)
  },
  {
    path: "/",
    element: (<Home />)
  }, {
    path: "/createAssessment",
    element: (<AssessmentFrom />)
  },
  {
    path: "/assessment/:id",
    element: (<AssessmentDetails />)
  },
  {
    path: "/addNewQuestion/:id",
    element: (<AddQuestionForm />)
  }, {
    path: "/userAssessment/:id",
    element: (<UserAssessment />)
  },
  {
    path: "/SubmitSuccessfull",
    element: (<SuccessPage />)
  }, {
    path: "/assessmentHistory/:id",
    element: (<AssessmentHistory />)
  }, {
    path: "/updateAssessment/:id",
    element: (<AssessmentUpdate />)
  }, {
    path: "/assessmentQuestonUpdate",
    element: (<AssessmentQuestionUpdate />)
  },
  {
    path: "/studentList",
    element: (<UserListPage />)
  }, {
    path: "/userprofile",
    element: (<UserProfile />)
  }, {
    path: "/studentfeedback/:id",
    element: (<StudentFeedback />)
  }
]);
function App() {
  return (

    <RouterProvider router={router} />

  );
}

export default App;
