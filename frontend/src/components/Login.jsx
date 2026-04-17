import { useAuthContext } from "@asgardeo/auth-react";

export default function Login() {
  const { signIn } = useAuthContext();

  return (
    <div className="min-h-screen bg-slate-900 flex flex-col items-center justify-center p-8 font-sans">
      <div className="bg-slate-800 p-10 rounded-3xl border border-slate-700 text-center max-w-md w-full shadow-2xl">
        <h1 className="text-4xl font-black tracking-tighter text-blue-500 mb-8">
          MATCH<span className="text-white">HUB</span>
        </h1>
        <button
          onClick={() => signIn()}
          className="w-full bg-blue-600 hover:bg-blue-500 text-white font-bold py-3 px-4 rounded-xl transition-all"
        >
          Log In
        </button>
      </div>
    </div>
  );
}
