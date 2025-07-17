import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import UserRegister from "./pages/UserRegister";
import UserLogin from "./pages/UserLogin";
import UserApp from "./pages/UserApp";
import BrandRegister from "./pages/BrandRegister";
import BrandLogin from "./pages/BrandLogin";
import BrandApp from "./pages/BrandApp";
import AdminApp from "./pages/AdminApp";
import Landing from "./pages/Landing";
import UserBrandProfile from "./pages/UserBrandProfile";
import UserAward from "./pages/UserAward";
import ProtectedRoute from "./components/ProtectedRoute";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Navigate to="/login" />} />
        <Route path="/register" element={<UserRegister />} />
        <Route path="/login" element={<UserLogin />} />
        <Route path="/brand/register" element={<BrandRegister />} />
        <Route path="/brand/login" element={<BrandLogin />} />
        <Route path="/landing" element={<Landing />} />

        /* Rutas protegidas por rol */
        <Route
          path="/user/app"
          element={
            <ProtectedRoute allowedRoles={["user", "admin"]}>
              <UserApp />
            </ProtectedRoute>
          }
        />
        <Route
          path="/brand/app"
          element={
            <ProtectedRoute allowedRoles={["brand"]}>
              <BrandApp />
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/app"
          element={
            <ProtectedRoute allowedRoles={["admin"]}>
              <AdminApp />
            </ProtectedRoute>
          }
        />
        <Route
          path="/brand/:id"
          element={
            <ProtectedRoute allowedRoles={["user", "admin"]}>
              <UserBrandProfile />
            </ProtectedRoute>
          }
        />
        <Route
          path="/user/brand/:id"
          element={
            <ProtectedRoute allowedRoles={["user", "admin"]}>
              <UserBrandProfile />
            </ProtectedRoute>
          }
        />
        <Route
          path="/user/award/:awardId"
          element={
            <ProtectedRoute allowedRoles={["user", "admin"]}>
              <UserAward />
            </ProtectedRoute>
          }
        />
      </Routes>
    </BrowserRouter>
  );
}

export default App;