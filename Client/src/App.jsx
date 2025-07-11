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

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Navigate to="/login" />} />
        <Route path="/register" element={<UserRegister />} />
        <Route path="/login" element={<UserLogin />} />
        <Route path="/user/app" element={<UserApp />} />
        <Route path="/brand/register" element={<BrandRegister />} />
        <Route path="/brand/login" element={<BrandLogin />} />
        <Route path="/brand/app" element={<BrandApp />} />
        <Route path="/admin/app" element={<AdminApp />} />
        <Route path="/landing" element={<Landing />} />
        <Route path="/brand/:id" element={<UserBrandProfile />} />
        <Route path="/user/brand/:id" element={<UserBrandProfile />} />
        <Route path="/user/award/:awardId" element={<UserAward />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;