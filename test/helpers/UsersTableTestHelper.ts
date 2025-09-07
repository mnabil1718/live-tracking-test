/* istanbul ignore file */
import { PrismaService } from 'src/Infrastructures/database/prisma/prisma.service';

export const UsersTableTestHelper = (prisma: PrismaService) => ({
  async addUser({
    id = 'user-123',
    username = 'dicoding',
    password = 'secret',
    fullname = 'Dicoding Indonesia',
  }) {
    await prisma.user.create({
      data: { id, username, password, fullname },
    });
  },

  async findUsersById(id: string) {
    return prisma.user.findMany({
      where: { id },
    });
  },

  async cleanTable() {
    await prisma.user.deleteMany();
  },
});
