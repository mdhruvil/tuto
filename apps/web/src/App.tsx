import { createBrowserRouter, RouterProvider } from "react-router";
import { AuthLayout } from "@/routes/auth/layout";
import { SignIn } from "@/routes/auth/sign-in";
import { SignUp } from "@/routes/auth/sign-up";
import { Toaster } from "@/components/ui/sonner";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { DashboardLayout } from "./routes/dashboard/layout";
import { AuthGuard } from "./components/auth-guard";
import { KnowledgeBases } from "./routes/dashboard/knowledge-bases";
import { BasicUploaderDemo } from "./routes/dashboard/[knowLedgebaseId]";

const router = createBrowserRouter([
  {
    path: "/auth",
    element: <AuthLayout />,
    children: [
      {
        path: "sign-in",
        element: <SignIn />,
      },
      {
        path: "sign-up",
        element: <SignUp />,
      },
    ],
  },
  {
    path: "/dashboard",
    element: (
      <AuthGuard>
        <DashboardLayout />
      </AuthGuard>
    ),
    children: [
      {
        path: "",
        element: <KnowledgeBases />,
      },
      {
        path: ":knowledgebaseId",
        element: <BasicUploaderDemo />,
      },
    ],
  },
]);

const queryClient = new QueryClient();

export default function App() {
  return (
    <>
      <QueryClientProvider client={queryClient}>
        <RouterProvider router={router} />
        <Toaster style={{ fontFamily: "Inter Variable" }} />
      </QueryClientProvider>
    </>
  );
}
