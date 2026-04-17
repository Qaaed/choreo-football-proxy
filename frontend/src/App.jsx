import { useAuthContext } from "@asgardeo/auth-react";
import Login from "./components/Login";
import Dashboard from "./components/Dashboard";

function App() {
  const { state } = useAuthContext();

  if (state.isLoading) {
    return (
      <div className="min-h-screen bg-slate-900 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (!state.isAuthenticated) {
    return <Login />;
  }

  return <Dashboard />;
}

export default App;
