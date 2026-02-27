import { Outlet } from "react-router-dom";
import Navbar from "./Navbar";
import Sidebar from "./Sidebar";

export default function DocsLayout() {
  return (
    <>
      {/* <div className="sticky top-0 z-[100]">
        <Navbar />
      </div> */}

      <div className="bg-black text-white min-h-screen">

        <Sidebar />

        {/* Add left margin equal to sidebar width */}
        <main className="ml-64 p-8 max-w-4xl">
          <Outlet />
        </main>

      </div>
    </>
  );
}