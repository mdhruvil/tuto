import { Toaster } from "@/components/ui/sonner";
import { QueryClientProvider } from "@tanstack/react-query";
import { createBrowserRouter, RouterProvider } from "react-router";
import { AuthGuard } from "./components/auth-guard";
import { queryClient } from "./lib/query-client";
import { lazy, useEffect } from "react";

const AuthLayout = lazy(() => import("@/routes/auth/layout"));
const SignIn = lazy(() => import("@/routes/auth/sign-in"));
const SignUp = lazy(() => import("@/routes/auth/sign-up"));
const DashboardLayout = lazy(() => import("@/routes/dashboard/layout"));
const KnowledgeBases = lazy(() => import("@/routes/dashboard/knowledge-bases"));
const KnowledgeBase = lazy(
  () => import("@/routes/dashboard/[knowLedgebaseId]")
);
const Hero = lazy(() => import("@/components/hero"));

const router = createBrowserRouter([
  {
    path: "/",
    element: <Hero />,
  },
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
        path: "knowledge-bases/:knowledgebaseId",
        element: <KnowledgeBase />,
      },
    ],
  },
]);

export default function App() {
  useEffect(() => {
    async function init() {
      const pdfjs = await import("pdfjs-dist/legacy/build/pdf.mjs");
      const pdfjsWorkerLegacy = await import(
        "pdfjs-dist/legacy/build/pdf.worker.mjs?url"
      );
      pdfjs.GlobalWorkerOptions.workerSrc = pdfjsWorkerLegacy.default;
    }
    window.onload = () => {
      init();
    };
  }, []);
  return (
    <>
      <QueryClientProvider client={queryClient}>
        <RouterProvider router={router} />
        <Toaster style={{ fontFamily: "Inter Variable" }} />
      </QueryClientProvider>
    </>
  );
}
