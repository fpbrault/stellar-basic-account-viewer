import { Keypair } from "stellar-base";
import { Server } from "stellar-sdk";
const server = new Server("https://horizon.stellar.org");

export type AccountDetails = {
  accountId: string;
  createdAt?: string;
  createdBy?: string;
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
  let createdAt;
  let createdBy;

  await server
    .transactions()
    .forAccount(accountId)
    .order("asc")
    .limit(1)
    .call()
    .then(function (r) {
      console.log(r);
      createdAt = r.records[0].created_at;
      createdBy = r.records[0].source_account;
    });

  return { accountId, createdAt, createdBy, balances };
}
