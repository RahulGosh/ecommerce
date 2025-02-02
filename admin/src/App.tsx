import { Route, Routes } from "react-router-dom";
import Navbar from "./components/navbar";
import Sidebar from "./components/sidebar";
import Add from "./pages/add";
import List from "./pages/list";
import Orders from "./pages/orders";
import AdminLogin from "./components/login";
import { useSelector } from "react-redux";
import { RootState } from "./store/store";
import { Admin } from "./types/types";
import { ToastContainer } from "react-toastify";

function App() {
  const { admin } = useSelector((store: RootState) => store.auth) as {
    admin: Admin | null;
  };
  console.log(admin, "admin");

  return (
    <div className="bg-gray-50 min-h-screen">
      <ToastContainer />
      {!admin ? (
        <AdminLogin />
      ) : (
        <div>
          <>
            <Navbar />
            <hr />
            <div className="flex w-full">
              <Sidebar />
              <div className="w-[70%] mx-auto ml-[max(5vw, 25px)] my-8 text-gray-600 text-base">
                <Routes>
                  <Route path="/add" element={<Add />} />
                  <Route path="/list" element={<List />} />
                  <Route path="/orders" element={<Orders />} />
                </Routes>
              </div>
            </div>
          </>
        </div>
      )}
    </div>
  );
}

export default App;
