import { Keypair } from "stellar-base";
import { Server } from "stellar-sdk";
const server = new Server("https://horizon.stellar.org");

export type AccountDetails =
  | {
      isError: false;
      accountId: string;
      createdAt: string;
      createdBy: string;
      balances: Array<{
        balance: string;
        assetCode: string;
        assetIssuer?: string;
      }>;
    }
  | {
      isError: true;
      error: any;
    };

export async function getAccountDetails(
  keypair: Keypair
): Promise<AccountDetails> {
  const account = await server.loadAccount(keypair.publicKey());
  console.log(account);
  return account;
}
