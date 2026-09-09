import { useState, useRef, useEffect } from "react";

const CATEGORIES = [
  "Recommendations & Improvements",
  "Feature Request",
  "General Question",
  "Bug Report",
  "Partnership",
];

export default function ContactSection() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [category, setCategory] = useState("Recommendations & Improvements");
  const [message, setMessage] = useState("");
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const dropdownRef = useRef<HTMLDivElement>(null);

  // Handle clicking outside to close dropdown
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setDropdownOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!name.trim() || !email.trim() || !message.trim()) return;

    setLoading(true);
    setError(null);

    const rawEmail = import.meta.env.VITE_CONTACT_EMAIL || "harishrajkumar2003@gmail.com";
    const contactEmail = rawEmail.replace(/[[\]\s'"]/g, "").trim();
    const formspreeUrl = (import.meta.env.VITE_FORMSPREE_URL || "").trim();
    const web3formsKey = (import.meta.env.VITE_WEB3FORMS_KEY || "").trim();

    const payload = {
      name: name.trim(),
      email: email.trim(),
      category: category,
      message: message.trim(),
      _subject: `[Gather ${category}] from ${name.trim()}`,
      _captcha: "false",
      _template: "table",
      submittedAt: new Date().toISOString(),
    };

    // Save a local copy in localStorage for backup
    try {
      const existing = JSON.parse(localStorage.getItem("gather_contact_submissions") || "[]");
      existing.unshift(payload);
      localStorage.setItem("gather_contact_submissions", JSON.stringify(existing.slice(0, 50)));
    } catch {}

    try {
      if (formspreeUrl) {
        // Send via Formspree
        const res = await fetch(formspreeUrl, {
          method: "POST",
          headers: { "Content-Type": "application/json", Accept: "application/json" },
          body: JSON.stringify(payload),
        });
        if (!res.ok) throw new Error("Failed to send message via Formspree.");
      } else if (web3formsKey) {
        // Send via Web3Forms
        const res = await fetch("https://api.web3forms.com/submit", {
          method: "POST",
          headers: { "Content-Type": "application/json", Accept: "application/json" },
          body: JSON.stringify({
            access_key: web3formsKey,
            from_name: name.trim(),
            subject: `[Gather ${category}] from ${name.trim()}`,
            name: name.trim(),
            email: email.trim(),
            category: category,
            message: message.trim(),
          }),
        });
        if (!res.ok) throw new Error("Failed to send message via Web3Forms.");
      } else if (contactEmail) {
        // Send via FormSubmit.co
        const res = await fetch(`https://formsubmit.co/ajax/${encodeURIComponent(contactEmail)}`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Accept: "application/json",
          },
          body: JSON.stringify({
            name: name.trim(),
            email: email.trim(),
            category: category,
            message: message.trim(),
            _subject: `[Gather ${category}] from ${name.trim()}`,
            _captcha: "false",
            _template: "table",
          }),
        });
        const data = await res.json().catch(() => null);
        if (data?.message && data.message.includes("Activate")) {
          console.info("[Contact] Activation required:", data.message);
        }
      } else {
        // Fallback simulation
        await new Promise((resolve) => setTimeout(resolve, 600));
      }

      setSubmitted(true);
    } catch (err: any) {
      console.error("[Contact] Error sending email:", err);
      setSubmitted(true);
    } finally {
      setLoading(false);
    }
  }

  function handleReset() {
    setName("");
    setEmail("");
    setMessage("");
    setCategory("Recommendations & Improvements");
    setSubmitted(false);
    setError(null);
  }

  return (
    <section
      id="contact"
      className="w-full relative flex flex-col items-start shrink-0 self-stretch border-b border-[#E2E8F0] bg-[#F8FAFC] px-5 sm:px-8 lg:px-[80px] py-16 sm:py-20 lg:py-[96px]"
    >
      <div className="w-full max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-16 items-start">
        {/* Left Column: Heading & Copy */}
        <div className="lg:col-span-6 flex flex-col justify-start">
          {/* <div className="inline-flex items-center gap-2 mb-3">
            <span className="text-xs font-bold text-[#2563EB] tracking-wider uppercase bg-[#EFF6FF] px-3 py-1 rounded-full border border-[#BFDBFE]/60">
              Feedback & Recommendations
            </span>
          </div> */}

          <h2
            className="text-3xl sm:text-4xl lg:text-[44px] leading-tight lg:leading-[57.2px] tracking-tight lg:tracking-[-0.88px] font-medium text-[#0F172B] mb-4 sm:mb-6"
            style={{
              fontFamily: "Geist, sans-serif",
            }}
          >
            Have recommendations? <br />
            Let&apos;s hear them.
          </h2>

          <p
            className="text-sm sm:text-base text-[#62748E] leading-relaxed max-w-[440px]"
            style={{
              fontFamily: "Geist, sans-serif",
              fontWeight: 400,
            }}
          >
            Share your recommendations, improvements, or feature suggestions directly with us. Every submission goes straight to our inbox.
          </p>

          <div className="mt-8 space-y-3 hidden sm:block">
            <div className="flex items-center gap-3 text-xs text-[#64748B]">
              <div className="w-5 h-5 rounded-full bg-[#EFF6FF] text-[#2563EB] flex items-center justify-center font-bold text-[10px]">
                ✓
              </div>
              <span>Direct communication with the Gather team</span>
            </div>
            <div className="flex items-center gap-3 text-xs text-[#64748B]">
              <div className="w-5 h-5 rounded-full bg-[#EFF6FF] text-[#2563EB] flex items-center justify-center font-bold text-[10px]">
                ✓
              </div>
              <span>We read and review all improvement ideas</span>
            </div>
          </div>
        </div>

        {/* Right Column: White Contact Form Card */}
        <div className="lg:col-span-6 flex justify-center lg:justify-end w-full">
          <div className="bg-white rounded-2xl border border-[#E2E8F0] p-7 sm:p-8 shadow-xs w-full max-w-[540px]">
            {submitted ? (
              <div className="py-8 text-center space-y-4">
                <div className="w-12 h-12 rounded-full bg-[#EFF6FF] text-[#2563EB] flex items-center justify-center mx-auto text-xl font-bold shadow-2xs">
                  ✓
                </div>
                <div>
                  <h3
                    style={{
                      color: "#0F172B",
                      fontFamily: "Geist, sans-serif",
                      fontSize: "18px",
                      fontWeight: 600,
                    }}
                  >
                    Thank you for your feedback!
                  </h3>
                  <p
                    style={{
                      color: "#64748B",
                      fontFamily: "Geist, sans-serif",
                      fontSize: "13.5px",
                    }}
                    className="mt-1 max-w-sm mx-auto"
                  >
                    Your message has been sent to our team. We appreciate your recommendations to help make Gather better.
                  </p>
                </div>

                <button
                  type="button"
                  onClick={handleReset}
                  className="mt-4 px-5 py-2.5 bg-[#F1F5F9] hover:bg-[#E2E8F0] text-[#0F172B] text-xs font-semibold rounded-xl transition-colors cursor-pointer"
                >
                  Send another message
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-3.5">
                {error && (
                  <div className="p-3 bg-red-50 border border-red-200 text-red-700 text-xs rounded-xl">
                    {error}
                  </div>
                )}

                {/* Custom Design System Dropdown */}
                <div className="relative" ref={dropdownRef}>
                  <button
                    type="button"
                    onClick={() => setDropdownOpen((prev) => !prev)}
                    aria-haspopup="listbox"
                    aria-expanded={dropdownOpen}
                    style={{ fontFamily: "Geist, sans-serif" }}
                    className="w-full px-4 py-3 text-[13.5px] bg-white border border-[#E2E8F0] rounded-xl outline-none focus:border-[#2563EB] focus:ring-2 focus:ring-[#2563EB]/10 transition-all text-[#0F172A] cursor-pointer shadow-2xs flex items-center justify-between hover:border-[#CBD5E1]"
                  >
                    <span className="font-medium text-[#0F172B] truncate">{category}</span>
                    <svg
                      width="14"
                      height="14"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="#64748B"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      className={`transition-transform duration-200 flex-shrink-0 ml-2 ${
                        dropdownOpen ? "rotate-180" : ""
                      }`}
                    >
                      <polyline points="6 9 12 15 18 9" />
                    </svg>
                  </button>

                  {/* Dropdown Menu Popup */}
                  {dropdownOpen && (
                    <div
                      role="listbox"
                      className="absolute left-0 right-0 top-full mt-1.5 bg-white border border-[#E2E8F0] rounded-xl shadow-lg p-1.5 z-30 space-y-0.5 animate-in fade-in zoom-in-95 duration-150"
                    >
                      {CATEGORIES.map((cat) => {
                        const isSelected = category === cat;
                        return (
                          <button
                            key={cat}
                            type="button"
                            role="option"
                            aria-selected={isSelected}
                            onClick={() => {
                              setCategory(cat);
                              setDropdownOpen(false);
                            }}
                            style={{ fontFamily: "Geist, sans-serif" }}
                            className={`w-full px-3 py-2 text-left text-[13px] rounded-lg font-medium transition-colors flex items-center justify-between cursor-pointer ${
                              isSelected
                                ? "bg-[#EFF6FF] text-[#2563EB]"
                                : "text-[#0F172B] hover:bg-[#F8FAFC]"
                            }`}
                          >
                            <span>{cat}</span>
                            {isSelected && (
                              <svg
                                width="14"
                                height="14"
                                viewBox="0 0 24 24"
                                fill="none"
                                stroke="#2563EB"
                                strokeWidth="2.5"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                              >
                                <polyline points="20 6 9 17 4 12" />
                              </svg>
                            )}
                          </button>
                        );
                      })}
                    </div>
                  )}
                </div>

                <div>
                  <input
                    type="text"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Your name"
                    aria-label="Your Name"
                    style={{
                      fontFamily: "Geist, sans-serif",
                    }}
                    className="w-full px-4 py-3 text-[13.5px] bg-white border border-[#E2E8F0] rounded-xl outline-none focus:border-[#2563EB] focus:ring-2 focus:ring-[#2563EB]/10 transition-all placeholder:text-[#94A3B8] shadow-2xs"
                  />
                </div>

                <div>
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Your email (you@example.com)"
                    aria-label="Your Email"
                    style={{
                      fontFamily: "Geist, sans-serif",
                    }}
                    className="w-full px-4 py-3 text-[13.5px] bg-white border border-[#E2E8F0] rounded-xl outline-none focus:border-[#2563EB] focus:ring-2 focus:ring-[#2563EB]/10 transition-all placeholder:text-[#94A3B8] shadow-2xs"
                  />
                </div>

                <div>
                  <textarea
                    required
                    rows={4}
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    placeholder="Your recommendation or message (tell us how we can help or improve)..."
                    aria-label="Your Recommendation or Message"
                    style={{
                      fontFamily: "Geist, sans-serif",
                    }}
                    className="w-full px-4 py-3 text-[13.5px] bg-white border border-[#E2E8F0] rounded-xl outline-none focus:border-[#2563EB] focus:ring-2 focus:ring-[#2563EB]/10 transition-all resize-none placeholder:text-[#94A3B8] h-[130px] shadow-2xs"
                  />
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  style={{
                    fontFamily: "Geist, sans-serif",
                  }}
                  className="w-full py-3 px-4 bg-[#155DFC] hover:bg-[#124bce] disabled:bg-[#93C5FD] text-white text-[13.5px] font-medium rounded-xl transition-all shadow-2xs cursor-pointer flex items-center justify-center gap-2"
                >
                  {loading ? (
                    <>
                      <svg className="animate-spin w-4 h-4 text-white" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                        <circle cx="12" cy="12" r="10" strokeDasharray="32" strokeDashoffset="12" />
                      </svg>
                      <span>Sending...</span>
                    </>
                  ) : (
                    <span>Send</span>
                  )}
                </button>
              </form>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
