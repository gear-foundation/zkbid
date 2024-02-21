import type { NextApiRequest, NextApiResponse } from 'next'
import { checkAddress } from '@polkadot/util-crypto'

type RequestData = {
  address: string
}

type ResponseData = {
  voucher?: string,
  message: string,
}
 
export default function handler(
  req: NextApiRequest,
  res: NextApiResponse<ResponseData>,
) {
  const { address } = req.query;

  if (typeof address !== 'string') {
    res.status(400).json({ message: 'Invalid address' });
    return;
  }

  let [ok, msg] = checkAddress(address as string, 137);
  if (!ok) {
    res.status(400).json({ message: msg! });
    return;
  }

  if (req.method === 'POST') {
    // Handle the POST request
    // You can access the address with the address variable

    // After handling the request, send a response with res.status().json()
    res.status(200).json({ message: `User at address ${address} registered successfully`, voucher: '123456'});
  } else {
    // Handle any other HTTP method
    res.setHeader('Allow', ['POST']);
    res.status(405).json({ message: `Method ${req.method} is not allowed` });
  }
}
