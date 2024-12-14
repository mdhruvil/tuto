import { useSession } from "@/auth/auth-client";
import { LoaderIcon } from "lucide-react";
import { Navigate } from "react-router";

export function AuthGuard({ children }: { children: React.ReactNode }) {
  const session = useSession();
  if (session.isPending)
    return (
      <div className="flex justify-center items-center h-screen">
        <LoaderIcon size={16} className="animate-spin" />
      </div>
    );
  if (session.error)
    return (
      <div className="flex justify-center items-center h-screen">
        Error: {session.error.message}
      </div>
    );
  if (!session.data) return <Navigate to="/auth/sign-in" />;
  return <>{children}</>;
}
