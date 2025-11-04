import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Home } from "lucide-react";

const NotFound = () => {
  return (
    <div className="flex min-h-screen items-center justify-center bg-background p-4">
      <div className="text-center space-y-6 animate-fade-in">
        <div className="space-y-2">
          <h1 className="text-8xl font-bold text-primary">404</h1>
          <h2 className="text-2xl font-semibold text-foreground">Page not found</h2>
          <p className="text-muted-foreground max-w-md mx-auto">
            The page you're looking for doesn't exist or has been moved.
          </p>
        </div>
        <div className="flex gap-4 justify-center">
          <Link to="/">
            <Button className="gap-2">
              <Home className="h-4 w-4" />
              Return Home
            </Button>
          </Link>
          <Link to="/properties">
            <Button variant="outline">
              Browse Properties
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default NotFound;
