import { HexString, decodeAddress } from '@gear-js/api';
import express, { Express, Request, Response } from 'express';
import cors from 'cors';
import { AuctionService } from './auction.service';
import config from './config';
import { logger } from './logger';

const app = express();

export class Server {
  private _app: Express;

  constructor(private _auctionService: AuctionService) {
    this._app = express();
    this._app.use(express.json());
    this._app.use(cors());
    this._app.use((req, res, next) => {
      let id = Math.random().toString(36).substring(7);
      logger.info(req.method + ' ' + req.path, { id, body: req.body, params: req.params });
      res.once('finish', () => {
        logger.info(req.method + ' ' + req.path + ' response', { id, status: res.statusCode });
      });
      return next();
    });
    this._app.post('/api/register/:account', this.registerBidder.bind(this));
    this._app.get('/api/query/:account', this.queryBidder.bind(this));
    this._app.get('/api/program-id', this.getProgramId.bind(this));
  }

  async registerBidder(req: Request, res: Response) {
    if (!req.params.account) {
      return res.status(400).json({ error: 'Invalid request' });
    }

    let address: HexString;
    try {
      address = decodeAddress(req.params.account);
    } catch (error) {
      return res.status(400).json({ error: 'Invalid account address' });
    }

    const program = config.app.auctionProgram;

    const bidder = await this._auctionService.getBidder(address);

    const duration = config.app.voucherDuration;
    const amount = config.app.voucherAmount;

    if (!bidder) {
      try {
        const voucherId = await this._auctionService.issue(address, program, amount, duration);
        return res.json({ voucherId });
      } catch (error) {
        logger.error('Failed to issue voucher', { error: error.message });
        return res.status(500).json({ error: error.message });
      }
    }

    try {
      if (bidder.programs.includes(program)) {
        await this._auctionService.update(bidder, amount, duration);
      } else {
        await this._auctionService.update(bidder, amount, duration, [program]);
      }
      return res.json({ voucherId: bidder.voucherId });
    } catch (error) {
      logger.error('Failed to update voucher', { error: error.message });
      return res.status(500).json({ error: error.message });
    }
  }

  async queryBidder(req: Request, res: Response) {
    if (!req.params.account) {
      return res.status(400).json({ error: 'Invalid request' });
    }

    let address: HexString;
    try {
      address = decodeAddress(req.params.account);
    } catch (error) {
      return res.status(400).json({ error: 'Invalid account address' });
    }

    const bidder = await this._auctionService.getBidder(address);

    if (!bidder) {
      return res.status(404).json({ error: "Bidder with this account id does not exist" });
    }

    return res.status(200).json({ voucherId: bidder.voucherId });
  }

  async getProgramId(req: Request, res: Response) {
    return res.status(200).json({ programId: config.app.auctionProgram });
  }

  run() {
    this._app.listen(3000, () => {
      logger.info('Server is running on port 3000');
    });
  }
}
