import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { AlertTriangle, Home } from "lucide-react";

function NotFound() {
  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <Card className="w-full max-w-md">
        <CardContent className="pt-6">
          <div className="text-center space-y-6">
            <div className="flex justify-center">
              <AlertTriangle className="w-16 h-16 text-muted-foreground/50" />
            </div>

            <div className="space-y-2">
              <h1 className="text-3xl font-bold">404</h1>
              <h2 className="text-xl font-semibold text-muted-foreground">
                Page Not Found
              </h2>
              <p className="text-muted-foreground/75">
                The page you're looking for doesn't exist or has been moved.
              </p>
            </div>

            <Button asChild className="gap-2">
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
