import { getSession } from "@/lib/auth";
import { Navbar } from "@/components/site/navbar";

export async function SiteHeader() {
  const session = await getSession();
  return <Navbar session={session ? { name: session.name, role: session.role } : null} />;
}
