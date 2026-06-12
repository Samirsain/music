import { getCurrentUser } from "@/lib/auth";
import { AppShell } from "@/components/dashboard/app-shell";

export default async function DashboardLayout({ children }: { children: React.ReactNode }) {
  // Guaranteed non-null by the parent (app) layout guard
  const user = (await getCurrentUser())!;

  return (
    <AppShell variant="dashboard" user={{ name: user.name, email: user.email, role: user.role }}>
      {children}
    </AppShell>
  );
}
