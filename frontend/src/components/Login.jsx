import { useAuthContext } from "@asgardeo/auth-react";

export default function Login() {
  const { signIn } = useAuthContext();

  return (
    <div className="relative min-h-screen bg-[#080808] flex flex-col items-center justify-center p-8 overflow-hidden font-mono">
      {/* Pitch line SVG background */}
      <svg
        className="absolute inset-0 w-full h-full opacity-[0.04]"
        xmlns="http://www.w3.org/2000/svg"
        preserveAspectRatio="xMidYMid slice"
      >
        {/* Halfway line */}
        <line
          x1="0"
          y1="50%"
          x2="100%"
          y2="50%"
          stroke="white"
          strokeWidth="1.5"
        />
        {/* Center circle */}
        <circle
          cx="50%"
          cy="50%"
          r="120"
          fill="none"
          stroke="white"
          strokeWidth="1.5"
        />
        {/* Center dot */}
        <circle cx="50%" cy="50%" r="5" fill="white" />
        {/* Outer pitch border */}
        <rect
          x="5%"
          y="8%"
          width="90%"
          height="84%"
          fill="none"
          stroke="white"
          strokeWidth="1.5"
        />
        {/* Left penalty box */}
        <rect
          x="5%"
          y="31%"
          width="14%"
          height="38%"
          fill="none"
          stroke="white"
          strokeWidth="1.5"
        />
        {/* Right penalty box */}
        <rect
          x="81%"
          y="31%"
          width="14%"
          height="38%"
          fill="none"
          stroke="white"
          strokeWidth="1.5"
        />
        {/* Left 6-yard box */}
        <rect
          x="5%"
          y="41%"
          width="5%"
          height="18%"
          fill="none"
          stroke="white"
          strokeWidth="1"
        />
        {/* Right 6-yard box */}
        <rect
          x="90%"
          y="41%"
          width="5%"
          height="18%"
          fill="none"
          stroke="white"
          strokeWidth="1"
        />
      </svg>

      {/* Top-left wordmark */}
      <div className="absolute top-8 left-10 flex items-center gap-2">
        <div className="w-2 h-2 rounded-full bg-[#C9F53E]" />
        <span className="text-[11px] tracking-[0.2em] text-white/30 uppercase">
          MatchHub
        </span>
      </div>

      {/* Top-right status pip */}
      <div className="absolute top-8 right-10 flex items-center gap-2">
        <span className="text-[11px] tracking-widest text-white/20 uppercase">
          Live
        </span>
        <div className="w-1.5 h-1.5 rounded-full bg-[#C9F53E] animate-pulse" />
      </div>

      {/* Card */}
      <div className="relative z-10 w-full max-w-[380px]">
        {/* Season label */}
        <p className="text-[10px] tracking-[0.25em] text-white/25 uppercase mb-6 text-center">
          2024 / 25 Season
        </p>

        {/* Main heading */}
        <div className="mb-10 text-center">
          <h1 className="text-[52px] font-black tracking-[-0.04em] leading-none text-white">
            MATCH
          </h1>
          <h1 className="text-[52px] font-black tracking-[-0.04em] leading-none text-[#C9F53E]">
            HUB
          </h1>
        </div>

        {/* Divider */}
        <div className="flex items-center gap-3 mb-8">
          <div className="flex-1 h-px bg-white/10" />
          <span className="text-[10px] tracking-[0.2em] text-white/20 uppercase">
            Dashboard Access
          </span>
          <div className="flex-1 h-px bg-white/10" />
        </div>

        {/* Sign in button */}
        <button
          onClick={() => signIn()}
          className="
            w-full py-4 px-6
            bg-[#C9F53E] hover:bg-[#d6f95c]
            text-[#0A0A0A] font-bold
            text-[11px] tracking-[0.2em] uppercase
            transition-colors duration-150
            flex items-center justify-between
            group
          "
        >
          <span>Sign In</span>
          <svg
            className="w-4 h-4 group-hover:translate-x-1 transition-transform duration-150"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2.5}
              d="M13 7l5 5m0 0l-5 5m5-5H6"
            />
          </svg>
        </button>

        {/* Footer */}
        <div className="mt-6 flex items-center justify-center gap-2">
          <div className="w-px h-3 bg-white/15" />
          <span className="text-[10px] tracking-[0.15em] text-white/20 uppercase">
            Secured by Asgardeo
          </span>
          <div className="w-px h-3 bg-white/15" />
        </div>
      </div>
    </div>
  );
}
