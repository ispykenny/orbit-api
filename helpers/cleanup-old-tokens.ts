import { prismaDB } from './prisma';

export const cleanupOldTokens = async () => {
  try {
    const tokensDeleted = await prismaDB.token.deleteMany({
      where: {
        createdAt: { lt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 365) },
      },
    });
    console.log(`Deleted ${tokensDeleted.count} tokens`);
  } catch (error) {
    console.log(error, 'error deleting tokens');
  }
};

cleanupOldTokens();
