import { prisma } from "@/lib/db";
import { createSession, hashPassword } from "@/lib/auth";
import { signupSchema } from "@/lib/validators";
import { ApiError, handle } from "@/lib/api";

export async function POST(req: Request) {
  return handle(async () => {
    const body = signupSchema.parse(await req.json());

    const existing = await prisma.user.findUnique({ where: { email: body.email.toLowerCase() } });
    if (existing) throw new ApiError("An account with this email already exists", 409);

    const user = await prisma.user.create({
      data: {
        name: body.name,
        artistName: body.artistName || null,
        email: body.email.toLowerCase(),
        passwordHash: await hashPassword(body.password),
        genre: body.genre || null,
        phone: body.phone || null,
      },
    });

    await createSession(user);
    return { id: user.id, name: user.name, role: user.role };
  });
}
