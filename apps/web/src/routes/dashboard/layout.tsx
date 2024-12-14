import { signOut } from "@/auth/auth-client";
import { Button } from "@/components/ui/button";

export function DashboardLayout() {
  return (
    <div>
      <Button onClick={() => signOut()}>Sign out</Button>
    </div>
  );
}
