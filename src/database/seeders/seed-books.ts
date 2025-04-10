import prisma from '@/database/prisma-client';

export default async function main() {
  const list = [
    {
      id: 4,
      name: '1984',
    },
    {
      id: 5,
      name: 'Brave New World',
    },
    {
      id: 3,
      name: 'Dune',
    },
    {
      id: 2,
      name: 'I, Robot',
    },
    {
      id: 1,
      name: "The Hitchhiker's Guide to the Galaxy",
    },
  ];

  for (const book of list) {
    await prisma.book.upsert({
      where: {
        id: book.id,
      },
      update: {},
      create: {
        id: book.id,
        name: book.name,
      },
    });
  }
}
