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
    assetLogo?: string;
  }>;
};

// fix this
interface ABC {
  a: string;
  b: string;
  c: string;
}

export async function getAccountDetails(keypair: Keypair): Promise<AccountDetails> {
  const account = await server.loadAccount(keypair.publicKey());

  const assetMetadata: { key: string; assetCode: string; assetLogo: string }[] = [];
  const assets = account.balances.map((x) => {
    return x.asset_type === "native"
      ? "asset[]=XLM"
      : "asset[]=" + x.asset_code + "-" + x.asset_issuer;
  });

  function foo(abc: ABC) {
    for (const [key, value] of Object.entries(abc)) {
      assetMetadata.push({
        key: key,
        assetCode: value.name.slice(0, -2),
        assetLogo: value.toml_info?.image
      });
    }
  }

  await fetch("https://api.stellar.expert/explorer/public/asset/meta?" + assets.join("&"))
    .then((res) => res.json())
    .then((json) => {
      foo(json._embedded.records);
    });

  const balances = account.balances.map((x) => {
    return {
      balance: x.balance,
      assetCode: x.asset_type === "native" ? "XLM" : x.asset_code,
      assetIssuer: x.asset_type === "native" ? "Native" : x.asset_issuer,
      assetLogo:
        x.asset_type === "native"
          ? "https://stellar.expert/img/vendor/stellar.svg"
          : assetMetadata.find((e) => e.assetCode === x.asset_code + "-" + x.asset_issuer)
              ?.assetLogo
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
      createdAt = r.records[0].created_at;
      createdBy = r.records[0].source_account;
    });

  return { accountId, createdAt, createdBy, balances };
}
