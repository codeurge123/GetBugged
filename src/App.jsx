import React from "react";
import GetBuged from "./pages/GetBuged";
import { Route, Routes } from "react-router-dom";
import Docs from "./pages/Introduction";
import Playground from "./pages/Playground";
import ScrollToTop from "./components/ScrollToTop";
import Introduction from "./pages/Introduction";
import GettingStarted from "./pages/GettingStarted";
import Levels from "./pages/Levels";
import HowToUse from "./pages/HowToUse";
import DebuggingGuide from "./pages/DebuggingGuide";
import DocsLayout from "./components/DocsLayout";
import BestPractices from "./pages/BestPractices";
import CommonErrors from "./pages/CommonErrors";

function App() {
  return (
    <>
      <ScrollToTop />
      <Routes>
        <Route path="/" element={<GetBuged />} />
        <Route path="/docs" element={<DocsLayout />}>
          <Route index element={<Introduction />} />
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