/* eslint-disable @next/next/no-img-element */
import React, { useState } from "react";
import * as wallet from "../lib/wallet";
import * as account from "../lib/account";
import Image from "next/image";
import { Keypair } from "stellar-base";
import { AccountDetails } from "../lib/account";

type WalletProps = {
  keypair?: Keypair;
};

export const Wallet: React.FC<WalletProps> = () => {
  const [keypair, setKeypair] = useState<Keypair>();
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
          <div className="shadow-2xl max-w-6xl min-h-screen w-full mx-auto bg-base-200">
            <h1 className="mb-5 text-3xl sm:text-5xl font-bold text-center pt-8">
              Stellar Account Viewer
            </h1>
            <div className="flex justify-center pt-4 mx-2">
              <div className="flex items-center flex-col flex-wrap w-full mx-auto text-left">
                {!keypair ? (
                  <div className="flex flex-col gap-2 max-w-sm w-full">
                    <button
                      className="btn btn-primary btn-outline btn-block"
                      onClick={() => wallet.albedoWallet().then((keypair) => connected(keypair))}>
                      <span className="flex flex-col items-end">
                        <Image
                          alt="albedo-logo"
                          src="/images/albedo.svg"
                          width={24}
                          height={24}></Image>
                      </span>
                      Connect with Albedo
                    </button>
                    <button
                      className="btn btn-primary btn-outline btn-block"
                      onClick={() => wallet.rabetWallet().then((keypair) => connected(keypair))}>
                      <div className="flex flex-col justify-around">
                        <Image
                          alt="rabet-logo"
                          src="/images/rabet.svg"
                          width={24}
                          height={24}></Image>
                      </div>
                      Connect with Rabet
                    </button>
                    <button
                      className="btn btn-primary btn-outline btn-block"
                      onClick={() =>
                        wallet.freighterWallet().then((keypair) => connected(keypair))
                      }>
                      <div className="flex flex-col justify-around">
                        <Image
                          alt="freighter-logo"
                          src="/images/freighter.svg"
                          width={24}
                          height={24}></Image>
                      </div>
                      Connect with Freighter
                    </button>
                  </div>
                ) : (
                  <button
                    className="btn btn-primary"
                    onClick={() => {
                      setKeypair(undefined);
                      setAccountDetails(undefined);
                    }}>
                    Log Out
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-6 w-6 ml-1"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor">
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"
                      />
                    </svg>
                  </button>
                )}
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
                          </div>

                          {asset.assetLogo ? (
                            <div className="stat-figure text-primary">
                              <img
                                width="32px"
                                height="32px"
                                alt={asset.assetCode + "-asset-logo"}
                                src={asset.assetLogo}></img>
                            </div>
                          ) : null}
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
