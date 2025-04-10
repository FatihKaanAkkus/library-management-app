import prisma from '@/database/prisma-client';

export default async function main() {
  const list = [
    {
      id: 2,
      name: 'Enes Faruk Meniz',
    },
    {
      id: 1,
      name: 'Eray Aslan',
    },
    {
      id: 4,
      name: 'Kadir Mutlu',
    },
    {
      id: 3,
      name: 'Sefa Eren Şahin',
    },
  ];

  for (const user of list) {
    await prisma.user.upsert({
      where: {
        id: user.id,
      },
      update: {},
      create: {
        id: user.id,
        name: user.name,
      },
    });
  }
}
