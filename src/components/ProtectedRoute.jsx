import { Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { Loader2 } from "lucide-react";

const ProtectedRoute = ({ children, requireAdmin = false }) => {
  const { isLoggedIn, isAdmin, loading } = useAuth();

  if (loading) {
    return (
      <div className="flex min-h-screen w-full flex-col items-center justify-center bg-white">
        <Loader2 className="h-10 w-10 animate-spin text-blue-custom" />
        <p className="mt-4 text-sm font-medium text-slate-500 animate-pulse">
          Memeriksa sesi otentikasi...
        </p>
      </div>
    );
  }

  if (!isLoggedIn) {
    return <Navigate to="/" replace />;
  }

  if (requireAdmin && !isAdmin) {
    return <Navigate to="/" replace />;
  }

  return children;
};

export default ProtectedRoute;
