import React from "react";
import GetBuged from "./pages/Home/GetBuged";
import { Route, Routes } from "react-router-dom";
import Docs from "./pages/Docs/Introduction";
import Playground from "./pages/playground/Playground";
import ScrollToTop from "./components/Features/ScrollToTop";
import Introduction from "./pages/Docs/Introduction";
import GettingStarted from "./pages/Docs/GettingStarted";
import Levels from "./pages/Docs/Levels";
import HowToUse from "./pages/Docs/HowToUse";
import DebuggingGuide from "./pages/Docs/DebuggingGuide";
import DocsLayout from "./components/DocsComponents/DocsLayout";
import BestPractices from "./pages/Docs/BestPractices";
import CommonErrors from "./pages/Docs/CommonErrors";

function App() {
  return (
    <>
      <ScrollToTop />
      <Routes>
        <Route path="/" element={<GetBuged />} />
        <Route path="/docs" element={<DocsLayout />}>
          <Route path="introduction" element={<Introduction />} />
          <Route path="getting-started" element={<GettingStarted />} />
          <Route path="levels" element={<Levels />} />
          <Route path="how-to-use" element={<HowToUse />} />
          <Route path="debugging-guide" element={<DebuggingGuide />} />
          <Route path="best-practices" element={<BestPractices />} />
          <Route path="common-errors" element={<CommonErrors />} />
          {/* <Route path="async-bugs" element={<AsyncBugs />} />
          <Route path="react-bugs" element={<ReactBugs />} />
          <Route path="performance-issues" element={<PerformanceIssues />} />
          <Route path="security-bugs" element={<SecurityBugs />} />  */}
        </Route>
        <Route path="/playground" element={<Playground />} />
      </Routes>
    </>
  );
}

export default App;