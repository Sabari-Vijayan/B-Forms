import { Card, CardContent } from "@/components/ui/card";
import { AlertCircle } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function NotFound() {
  return (
    <div className="min-h-screen w-full flex items-center justify-center bg-gray-50">
      <Card className="w-full max-w-md mx-4">
        <CardContent className="pt-8 text-center">
          <div className="flex justify-center mb-6">
            <div className="p-3 bg-red-50 rounded-full">
              <AlertCircle className="h-10 w-10 text-red-500" />
            </div>
          </div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">404</h1>
          <h2 className="text-xl font-semibold text-gray-700 mb-4">Page Not Found</h2>
          <p className="text-gray-500 mb-8">
            The page you are looking for doesn't exist or has been moved.
          </p>
          <Link href="/">
            <Button className="w-full">
              Return to Dashboard
            </Button>
          </Link>
        </CardContent>
      </Card>
    </div>
  );
}
