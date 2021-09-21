import { Keypair } from "stellar-base";
import { Server } from "stellar-sdk";
const server = new Server("https://horizon.stellar.org");

export type AccountDetails = {
  accountId: string;
  balances: Array<{
    balance: string;
    assetCode: string;
    assetIssuer?: string;
  }>;
};

export async function getAccountDetails(keypair: Keypair): Promise<AccountDetails> {
  const account = await server.loadAccount(keypair.publicKey());
  console.log(account);
  const balances = account.balances.map((x) => {
    return {
      balance: x.balance,
      assetCode: x.asset_type === "native" ? "XLM" : x.asset_code,
      assetIssuer: x.asset_type === "native" ? "Native" : x.asset_issuer
    };
  });
  const accountId = account.id;
  return { accountId, balances };
}
