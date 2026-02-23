import React from "react";
import GetBuged from "./pages/GetBuged";
import { Route, Routes } from "react-router-dom";
import Docs from "./pages/Docs";
import Playground from "./pages/Playground";
import ScrollToTop from "./components/ScrollToTop";


function App() {
  return (
    <>
      <ScrollToTop />
      <Routes>
        <Route path="/" element={<GetBuged />} />
        <Route path="/docs" element={<Docs />} />
        <Route path="/playground" element={<Playground />} />
      </Routes>
    </>
  );
}

export default App;