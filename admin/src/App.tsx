import { Route, Routes } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import { useSelector } from "react-redux";
import { RootState } from "./store/store";
import { Admin } from "./types/types";
import AdminLogin from "./components/login";
import Add from "./pages/add";
import List from "./pages/list";
import Orders from "./pages/orders";
import "react-toastify/dist/ReactToastify.css";
import DashboardLayout from "./components/dashboardLayout";
import EditProduct from "./pages/editProduct";

function App() {
  const { admin } = useSelector((store: RootState) => store.auth) as {
    admin: Admin | null;
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 to-purple-50">
      <ToastContainer position="top-right" theme="colored" />
      
      {!admin ? (
        <AdminLogin />
      ) : (
        <DashboardLayout>
          <Routes>
            <Route path="/add" element={<Add />} />
            <Route path="/list" element={<List />} />
            <Route path="/orders" element={<Orders />} />
            <Route path="*" element={<Add />} />
            <Route path="/edit-product/:productId" element={<EditProduct />} />
          </Routes>
        </DashboardLayout>
      )}
    </div>
  );
}

export default App;