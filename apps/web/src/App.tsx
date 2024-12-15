import { Toaster } from "@/components/ui/sonner";
import { AuthLayout } from "@/routes/auth/layout";
import { SignIn } from "@/routes/auth/sign-in";
import { SignUp } from "@/routes/auth/sign-up";
import { QueryClientProvider } from "@tanstack/react-query";
import { createBrowserRouter, RouterProvider } from "react-router";
import { AuthGuard } from "./components/auth-guard";
import { queryClient } from "./lib/query-client";
import { KnowledgeBase } from "./routes/dashboard/[knowLedgebaseId]";
import { KnowledgeBases } from "./routes/dashboard/knowledge-bases";
import { DashboardLayout } from "./routes/dashboard/layout";
import { useEffect } from "react";

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
      const pdfjsWorker = await import(
        "pdfjs-dist/legacy/build/pdf.worker.mjs?url"
      );
      pdfjs.GlobalWorkerOptions.workerSrc = pdfjsWorker.default;
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
