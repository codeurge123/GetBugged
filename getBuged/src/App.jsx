import React from "react";
import GetBuged from "./pages/Home/GetBuged";
import { Route, Routes } from "react-router-dom";
import Playground from "./pages/playground/Playground";
import Blog from "./pages/Blog/Blog";
import Profile from "./pages/Profile/Profile.jsx";
import ScrollToTop from "./components/Features/ScrollToTop";
import Introduction from "./pages/Docs/Introduction";
import GettingStarted from "./pages/Docs/GettingStarted";
import Levels from "./pages/Docs/Levels";
import HowToUse from "./pages/Docs/HowToUse";
import DebuggingGuide from "./pages/Docs/DebuggingGuide";
import DocsLayout from "./components/DocsComponents/DocsLayout";
import BestPractices from "./pages/Docs/BestPractices";
import CommonErrors from "./pages/Docs/CommonErrors";
import ReactBugs from "./pages/Docs/ReactBugs";
import AsyncBugs from "./pages/Docs/AsyncBugs";
import PerformanceIssues from "./pages/Docs/PerformanceIssues";
import SecurityBugs from "./pages/Docs/SecurityBugs"
import ProtectedRoute from "./components/Auth/ProtectedRoute.jsx";
import Login from "./pages/Auth/Login.jsx";
import Signup from "./pages/Auth/Signup.jsx";
import OAuthCallback from "./pages/Auth/OAuthCallback.jsx";


function App() {
  return (
    <>
      <ScrollToTop />
      <Routes>
        <Route path="/" element={<GetBuged />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/auth/callback" element={<OAuthCallback />} />
        <Route path="/docs" element={<DocsLayout />}>
          <Route path="introduction" element={<Introduction />} />
          <Route path="getting-started" element={<GettingStarted />} />
          <Route path="levels" element={<Levels />} />
          <Route path="how-to-use" element={<HowToUse />} />
          <Route path="debugging-guide" element={<DebuggingGuide />} />
          <Route path="best-practices" element={<BestPractices />} />
          <Route path="common-errors" element={<CommonErrors />} />
          <Route path="react-bugs" element={<ReactBugs />} />
          <Route path="async-bugs" element={<AsyncBugs />}/>
          <Route path="performance-issues" element={<PerformanceIssues />} />
          <Route path="security-bugs" element={<SecurityBugs />} /> 
        </Route>
        <Route path="/playground"
          element={
            <ProtectedRoute>
              <Playground />
            </ProtectedRoute>
          }
        />
        <Route path="/profile"
          element={
            <ProtectedRoute>
              <Profile />
            </ProtectedRoute>
          }
        />
        <Route path="/blogs" element={<Blog />} />
      </Routes>
    </>
  );
}

export default App;