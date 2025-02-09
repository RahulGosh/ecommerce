import { Route, Routes } from "react-router-dom";
import Home from "./pages/home";
import Collection from "./pages/collection";
import About from "./pages/about";
import Contact from "./pages/contact";
import Product from "./pages/product";
import Cart from "./pages/cart";
import Login from "./pages/login";
import PlaceOrder from "./pages/placeOrder";
import Orders from "./pages/orders";
import Navbar from "./components/navbar";
import Footer from "./components/footer";
import SearchBar from "./components/searchBar";
import { ToastContainer } from "react-toastify";
import { useSelector } from "react-redux";
import { User } from "./types/types";
import { RootState } from "./store/store";
import { AuthenticatedUser, ProtectedRoute } from "./utils/protectedRoute";
import ForgotPassword from "./pages/forgotPassword";
import ResetPassword from "./pages/resetPassword";

function App() {
  const { user } = useSelector((store: RootState) => store.auth) as {
    user: User | null;
  };
  console.log(user, "admin");

  return (
    <div className="px-4 sm:px-[5vw] md:px-[7vw] lg:px-[9vw]">
      <ToastContainer />
      <Navbar />
      <SearchBar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/collection" element={<Collection />} />
        <Route path="/about" element={<About />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="/product/:productId" element={<Product />} />
        <Route
          path="/cart"
          element={
            <ProtectedRoute>
              <Cart />
            </ProtectedRoute>
          }
        />
        <Route
          path="/login"
          element={
            <AuthenticatedUser>
              <Login />
            </AuthenticatedUser>
          }
        />
        <Route
          path="/forgot-password"
          element={
            <AuthenticatedUser>
              <ForgotPassword />
            </AuthenticatedUser>
          }
        />
        <Route
          path="/reset-password/:token"
          element={
            <AuthenticatedUser>
              <ResetPassword />
            </AuthenticatedUser>
          }
        />
        <Route
          path="/place-order"
          element={
            <ProtectedRoute>
              <PlaceOrder />
            </ProtectedRoute>
          }
        />
        <Route
          path="/orders"
          element={
            <ProtectedRoute>
              <Orders />
            </ProtectedRoute>
          }
        />
      </Routes>
      <Footer />
    </div>
  );
}

export default App;
