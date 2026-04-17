import { useAuthContext } from "@asgardeo/auth-react";
import Login from "./components/Login";
import Dashboard from "./components/Dashboard";

function App() {
  const { state } = useAuthContext();

  // 1. Prevent flashing the login screen while Asgardeo checks the token
  if (state.isLoading) {
    return (
      <div className="min-h-screen bg-slate-900 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  // 2. If the user is NOT logged in, show the pure Login component
  if (!state.isAuthenticated) {
    return <Login />;
  }

  // 3. If they ARE logged in, show the full Dashboard
  return <Dashboard />;
}

export default App;
