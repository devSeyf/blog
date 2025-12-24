import { BrowserRouter, Routes, Route } from "react-router-dom";
import AppLayout from "../shared/layout/AppLayout";
import HomePage from "../features/posts/pages/HomePage";
import LoginPage from "../features/auth/pages/LoginPage";
import RegisterPage from "../features/auth/pages/RegisterPage";
import NotFoundPage from "../features/common/pages/NotFoundPage";
import ProfilePage from "../features/profile/pages/ProfilePage";
import CreatePostPage from "../features/posts/pages/CreatePostPage";
import BattlePage from "../features/battle/pages/BattlePage";
import EditPostPage from "../features/posts/pages/EditPostPage";
import PostDetailPage from "../features/posts/pages/PostDetailPage";

export default function AppRouter() {
  return (
    <BrowserRouter>

      <Routes>
        <Route element={<AppLayout />}>
          <Route path="/" element={<HomePage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
          <Route path="/profile" element={<ProfilePage />} />
          <Route path="/posts/new" element={<CreatePostPage />} />
          <Route path="/battle" element={<BattlePage />} />
          <Route path="/posts/:id" element={<PostDetailPage />} />
          <Route path="/posts/:id/edit" element={<EditPostPage />} />
          <Route path="*" element={<NotFoundPage />} />
        </Route>
      </Routes>

    </BrowserRouter>
  );
}
