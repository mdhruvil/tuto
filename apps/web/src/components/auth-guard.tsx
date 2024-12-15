import { useSession } from "@/auth/auth-client";
import { LoaderIcon } from "lucide-react";
import { useNavigate } from "react-router";
import { useTransition, Suspense } from "react";

export function AuthGuard({ children }: { children: React.ReactNode }) {
  const navigate = useNavigate();
  const [isPending, startTransition] = useTransition();
  const session = useSession();

  if (session.isPending || isPending)
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

  if (!session.data) {
    startTransition(() => {
      navigate("/auth/sign-in");
    });
    return null;
  }

  return (
    <Suspense
      fallback={
        <div className="flex justify-center items-center h-screen">
          <LoaderIcon size={16} className="animate-spin" />
        </div>
      }
    >
      {children}
    </Suspense>
  );
}
