import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ROLE_CONFIG } from "@/constants/enums";
import { useAuthStore } from "@/stores/auth-store";
import { Navigate } from "react-router";

const ProfilePage = () => {
  const data = useAuthStore();

  if (!data.isAuthenticated) return <Navigate to="/sign-in" replace />;

  const user = data.user;

  const roleConfig = ROLE_CONFIG[user.role];
  const RoleIcon = roleConfig.icon;

  return (
    <div className="mx-auto max-w-2xl space-y-6">
      <div>
        <h1 className="font-heading text-2xl font-bold">Profile</h1>
        <p className="text-sm text-muted-foreground">
          View your account information.
        </p>
      </div>

      <Card>
        <CardHeader>
          <div className="flex items-center gap-4">
            {user.image ? (
              <img
                src={user.image}
                alt={user.name}
                className="size-16 rounded-full"
              />
            ) : (
              <div className="flex size-16 items-center justify-center rounded-full bg-muted text-xl font-bold">
                {user.name.charAt(0).toUpperCase()}
              </div>
            )}
            <div>
              <CardTitle className="text-lg">{user.name}</CardTitle>
              <p className="text-sm text-muted-foreground">{user.email}</p>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex items-center justify-between border-b pb-3">
              <span className="text-sm text-muted-foreground">Role</span>
              <Badge variant={roleConfig.badgeVariant}>
                <RoleIcon className="size-3" />
                {roleConfig.label}
              </Badge>
            </div>
            <div className="flex items-center justify-between border-b pb-3">
              <span className="text-sm text-muted-foreground">
                Email Verified
              </span>
              <Badge variant={user.emailVerified ? "default" : "secondary"}>
                {user.emailVerified ? "Verified" : "Not Verified"}
              </Badge>
            </div>
            <div className="flex items-center justify-between border-b pb-3">
              <span className="text-sm text-muted-foreground">
                Account Status
              </span>
              <Badge variant={user.isActive ? "default" : "destructive"}>
                {user.isActive ? "Active" : "Inactive"}
              </Badge>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-muted-foreground">
                Member Since
              </span>
              <span className="text-sm">
                {new Date(user.createdAt).toLocaleDateString()}
              </span>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default ProfilePage;
