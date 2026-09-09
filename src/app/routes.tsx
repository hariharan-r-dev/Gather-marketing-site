import { Routes, Route, Navigate } from "react-router-dom";

// Marketing pages
import LandingPage from "../marketing/pages/LandingPage";
import BlogPage from "../marketing/pages/BlogPage";
import WhatsNewPage from "../marketing/pages/WhatsNewPage";
import WhatsNewArticlePage from "../marketing/pages/WhatsNewArticlePage";
import TermsPage from "../marketing/pages/TermsPage";
import LegalPage from "../marketing/pages/LegalPage";
import LoginPage from "../marketing/pages/LoginPage";
import SignupPage from "../marketing/pages/SignupPage";

export default function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<LandingPage />} />
      <Route path="/blog" element={<BlogPage />} />
      <Route path="/whats-new" element={<WhatsNewPage />} />
      <Route path="/whats-new/:slug" element={<WhatsNewArticlePage />} />
      <Route path="/terms" element={<TermsPage />} />
      <Route path="/legal" element={<LegalPage />} />
      <Route path="/login" element={<LoginPage />} />
      <Route path="/signup" element={<SignupPage />} />

      {/* Fallback to marketing home */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}
