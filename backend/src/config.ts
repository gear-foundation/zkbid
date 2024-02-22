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
    programMetadata: getEnv('PROGRAM_METADATA', '00020000000100000000010400000000000000000105000000e503280008447a6b5f6269645f61756374696f6e5f696f0c4269640000080118616d6f756e740401107531323800011470726f6f6608011c5665633c75383e0000040000050700080000020c000c00000503001000000500001408447a6b5f6269645f61756374696f6e5f696f3041756374696f6e53746174650000080110626964731801505665633c284163746f7249642c2075313238293e00012c686967686573745f626964040110753132380000180000021c001c000004082004002010106773746418636f6d6d6f6e287072696d6974697665731c4163746f724964000004002401205b75383b2033325d000024000003200000000c00')
  },
};
