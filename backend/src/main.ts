import { AppDataSource } from './database';
import { logger } from './logger';
import { Server } from './server';
import { AuctionService } from './auction.service';

const main = async () => {
  await AppDataSource.initialize();
  const auctionService = await new AuctionService().init();

  const server = new Server(auctionService);

  server.run();
};

main().catch((error) => {
  logger.error('Failed to start server', { error: error.message, stack: error.stack });
  process.exit(1);
});
