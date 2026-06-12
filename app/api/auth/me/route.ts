import { prisma } from "@/lib/db";
import { handle, requireUser } from "@/lib/api";
import { profileSchema } from "@/lib/validators";

export async function GET() {
  return handle(async () => {
    const user = await requireUser();
    const { passwordHash: _ph, ...safe } = user;
    void _ph;
    return safe;
  });
}

export async function PATCH(req: Request) {
  return handle(async () => {
    const user = await requireUser();
    const body = profileSchema.parse(await req.json());
    const updated = await prisma.user.update({
      where: { id: user.id },
      data: {
        name: body.name,
        artistName: body.artistName || null,
        genre: body.genre || null,
        phone: body.phone || null,
      },
    });
    const { passwordHash: _ph, ...safe } = updated;
    void _ph;
    return safe;
  });
}
