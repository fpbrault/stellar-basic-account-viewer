import React, { useState } from "react";
import * as wallet from "../lib/wallet";
import Image from "next/image";
import * as account from "../lib/account";
import { Keypair } from "stellar-base";
import { AccountDetails } from "../lib/account";

type WalletProps = {
  keypair?: Keypair;
};

export const Wallet: React.FC<WalletProps> = () => {
  const [, setKeypair] = useState<Keypair>();
  const [accountDetails, setAccountDetails] = useState<AccountDetails>();

  const connected = async (keypair: Keypair) => {
    setKeypair(keypair);
    let details = await account.getAccountDetails(keypair);
    setAccountDetails(details);
  };

  return (
    <div className="flex flex-col text-neutral bg-base-content">
      <div className="min-h-screen pt-0">
        <div className="flex flex-col justify-center w-full ">
          <div className="text-center shadow-2xl max-w-6xl min-h-screen w-full mx-auto bg-base-200">
            <h1 className="mb-5 text-3xl sm:text-5xl font-bold text-center pt-8">
              Stellar Account Viewer
            </h1>
            <div className="flex justify-center pt-4 mx-2">
              <div className="flex items-center flex-col flex-wrap w-full mx-auto">
                <div>
                  <button
                    className="btn btn-primary"
                    onClick={() => wallet.albedoWallet().then((keypair) => connected(keypair))}>
                    Connect with Albedo
                  </button>
                </div>
                {accountDetails ? (
                  <div className="my-2">
                    <div className="pb-2 flex flex-col">
                      <span className="text-base-content">Account ID: </span>
                      <a
                        target="_blank"
                        rel="noopener noreferrer"
                        href={
                          "https://stellar.expert/explorer/public/account/" +
                          accountDetails?.accountId
                        }>
                        <span className="text-primary-content break-all lg:break-normal rounded bg-primary shadow p-1 text-xs hover:bg-primary-content hover:text-primary transition-colors">
                          {accountDetails?.accountId}
                        </span>{" "}
                      </a>
                    </div>
                    <div className="pb-2 flex flex-col">
                      <span className="text-base-content">Parent Account Id: </span>
                      <a
                        target="_blank"
                        rel="noopener noreferrer"
                        href={
                          "https://stellar.expert/explorer/public/account/" +
                          accountDetails?.createdBy
                        }>
                        <span className="text-primary-content break-all lg:break-normal rounded bg-primary shadow p-1 text-xs hover:bg-primary-content hover:text-primary transition-colors">
                          {accountDetails?.createdBy}
                        </span>
                      </a>
                    </div>
                    <div className="pb-2 flex flex-col">
                      <span className="text-base-content">Creation Date: </span>
                      <span className="text-primary-content break-all lg:break-normal rounded bg-primary shadow p-1 text-xs">
                        {accountDetails?.createdAt}
                      </span>
                    </div>
                  </div>
                ) : null}
                {/*               <div>
                <span className="text-base-content">Parent Account ID: </span>
                <span className="badge badge-primary my-1">
                  {accountDetails?.sponsor}
                </span>
              </div> */}
                {/* <div className="grid grid-cols-2 gap-2 mx-auto">
                <div className="card bordered my-2 shadow-2xl bg-primary max-w-lg w-full text-base-content">
                  <div className="card-body">
                    <div className="card-title">Keypair:</div>
                    <div className="overflow-auto max-h-64 bg-base-100 rounded-lg border-2 p-1">
                      <pre>{JSON.stringify(keypair, null, 2)}</pre>
                    </div>
                  </div>
                </div>
                <div className="card bordered my-2 shadow-2xl bg-primary max-w-lg w-full text-base-content">
                  <div className="card-body">
                    <div className="card-title">Account Details:</div>
                    <div className="overflow-auto max-h-64 bg-base-100 rounded-lg border-2 p-1">
                      <pre>{JSON.stringify(accountDetails, null, 2)}</pre>
                    </div>
                  </div>
                </div>
              </div> */}
                <div className="flex justify-center flex-wrap flex-row stats gap-2 max-w-screen-xl mx-auto py-4 ">
                  {accountDetails?.balances
                    ? accountDetails.balances.map((asset) => (
                        <div key={asset.assetCode} className="shadow-lg stat max-w-xs ">
                          <div className="stat-title font-bold hover:text-primary">
                            <a
                              target="_blank"
                              rel="noopener noreferrer"
                              href={
                                "https://stellar.expert/explorer/public/asset/" +
                                asset.assetCode +
                                "-" +
                                asset.assetIssuer
                              }>
                              {asset.assetCode}{" "}
                            </a>
                            <Image
                              width={16}
                              height={16}
                              alt={asset.assetCode + "-asset-logo"}
                              src="https://stellar.expert/img/vendor/stellar.svg"></Image>
                          </div>

                          <div className="stat-value truncate">{asset.balance}</div>
                          <div className="stat-desc text-xs truncate text-primary">
                            {asset.assetIssuer}
                          </div>
                        </div>
                      ))
                    : null}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
