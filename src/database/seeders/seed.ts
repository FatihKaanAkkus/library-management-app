import prisma from '@/database/prisma-client';
import seedBooks from './seed-books';
import seedUsers from './seed-users';

async function main() {
  await seedBooks();
  await seedUsers();
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });
