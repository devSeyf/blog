import { BrowserRouter, Routes, Route } from "react-router-dom";
import HomePage from "../features/posts/pages/HomePage";
import LoginPage from "../features/auth/pages/LoginPage";
import AppLayout from "../shared/layout/AppLayout";
import RegisterPage from "../features/auth/pages/RegisterPage";
import NotFoundPage from "../features/common/pages/NotFoundPage";
import ProfilePage from "../features/profile/pages/ProfilePage";
import CreatePostPage from "../features/posts/pages/CreatePostPage";
import BattlePage from "../features/battle/pages/BattlePage";
import EditPostPage from "../features/posts/pages/EditPostPage";


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
        <Route path="/posts/:id/edit" element={<EditPostPage />} />

        </Route>
      </Routes>
    </BrowserRouter>
  );
}
