
import { PropsWithChildren } from "react";
import { Header } from "./header";
import { ErrorBoundary } from "@/components/ui/error-boundary";

export function Layout({ children }: PropsWithChildren) {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      <ErrorBoundary>
        <main className="flex-1">
          <div className="container mx-auto py-6">
            {children}
          </div>
        </main>
      </ErrorBoundary>
    </div>
  );
}
