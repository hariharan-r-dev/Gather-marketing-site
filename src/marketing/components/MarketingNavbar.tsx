import { useState, useEffect } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../../app/AppProvider";

export default function MarketingNavbar() {
  const { isSignedIn } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [isVisible, setIsVisible] = useState(true);
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    let lastScrollY = window.scrollY;
    let ticking = false;

    function updateNavbar() {
      const currentScrollY = window.scrollY;

      // Handle at/near top of page
      if (currentScrollY <= 20) {
        setIsScrolled(false);
        setIsVisible(true);
        lastScrollY = currentScrollY;
        ticking = false;
        return;
      }

      setIsScrolled(true);

      // Keep navbar visible if mobile menu is open
      if (mobileMenuOpen) {
        setIsVisible(true);
        lastScrollY = currentScrollY;
        ticking = false;
        return;
      }

      const deltaY = currentScrollY - lastScrollY;

      // Filter micro-movements (prevent jitter)
      if (Math.abs(deltaY) > 5) {
        if (deltaY > 0 && currentScrollY > 80) {
          // Scrolling DOWN -> Hide navbar
          setIsVisible(false);
        } else if (deltaY < 0) {
          // Scrolling UP -> Reveal sticky navbar
          setIsVisible(true);
        }
        lastScrollY = currentScrollY;
      }

      ticking = false;
    }

    function onScroll() {
      if (!ticking) {
        window.requestAnimationFrame(updateNavbar);
        ticking = true;
      }
    }

    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, [mobileMenuOpen]);

  function handleLogin() {
    if (isSignedIn) {
      navigate("/app");
    } else {
      navigate("/login");
    }
  }

  function scrollToSection(id: string) {
    setMobileMenuOpen(false);
    if (location.pathname !== "/") {
      navigate(`/#${id}`);
      setTimeout(() => {
        const element = document.getElementById(id);
        if (element) {
          element.scrollIntoView({ behavior: "smooth", block: "start" });
        }
      }, 100);
    } else {
      const element = document.getElementById(id);
      if (element) {
        element.scrollIntoView({ behavior: "smooth", block: "start" });
      }
    }
  }

  return (
    <>
      <header
        className={`fixed top-0 left-0 right-0 z-50 h-[68px] sm:h-[72px] flex flex-col justify-center border-b transform-gpu will-change-transform transition-all duration-350 ease-[cubic-bezier(0.16,1,0.3,1)] ${
          isVisible ? "translate-y-0" : "-translate-y-full"
        } ${
          isScrolled
            ? "bg-white/95 backdrop-blur-md border-[#E2E8F0] shadow-xs"
            : "bg-[#F8FAFC] border-transparent"
        }`}
      >
        <div className="w-full px-5 sm:px-8 lg:px-[80px] flex items-center justify-between">
          {/* Left Side: Gather Logo + Grouped Nav Links */}
          <div className="flex items-center">
            {/* Gather Logo */}
            <Link to="/" className="flex items-center text-[#0F172A] group flex-shrink-0">
              <span className="text-base sm:text-lg font-semibold tracking-tight text-[#0F172A]">
                Gather
              </span>
            </Link>

            {/* Desktop Navigation Links directly adjacent to Gather */}
            <nav className="hidden md:flex items-center gap-6 lg:gap-8 ml-8 lg:ml-10 text-sm font-medium text-[#64748B]">
              <button
                type="button"
                onClick={() => scrollToSection("how-it-works")}
                className="hover:text-[#0F172A] transition-colors cursor-pointer"
              >
                How it works
              </button>
              <button
                type="button"
                onClick={() => scrollToSection("features")}
                className="hover:text-[#0F172A] transition-colors cursor-pointer"
              >
                Features
              </button>
              <button
                type="button"
                onClick={() => scrollToSection("pricing")}
                className="hover:text-[#0F172A] transition-colors cursor-pointer"
              >
                Plan
              </button>
              <button
                type="button"
                onClick={() => scrollToSection("faq")}
                className="hover:text-[#0F172A] transition-colors cursor-pointer"
              >
                FAQ
              </button>
            </nav>
          </div>

          {/* Right Side: Solid Blue "Log in" Button CTA */}
          <div className="flex items-center gap-3">
            {/* <button
              type="button"
              onClick={handleLogin}
              className="px-5 py-2 text-sm font-medium text-white bg-[#2563EB] hover:bg-[#1D4ED8] rounded-xl transition-all shadow-2xs cursor-pointer"
            >
              Log in
            </button> */}

            {/* Mobile Hamburger Toggle */}
            <button
              type="button"
              onClick={() => setMobileMenuOpen((prev) => !prev)}
              className="md:hidden p-2 text-[#64748B] hover:text-[#0F172A] rounded-lg cursor-pointer"
              aria-label="Toggle Navigation"
            >
              {mobileMenuOpen ? (
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M18 6L6 18M6 6l12 12" />
                </svg>
              ) : (
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M4 6h16M4 12h16M4 18h16" />
                </svg>
              )}
            </button>
          </div>
        </div>

        {/* Mobile Menu Dropdown */}
        {mobileMenuOpen && (
          <div className="md:hidden bg-white border-b border-[#E2E8F0] px-6 py-5 shadow-lg animate-in fade-in slide-in-from-top-2 duration-150">
            <div className="flex flex-col gap-4 text-sm font-medium text-[#64748B]">
              <button
                type="button"
                onClick={() => scrollToSection("how-it-works")}
                className="text-left py-1 hover:text-[#0F172A]"
              >
                How it works
              </button>
              <button
                type="button"
                onClick={() => scrollToSection("features")}
                className="text-left py-1 hover:text-[#0F172A]"
              >
                Features
              </button>
              <button
                type="button"
                onClick={() => scrollToSection("pricing")}
                className="text-left py-1 hover:text-[#0F172A]"
              >
                Plan
              </button>
              <button
                type="button"
                onClick={() => scrollToSection("faq")}
                className="text-left py-1 hover:text-[#0F172A]"
              >
                FAQ
              </button>
              {/* <div className="pt-3 border-t border-[#F1F5F9]">
                <button
                  type="button"
                  onClick={handleLogin}
                  className="w-full py-2.5 text-center text-sm font-medium text-white bg-[#2563EB] hover:bg-[#1D4ED8] rounded-xl"
                >
                  Log in
                </button>
              </div> */}
            </div>
          </div>
        )}
      </header>

      {/* Static Spacer to prevent content layout shift from fixed header */}
      <div className="h-[68px] sm:h-[72px] w-full shrink-0" aria-hidden="true" />
    </>
  );
}
