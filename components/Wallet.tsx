/* eslint-disable @next/next/no-img-element */
import React, { useState } from "react";
import * as wallet from "../lib/wallet";
import * as account from "../lib/account";
import Image from "next/image";
import { Keypair } from "stellar-base";
import { AccountDetails } from "../lib/account";
import useAsyncEffect from "use-async-effect";

type WalletProps = {
  keypair?: Keypair;
};

export const Wallet: React.FC<WalletProps> = () => {
  const [keypair, setKeypair] = useState<Keypair>();
  const [accountDetails, setAccountDetails] = useState<AccountDetails>();
  const [rabet, setRabet] = useState<boolean>();
  const [freighter, setFreighter] = useState<boolean>();

  useAsyncEffect(async () => {
    async function checkRabet() {
      let rabet = wallet.RabetWallet.available();
      setRabet(rabet);
    }
    async function checkFreighter() {
      let freighter = await wallet.FreighterWallet.available();
      setFreighter(freighter);
    }
    setTimeout(checkRabet, 150);
    setTimeout(checkFreighter, 150);
  }, [rabet, freighter]);

  const connected = async (keypair: Keypair) => {
    setKeypair(keypair);
    let details = await account.getAccountDetails(keypair);
    setAccountDetails(details);
  };

  return (
    <div className="flex flex-col text-neutral bg-base-content">
      <div className="min-h-screen pt-0 ">
        <div className="flex flex-col justify-center w-full ">
          <div className="w-full max-w-6xl min-h-screen mx-auto shadow-2xl bg-base-200">
            <h1 className="pt-8 mb-5 text-3xl font-bold text-center sm:text-5xl">
              Stellar Account Viewer
            </h1>
            <div className="flex justify-center pt-4 mx-2">
              <div className="flex flex-col flex-wrap items-center w-full mx-auto text-left">
                {!keypair ? (
                  <div className="flex flex-col w-full max-w-sm gap-2">
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
                    {rabet ? (
                      <>
                        <button
                          className="btn btn-primary btn-outline btn-block"
                          onClick={() => {
                            wallet.RabetWallet.connectWallet().then((keypair) =>
                              connected(keypair)
                            );
                          }}>
                          <div className="flex flex-col justify-around">
                            <Image
                              alt="rabet-logo"
                              src="/images/rabet.svg"
                              width={24}
                              height={24}></Image>
                          </div>
                          Connect with Rabet
                        </button>
                      </>
                    ) : (
                      <div
                        data-tip="Rabet Wallet is not installed or is unavailable"
                        className="tooltip tooltip-primary">
                        <button className="btn btn-disabled btn-block">
                          <div className="flex flex-col justify-around">
                            <Image
                              alt="rabet-logo"
                              src="/images/rabet.svg"
                              width={24}
                              height={24}></Image>
                          </div>
                          Connect with Rabet
                        </button>
                      </div>
                    )}
                    {freighter ? (
                      <>
                        <button
                          className="btn btn-primary btn-outline btn-block"
                          onClick={() =>
                            wallet.FreighterWallet.connectWallet().then((keypair) =>
                              connected(keypair)
                            )
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
                      </>
                    ) : (
                      <div
                        data-tip="Freighter Wallet is not installed or is unavailable"
                        className="tooltip tooltip-primary">
                        <button className="btn btn-disabled btn-block">
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
                    )}
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
                      className="w-6 h-6 ml-1"
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
                    <div className="flex flex-col pb-2">
                      <span className="text-base-content">Account ID: </span>
                      <a
                        target="_blank"
                        rel="noopener noreferrer"
                        href={
                          "https://stellar.expert/explorer/public/account/" +
                          accountDetails?.accountId
                        }>
                        <span className="inline-block p-1 text-xs break-all transition-colors shadow text-primary-content lg:break-normal rounded-xl bg-primary hover:bg-primary-content hover:text-primary">
                          {accountDetails?.accountId}{" "}
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            className="inline-block w-4 h-4 align-top"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor">
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth="2"
                              d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"
                            />
                          </svg>
                        </span>
                      </a>
                    </div>
                    <div className="flex flex-col pb-2">
                      <span className="text-base-content">Parent Account Id: </span>
                      <a
                        target="_blank"
                        rel="noopener noreferrer"
                        href={
                          "https://stellar.expert/explorer/public/account/" +
                          accountDetails?.createdBy
                        }>
                        <span className="inline-block p-1 text-xs break-all transition-colors shadow text-primary-content lg:break-normal rounded-xl bg-primary hover:bg-primary-content hover:text-primary">
                          {accountDetails?.createdBy}{" "}
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            className="inline-block w-4 h-4 align-top"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor">
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth="2"
                              d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"
                            />
                          </svg>
                        </span>
                      </a>
                    </div>
                    <div className="flex flex-col pb-2">
                      <span className="text-base-content">Creation Date: </span>
                      <span className="badge badge-primary">{accountDetails?.createdAt}</span>
                    </div>
                  </div>
                ) : null}
                <div className="flex flex-row flex-wrap justify-center max-w-screen-xl gap-2 py-4 mx-auto stats ">
                  {accountDetails?.balances
                    ? accountDetails.balances.map((asset) => (
                        <div key={asset.assetCode} className="max-w-xs shadow-lg stat ">
                          <div className="font-bold stat-title hover:text-primary">
                            <a
                              target="_blank"
                              rel="noopener noreferrer"
                              href={
                                "https://stellar.expert/explorer/public/asset/" +
                                asset.assetCode +
                                "-" +
                                asset.assetIssuer
                              }>
                              {asset.assetCode}
                              <svg
                                xmlns="http://www.w3.org/2000/svg"
                                className="inline w-4 h-4 align-text-top"
                                fill="none"
                                viewBox="0 0 24 24"
                                stroke="currentColor">
                                <path
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                  strokeWidth="2"
                                  d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"
                                />
                              </svg>
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
                          <div className="truncate stat-value">{asset.balance}</div>
                          <div className="truncate stat-desc text-2xs text-primary">
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
