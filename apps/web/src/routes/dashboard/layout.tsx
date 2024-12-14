import { UserProfileButton } from "@/components/user-profile-button";
import { Outlet } from "react-router";

export function DashboardLayout() {
  return (
    <div className="min-h-screen bg-background">
      <header className="border-b border-border">
        <div className="mx-auto px-6 py-3 max-w-6xl lg:max-w-7xl">
          <div className="flex items-center justify-between">
            <h1 className="text-2xl font-semibold text-foreground">Tuto</h1>

            <UserProfileButton />
          </div>
        </div>
      </header>

      <main className="container mx-auto px-6 py-8 max-w-6xl lg:max-w-7xl">
        <Outlet />
      </main>
    </div>
  );
}
