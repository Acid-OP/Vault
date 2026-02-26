"use client";

import { useState } from "react";
import Link from "next/link";
import { Eye, EyeOff } from "lucide-react";

export default function SignUpPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [agreed, setAgreed] = useState(false);

  const strength = Math.min(5, Math.floor(password.length / 2));
  const strengthColor =
    strength <= 1 ? "#ea3941" : strength <= 3 ? "#f0b90b" : "#00c176";

  return (
    <div className="min-h-screen bg-[#0e0f14] flex">
      {/* Left panel */}
      <div className="hidden lg:flex flex-col justify-between w-[480px] shrink-0 bg-[#08090d] border-r border-[rgba(42,46,57,0.12)] p-10 relative overflow-hidden">
        {/* Green glow behind chart */}
        <div className="absolute top-[20%] left-[30%] w-[300px] h-[400px] bg-[#00c176]/[0.04] blur-[80px] rounded-full" />
        <div className="absolute bottom-[10%] left-[20%] w-[200px] h-[200px] bg-[#ea3941]/[0.03] blur-[60px] rounded-full" />

        {/* Kline chart - larger, bolder */}
        <svg
          className="absolute top-[10%] left-0 w-full h-[80%] opacity-[0.12]"
          viewBox="0 0 480 700"
          preserveAspectRatio="xMidYMid meet"
        >
          {/* Candles trending upward across the full panel */}
          <line
            x1="30"
            y1="580"
            x2="30"
            y2="500"
            stroke="#00c176"
            strokeWidth="1.2"
          />
          <rect x="24" y="520" width="12" height="45" fill="#00c176" rx="1" />

          <line
            x1="55"
            y1="590"
            x2="55"
            y2="490"
            stroke="#ea3941"
            strokeWidth="1.2"
          />
          <rect x="49" y="500" width="12" height="65" fill="#ea3941" rx="1" />

          <line
            x1="80"
            y1="560"
            x2="80"
            y2="460"
            stroke="#00c176"
            strokeWidth="1.2"
          />
          <rect x="74" y="475" width="12" height="55" fill="#00c176" rx="1" />

          <line
            x1="105"
            y1="540"
            x2="105"
            y2="430"
            stroke="#00c176"
            strokeWidth="1.2"
          />
          <rect x="99" y="450" width="12" height="60" fill="#00c176" rx="1" />

          <line
            x1="130"
            y1="555"
            x2="130"
            y2="445"
            stroke="#ea3941"
            strokeWidth="1.2"
          />
          <rect x="124" y="455" width="12" height="70" fill="#ea3941" rx="1" />

          <line
            x1="155"
            y1="520"
            x2="155"
            y2="400"
            stroke="#00c176"
            strokeWidth="1.2"
          />
          <rect x="149" y="420" width="12" height="65" fill="#00c176" rx="1" />

          <line
            x1="180"
            y1="505"
            x2="180"
            y2="390"
            stroke="#00c176"
            strokeWidth="1.2"
          />
          <rect x="174" y="405" width="12" height="70" fill="#00c176" rx="1" />

          <line
            x1="205"
            y1="530"
            x2="205"
            y2="410"
            stroke="#ea3941"
            strokeWidth="1.2"
          />
          <rect x="199" y="420" width="12" height="60" fill="#ea3941" rx="1" />

          <line
            x1="230"
            y1="490"
            x2="230"
            y2="360"
            stroke="#00c176"
            strokeWidth="1.2"
          />
          <rect x="224" y="380" width="12" height="75" fill="#00c176" rx="1" />

          <line
            x1="255"
            y1="470"
            x2="255"
            y2="340"
            stroke="#00c176"
            strokeWidth="1.2"
          />
          <rect x="249" y="355" width="12" height="80" fill="#00c176" rx="1" />

          <line
            x1="280"
            y1="490"
            x2="280"
            y2="370"
            stroke="#ea3941"
            strokeWidth="1.2"
          />
          <rect x="274" y="380" width="12" height="55" fill="#ea3941" rx="1" />

          <line
            x1="305"
            y1="450"
            x2="305"
            y2="310"
            stroke="#00c176"
            strokeWidth="1.2"
          />
          <rect x="299" y="330" width="12" height="85" fill="#00c176" rx="1" />

          <line
            x1="330"
            y1="430"
            x2="330"
            y2="290"
            stroke="#00c176"
            strokeWidth="1.2"
          />
          <rect x="324" y="310" width="12" height="80" fill="#00c176" rx="1" />

          <line
            x1="355"
            y1="460"
            x2="355"
            y2="320"
            stroke="#ea3941"
            strokeWidth="1.2"
          />
          <rect x="349" y="340" width="12" height="65" fill="#ea3941" rx="1" />

          <line
            x1="380"
            y1="410"
            x2="380"
            y2="260"
            stroke="#00c176"
            strokeWidth="1.2"
          />
          <rect x="374" y="280" width="12" height="90" fill="#00c176" rx="1" />

          <line
            x1="405"
            y1="390"
            x2="405"
            y2="240"
            stroke="#00c176"
            strokeWidth="1.2"
          />
          <rect x="399" y="260" width="12" height="85" fill="#00c176" rx="1" />

          <line
            x1="430"
            y1="420"
            x2="430"
            y2="270"
            stroke="#ea3941"
            strokeWidth="1.2"
          />
          <rect x="424" y="285" width="12" height="70" fill="#ea3941" rx="1" />

          <line
            x1="455"
            y1="380"
            x2="455"
            y2="220"
            stroke="#00c176"
            strokeWidth="1.2"
          />
          <rect x="449" y="245" width="12" height="95" fill="#00c176" rx="1" />

          {/* Volume bars */}
          <rect
            x="24"
            y="650"
            width="12"
            height="20"
            fill="#00c176"
            opacity="0.25"
            rx="1"
          />
          <rect
            x="49"
            y="640"
            width="12"
            height="30"
            fill="#ea3941"
            opacity="0.25"
            rx="1"
          />
          <rect
            x="74"
            y="635"
            width="12"
            height="35"
            fill="#00c176"
            opacity="0.25"
            rx="1"
          />
          <rect
            x="99"
            y="625"
            width="12"
            height="45"
            fill="#00c176"
            opacity="0.25"
            rx="1"
          />
          <rect
            x="124"
            y="638"
            width="12"
            height="32"
            fill="#ea3941"
            opacity="0.25"
            rx="1"
          />
          <rect
            x="149"
            y="620"
            width="12"
            height="50"
            fill="#00c176"
            opacity="0.25"
            rx="1"
          />
          <rect
            x="174"
            y="615"
            width="12"
            height="55"
            fill="#00c176"
            opacity="0.25"
            rx="1"
          />
          <rect
            x="199"
            y="635"
            width="12"
            height="35"
            fill="#ea3941"
            opacity="0.25"
            rx="1"
          />
          <rect
            x="224"
            y="610"
            width="12"
            height="60"
            fill="#00c176"
            opacity="0.25"
            rx="1"
          />
          <rect
            x="249"
            y="605"
            width="12"
            height="65"
            fill="#00c176"
            opacity="0.25"
            rx="1"
          />
          <rect
            x="274"
            y="640"
            width="12"
            height="30"
            fill="#ea3941"
            opacity="0.25"
            rx="1"
          />
          <rect
            x="299"
            y="600"
            width="12"
            height="70"
            fill="#00c176"
            opacity="0.25"
            rx="1"
          />
          <rect
            x="324"
            y="595"
            width="12"
            height="75"
            fill="#00c176"
            opacity="0.25"
            rx="1"
          />
          <rect
            x="349"
            y="630"
            width="12"
            height="40"
            fill="#ea3941"
            opacity="0.25"
            rx="1"
          />
          <rect
            x="374"
            y="590"
            width="12"
            height="80"
            fill="#00c176"
            opacity="0.25"
            rx="1"
          />
          <rect
            x="399"
            y="585"
            width="12"
            height="85"
            fill="#00c176"
            opacity="0.25"
            rx="1"
          />
          <rect
            x="424"
            y="625"
            width="12"
            height="45"
            fill="#ea3941"
            opacity="0.25"
            rx="1"
          />
          <rect
            x="449"
            y="580"
            width="12"
            height="90"
            fill="#00c176"
            opacity="0.25"
            rx="1"
          />
        </svg>

        {/* Gradient fade at bottom */}
        <div className="absolute bottom-0 left-0 right-0 h-[200px] bg-gradient-to-t from-[#08090d] to-transparent z-[1]" />

        <Link href="/" className="flex items-center gap-2 relative z-10">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="20"
            height="20"
            viewBox="0 0 24 24"
            fill="none"
            stroke="#ea3941"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path stroke="none" d="M0 0h24v24H0z" fill="none" />
            <path d="M12 12m-9 0a9 9 0 1 0 18 0a9 9 0 1 0 -18 0" />
            <path d="M9 8h4.09c1.055 0 1.91 .895 1.91 2s-.855 2 -1.91 2c1.055 0 1.91 .895 1.91 2s-.855 2 -1.91 2h-4.09" />
            <path d="M10 12h4" />
          </svg>
          <span className="text-[#eaecef] font-semibold text-[14px]">
            Backpack
          </span>
        </Link>

        <div className="relative z-10">
          <h2 className="font-[family-name:var(--font-heading)] text-[30px] text-[#eaecef] font-normal tracking-[-0.02em] leading-[1.15] mb-3">
            Trade the people
            <br />
            you believe in.
          </h2>
          <p className="text-[#4a4f63] text-[12px] leading-relaxed max-w-[280px] mb-8">
            Pick your side. Go long on Ronaldo, short Elon, or ride the next
            breakout.
          </p>

          <div className="grid grid-cols-3 gap-3">
            <div className="bg-[#0e0f14]/50 backdrop-blur-sm rounded-lg px-3.5 py-3 border border-[rgba(255,255,255,0.025)]">
              <span className="font-[family-name:var(--font-geist-mono)] text-[18px] text-[#eaecef] block leading-none mb-1">
                50+
              </span>
              <span className="text-[9px] text-[#3d4354] uppercase tracking-wider">
                Markets
              </span>
            </div>
            <div className="bg-[#0e0f14]/50 backdrop-blur-sm rounded-lg px-3.5 py-3 border border-[rgba(255,255,255,0.025)]">
              <span className="font-[family-name:var(--font-geist-mono)] text-[18px] text-[#eaecef] block leading-none mb-1">
                &lt;1s
              </span>
              <span className="text-[9px] text-[#3d4354] uppercase tracking-wider">
                Fills
              </span>
            </div>
            <div className="bg-[#0e0f14]/50 backdrop-blur-sm rounded-lg px-3.5 py-3 border border-[rgba(255,255,255,0.025)]">
              <span className="font-[family-name:var(--font-geist-mono)] text-[18px] text-[#eaecef] block leading-none mb-1">
                0%
              </span>
              <span className="text-[9px] text-[#3d4354] uppercase tracking-wider">
                Maker fee
              </span>
            </div>
          </div>
        </div>

        <p className="text-[#3d4354] text-[10px] relative z-10">
          &copy; 2026 Backpack Exchange
        </p>
      </div>

      {/* Right panel */}
      <div className="flex-1 flex items-center justify-center px-6 relative">
        {/* Subtle dot grid on right panel */}
        <div
          className="absolute inset-0 opacity-40"
          style={{
            backgroundImage:
              "radial-gradient(rgba(255,255,255,0.008) 1px, transparent 1px)",
            backgroundSize: "24px 24px",
          }}
        />

        <div className="w-full max-w-[360px] relative z-10">
          <div className="lg:hidden flex items-center gap-2 mb-10">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="20"
              height="20"
              viewBox="0 0 24 24"
              fill="none"
              stroke="#ea3941"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path stroke="none" d="M0 0h24v24H0z" fill="none" />
              <path d="M12 12m-9 0a9 9 0 1 0 18 0a9 9 0 1 0 -18 0" />
              <path d="M9 8h4.09c1.055 0 1.91 .895 1.91 2s-.855 2 -1.91 2c1.055 0 1.91 .895 1.91 2s-.855 2 -1.91 2h-4.09" />
              <path d="M10 12h4" />
            </svg>
            <span className="text-[#eaecef] font-semibold text-[14px]">
              Backpack
            </span>
          </div>

          <h1 className="text-[#eaecef] text-[20px] font-semibold mb-1.5">
            Create account
          </h1>
          <p className="text-[#4a4f63] text-[12px] mb-7">
            Already have one?{" "}
            <Link
              href="/signin"
              className="text-[#848e9c] hover:text-[#eaecef] transition-colors"
            >
              Sign in
            </Link>
          </p>

          {/* Social */}
          <div className="flex gap-2.5 mb-5">
            <button className="flex-1 flex items-center justify-center gap-2 bg-[#13141c] hover:bg-[#1a1b24] border border-[rgba(42,46,57,0.2)] hover:border-[rgba(42,46,57,0.35)] rounded-lg py-2.5 text-[11px] text-[#848e9c] transition-all cursor-pointer">
              <svg className="w-3.5 h-3.5" viewBox="0 0 24 24">
                <path
                  d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 0 1-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z"
                  fill="#4285F4"
                />
                <path
                  d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                  fill="#34A853"
                />
                <path
                  d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                  fill="#FBBC05"
                />
                <path
                  d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                  fill="#EA4335"
                />
              </svg>
              Google
            </button>
            <button className="flex-1 flex items-center justify-center gap-2 bg-[#13141c] hover:bg-[#1a1b24] border border-[rgba(42,46,57,0.2)] hover:border-[rgba(42,46,57,0.35)] rounded-lg py-2.5 text-[11px] text-[#848e9c] transition-all cursor-pointer">
              <svg className="w-3.5 h-3.5" fill="#eaecef" viewBox="0 0 24 24">
                <path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.8-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M13 3.5c.73-.83 1.94-1.46 2.94-1.5.13 1.17-.34 2.35-1.04 3.19-.69.85-1.83 1.51-2.95 1.42-.15-1.15.41-2.35 1.05-3.11z" />
              </svg>
              Apple
            </button>
          </div>

          <div className="relative mb-5">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-[rgba(42,46,57,0.12)]" />
            </div>
            <div className="relative flex justify-center">
              <span className="bg-[#0e0f14] px-3 text-[9px] text-[#3d4354] uppercase tracking-[0.15em]">
                or
              </span>
            </div>
          </div>

          <div className="space-y-3">
            <div>
              <label className="text-[10px] text-[#4a4f63] font-medium mb-1 block">
                Email
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@example.com"
                className="w-full bg-[#13141c] text-[#eaecef] border border-[rgba(42,46,57,0.2)] rounded-lg px-3.5 py-[9px] text-[12px] focus:outline-none focus:border-[rgba(42,46,57,0.45)] placeholder-[#3d4354] transition-all"
              />
            </div>

            <div>
              <label className="text-[10px] text-[#4a4f63] font-medium mb-1 block">
                Password
              </label>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Min 8 characters"
                  className="w-full bg-[#13141c] text-[#eaecef] border border-[rgba(42,46,57,0.2)] rounded-lg px-3.5 py-[9px] text-[12px] focus:outline-none focus:border-[rgba(42,46,57,0.45)] placeholder-[#3d4354] transition-all pr-10"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-[#3d4354] hover:text-[#848e9c] transition-colors"
                >
                  {showPassword ? <EyeOff size={14} /> : <Eye size={14} />}
                </button>
              </div>
              {password.length > 0 && (
                <div className="flex gap-1 mt-1.5">
                  {[...Array(5)].map((_, i) => (
                    <div
                      key={i}
                      className="h-[2px] flex-1 rounded-full transition-all duration-300"
                      style={{
                        backgroundColor:
                          i < strength ? strengthColor : "#1c1e2c",
                      }}
                    />
                  ))}
                </div>
              )}
            </div>

            <div>
              <label className="text-[10px] text-[#4a4f63] font-medium mb-1 block">
                Confirm password
              </label>
              <div className="relative">
                <input
                  type={showConfirm ? "text" : "password"}
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="Re-enter password"
                  className="w-full bg-[#13141c] text-[#eaecef] border border-[rgba(42,46,57,0.2)] rounded-lg px-3.5 py-[9px] text-[12px] focus:outline-none focus:border-[rgba(42,46,57,0.45)] placeholder-[#3d4354] transition-all pr-10"
                />
                <button
                  type="button"
                  onClick={() => setShowConfirm(!showConfirm)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-[#3d4354] hover:text-[#848e9c] transition-colors"
                >
                  {showConfirm ? <EyeOff size={14} /> : <Eye size={14} />}
                </button>
              </div>
            </div>

            <label className="flex items-start gap-2.5 cursor-pointer pt-0.5">
              <div
                onClick={() => setAgreed(!agreed)}
                className={`w-[15px] h-[15px] rounded-[3px] border shrink-0 mt-[1px] flex items-center justify-center transition-all ${agreed ? "bg-[#eaecef] border-[#eaecef]" : "bg-transparent border-[rgba(42,46,57,0.35)] hover:border-[rgba(42,46,57,0.6)]"}`}
              >
                {agreed && (
                  <svg
                    className="w-2.5 h-2.5 text-[#0e0f14]"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth={3}
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M5 13l4 4L19 7"
                    />
                  </svg>
                )}
              </div>
              <span className="text-[10px] text-[#4a4f63] leading-relaxed">
                I agree to the{" "}
                <Link
                  href="#"
                  className="text-[#848e9c] hover:text-[#eaecef] transition-colors"
                >
                  Terms
                </Link>{" "}
                and{" "}
                <Link
                  href="#"
                  className="text-[#848e9c] hover:text-[#eaecef] transition-colors"
                >
                  Privacy Policy
                </Link>
              </span>
            </label>

            <button className="w-full bg-[#eaecef] text-[#0e0f14] font-semibold py-2.5 rounded-lg text-[12px] hover:bg-white transition-all cursor-pointer shadow-[0_0_20px_rgba(234,236,239,0.04)]">
              Create Account
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
