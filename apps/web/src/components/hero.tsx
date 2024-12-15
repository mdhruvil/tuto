import { ArrowRightIcon } from "lucide-react";
import { buttonVariants } from "./ui/button";

export function Hero() {
  return (
    <div className="h-screen flex items-center justify-center">
      <div className="mx-auto max-w-[38rem] text-pretty text-center">
        <h1 className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
          Chat with your knowledge base
        </h1>
        <p className="mt-6 text-gray-600">
          Transform your documents into interactive conversations. Upload your
          PDFs and start asking questions naturally - get instant, accurate
          answers with source references.
        </p>
        <div className="mt-10 flex items-center justify-center gap-x-6">
          <a href="/auth/sign-in" className={buttonVariants()}>
            Get started
            <ArrowRightIcon className="ml-2 size-4" />
          </a>
        </div>
      </div>
    </div>
  );
}

export default Hero;
