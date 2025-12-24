import { lazy, Suspense } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import AppLayout from "../shared/layout/AppLayout";
import LoadingOverlay from "../shared/components/LoadingOverlay";

// Lazy load all page components
const HomePage = lazy(() => import("../features/posts/pages/HomePage"));
const LoginPage = lazy(() => import("../features/auth/pages/LoginPage"));
const RegisterPage = lazy(() => import("../features/auth/pages/RegisterPage"));
const NotFoundPage = lazy(() => import("../features/common/pages/NotFoundPage"));
const ProfilePage = lazy(() => import("../features/profile/pages/ProfilePage"));
const CreatePostPage = lazy(() => import("../features/posts/pages/CreatePostPage"));
const BattlePage = lazy(() => import("../features/battle/pages/BattlePage"));
const EditPostPage = lazy(() => import("../features/posts/pages/EditPostPage"));


export default function AppRouter() {
  return (
    <BrowserRouter>
      <Suspense fallback={<LoadingOverlay visible={true} />}>
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
      </Suspense>
    </BrowserRouter>
  );
}
