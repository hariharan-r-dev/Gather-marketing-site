import { useEffect } from "react";
import { BrowserRouter as Router, useLocation } from "react-router-dom";
import { AppProvider } from "./app/AppProvider";
import AppRoutes from "./app/routes";

function ScrollToTop() {
  const { pathname, hash } = useLocation();

  useEffect(() => {
    if (!hash) {
      window.scrollTo(0, 0);
    } else {
      const id = hash.replace("#", "");
      const element = document.getElementById(id);
      if (element) {
        element.scrollIntoView({ behavior: "smooth" });
      }
    }
  }, [pathname, hash]);

  return null;
}

export default function App() {
  return (
    <AppProvider>
      <Router>
        <ScrollToTop />
        <div className="flex flex-col min-h-screen bg-[#F8FAFC]">
          <main className="flex-1 flex flex-col min-h-0">
            <AppRoutes />
          </main>
        </div>
      </Router>
    </AppProvider>
  );
}
