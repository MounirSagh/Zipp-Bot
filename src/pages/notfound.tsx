import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { AlertTriangle, Home } from "lucide-react";

function NotFound() {
  return (
    <div className="min-h-screen bg-black flex items-center justify-center p-4">
      <Card className="w-full max-w-md bg-white/5 backdrop-blur-xl border-white/10">
        <CardContent className="pt-6">
          <div className="text-center space-y-6">
            <div className="flex justify-center">
              <AlertTriangle className="w-16 h-16 text-gray-400/50" />
            </div>

            <div className="space-y-2">
              <h1 className="text-3xl font-bold text-white">404</h1>
              <h2 className="text-xl font-semibold text-gray-400">
                Page Not Found
              </h2>
              <p className="text-gray-500">
                The page you're looking for doesn't exist or has been moved.
              </p>
            </div>

            <Button
              asChild
              className="gap-2 bg-white/10 hover:bg-white/20 text-white border border-white/20"
            >
              <a href="/">
                <Home className="w-4 h-4" />
                Go Home
              </a>
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

export default NotFound;
