import { getCurrentUser } from "@/lib/auth";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ProfileForm } from "@/components/dashboard/profile-form";
import { GradientAvatar } from "@/components/shared/gradient-avatar";

export const dynamic = "force-dynamic";

export default async function ProfilePage() {
  const user = (await getCurrentUser())!;

  return (
    <div className="mx-auto max-w-3xl space-y-6">
      <div className="flex items-center gap-4">
        <GradientAvatar name={user.name} className="size-16" textClassName="text-lg" />
        <div>
          <h2 className="text-2xl font-semibold">{user.artistName || user.name}</h2>
          <p className="text-muted-foreground">{user.email}</p>
        </div>
      </div>

      <Card className="border-border">
        <CardHeader>
          <CardTitle>Profile settings</CardTitle>
          <CardDescription>Keep your details up to date so we can reach you about campaigns.</CardDescription>
        </CardHeader>
        <CardContent>
          <ProfileForm
            user={{
              name: user.name,
              artistName: user.artistName,
              email: user.email,
              phone: user.phone,
              genre: user.genre,
            }}
          />
        </CardContent>
      </Card>
    </div>
  );
}
