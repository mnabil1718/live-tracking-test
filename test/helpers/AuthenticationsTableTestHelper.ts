/* istanbul ignore file */
import { PrismaService } from 'src/Infrastructures/database/prisma/prisma.service';

export const AuthenticationsTableTestHelper = (prisma: PrismaService) => ({
  async addToken(token: string) {
    await prisma.authentication.create({
      data: { token },
    });
  },

  async findToken(token: string) {
    return prisma.authentication.findMany({
      where: { token },
      select: { token: true },
    });
  },

  async cleanTable() {
    await prisma.authentication.deleteMany();
  },
});
