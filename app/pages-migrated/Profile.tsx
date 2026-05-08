import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { useGetMe, useUpdateMe } from "@/hooks/api";
import { User, Mail, Shield, Loader2 } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { toast } from "sonner";

export default function Profile() {
  const { data: user } = useGetMe();
  const updateMe = useUpdateMe();
  const [newPassword, setNewPassword] = useState("");
  const [isUpdating, setIsUpdating] = useState(false);

  if (!user) return null;

  const handleUpdatePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newPassword || newPassword.length < 6) {
      toast.error("Password must be at least 6 characters");
      return;
    }

    setIsUpdating(true);
    try {
      await updateMe.mutateAsync({
        data: { password: newPassword },
      });
      toast.success("Password updated successfully");
      setNewPassword("");
    } catch (err: any) {
      const msg = err?.data?.error ?? err?.message ?? "Failed to update password";
      toast.error(msg);
    } finally {
      setIsUpdating(false);
    }
  };

  return (
    <DashboardLayout>
      <div className="space-y-8">
        <div>
          <h1 className="text-3xl font-semibold tracking-tight">Profile Settings</h1>
          <p className="text-muted-foreground mt-1">
            Manage your account settings and profile details.
          </p>
        </div>

        <div className="grid gap-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <User className="w-5 h-5" />
                Account Information
              </CardTitle>
              <CardDescription>
                Your basic account details.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid gap-2">
                <Label htmlFor="email">Email Address</Label>
                <div className="flex gap-2">
                  <div className="relative flex-1">
                    <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                    <Input 
                      id="email" 
                      value={user.email} 
                      disabled 
                      className="pl-9 bg-muted"
                    />
                  </div>
                  <Button variant="outline" disabled title="Email updates are managed via Support">Change</Button>
                </div>
                <p className="text-xs text-muted-foreground">
                  Your email address is used for sign-in and notifications.
                </p>
              </div>

              <div className="grid gap-2">
                <Label htmlFor="id">User ID</Label>
                <div className="relative">
                  <Shield className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                  <Input 
                    id="id" 
                    value={user.id} 
                    disabled 
                    className="pl-9 bg-muted font-mono text-[10px]"
                  />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Shield className="w-5 h-5" />
                Security
              </CardTitle>
              <CardDescription>
                Update your password and secure your account.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleUpdatePassword} className="space-y-4">
                <div className="grid gap-2">
                  <Label htmlFor="new-password">New Password</Label>
                  <Input 
                    id="new-password" 
                    type="password" 
                    placeholder="••••••••" 
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    required
                    minLength={6}
                  />
                </div>
                <Button type="submit" disabled={isUpdating} className="w-fit">
                  {isUpdating && <Loader2 className="w-4 h-4 animate-spin mr-2" />}
                  Update Password
                </Button>
              </form>
            </CardContent>
          </Card>

          <Card className="border-destructive/20 bg-destructive/5">
            <CardHeader>
              <CardTitle className="text-destructive">Danger Zone</CardTitle>
              <CardDescription>
                Permanently delete your account and all your forms. This action cannot be undone.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Button variant="destructive" disabled title="Please contact support to delete your account">Delete Account</Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </DashboardLayout>
  );
}

