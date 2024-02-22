import assert from 'assert';
import dotenv from 'dotenv';

dotenv.config();

function getEnv(envName: string, defaultValue?: string): string {
  const env = process.env[envName] || defaultValue;

  assert.notStrictEqual(env, undefined, `Environment variable ${envName} is not set`);

  return env as string;
}

export default {
  db: {
    port: Number(getEnv('DB_PORT', '5432')),
    host: getEnv('DB_HOST', 'localhost'),
    user: getEnv('DB_USER', 'postgres'),
    password: getEnv('DB_PASSWORD', 'postgres'),
    database: getEnv('DB_DATABASE', 'postgres'),
  },
  gear: {
    node: getEnv('GEAR_NODE', 'ws://localhost:9944'),
    seed: getEnv('ACCOUNT_SEED', '//Alice'),
  },
  app: {
    auctionProgram: getEnv('AUCTION_PROGRAM', '0xd34dacf935bb3677389f8f8fd58d26b89836edfb355f105618071ef8a47506cd') as `0x{string}`,
    voucherAmount: Number(getEnv('VOUCHER_AMOUNT', '100')),
    voucherDuration: Number(getEnv('VOUCHER_DURATION', '30000')),
  },
};
