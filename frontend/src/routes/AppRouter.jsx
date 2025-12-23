import { BrowserRouter, Routes, Route } from "react-router-dom";
import HomePage from "../pages/HomePage";
import LoginPage from "../pages/LoginPage";
import AppLayout from "../shared/layout/AppLayout";
import RegisterPage from "../pages/RegisterPage";
import NotFoundPage from "../pages/NotFoundPage";
import ProfilePage from "../pages/ProfilePage";
import CreatePostPage from "../pages/CreatePostPage";
import BattlePage from "../pages/BattlePage";

export default function AppRouter() {
  return (
    <BrowserRouter>
      <Routes>
        <Route element={<AppLayout />}>
          <Route path="/" element={<HomePage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
          <Route path="*" element={<NotFoundPage />} />
          <Route path="/profile" element={<ProfilePage />} />
          <Route path="/posts/new" element={<CreatePostPage />} />
          <Route path="/battle" element={<BattlePage />} />

        </Route>
      </Routes>
    </BrowserRouter>
  );
}
