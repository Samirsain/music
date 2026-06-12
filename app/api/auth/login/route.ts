import { prisma } from "@/lib/db";
import { createSession, verifyPassword } from "@/lib/auth";
import { loginSchema } from "@/lib/validators";
import { ApiError, handle } from "@/lib/api";

export async function POST(req: Request) {
  return handle(async () => {
    const body = loginSchema.parse(await req.json());

    const user = await prisma.user.findUnique({ where: { email: body.email.toLowerCase() } });
    if (!user || !(await verifyPassword(body.password, user.passwordHash))) {
      throw new ApiError("Invalid email or password", 401);
    }

    await createSession(user);
    return { id: user.id, name: user.name, role: user.role };
  });
}
