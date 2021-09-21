import albedo from "@albedo-link/intent";
import { verifyMessageSignature } from "@albedo-link/signature-verification";
import crypto from "crypto";
import { Keypair } from "stellar-base";
import freighter from "@stellar/freighter-api";

declare global {
  interface Window {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    rabet: any;
  }
}

export async function albedoWallet(): Promise<Keypair> {
  const token = crypto.randomBytes(48).toString("hex");
  const result = await albedo.publicKey({
    token: token
  });

  const isValid = verifyMessageSignature(result.pubkey, token, result.signature);
  if (!isValid) {
    throw new Error("Albedo message signature is not valid");
  }
  return Keypair.fromPublicKey(result.pubkey);
}

export async function freighterWallet(): Promise<Keypair> {
  const isInstalled = await freighter.isConnected();

  if (!isInstalled) {
    throw new Error("Freighter is not installed");
  }

  const retrievePublicKey = async () => {
    let publicKey = "";
    let error = "";

    try {
      publicKey = await freighter.getPublicKey();
    } catch (e) {
      throw new Error("Cannot retrieve public key");
    }

    if (error) {
      return error;
    }

    return publicKey;
  };
  const result = await retrievePublicKey();

  return Keypair.fromPublicKey(result);
}

export async function rabetWallet(): Promise<Keypair> {
  const rabet = window.rabet || {};

  if (!window.rabet) {
    console.error("Rabet is not installed");
    throw new Error("Rabet is not installed");
  }

  const result = await rabet.connect();
  return Keypair.fromPublicKey(result.publicKey);
}
