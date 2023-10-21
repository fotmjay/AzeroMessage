import * as nacl_factory from "js-nacl";

export const generateKeyPair = async (password: string) => {
  const keys = { encryptedPrivateKey: "", publicKey: "" };
  await nacl_factory.instantiate(function (nacl) {
    const pswBin = nacl.encode_utf8(password);
    // Create deterministic keys to encrypt secret from password
    const encryptionKeys = nacl.crypto_box_seed_keypair(pswBin);
    // Create random pair for this user
    const validKeys = nacl.crypto_box_keypair();
    //@ts-ignore
    const encryptedSecret = nacl.crypto_box_seal(validKeys.boxSk, encryptionKeys.boxPk);
    // store encryptedSecret + validKeys.boxPk
    // Secret key used for decryption of messages sent will be derived from encryptedSecret
    // As to ensure the database doesn't have the unencrypted secret key.
    keys.encryptedPrivateKey = nacl.to_hex(encryptedSecret);
    keys.publicKey = nacl.to_hex(validKeys.boxPk);
  });
  return keys;
};

export const encryptMessageWithPublicKey = async (publicKey: string, message: string) => {
  let encryptedMessage = "";
  try {
    await nacl_factory.instantiate(function (nacl) {
      const messageBin = nacl.encode_utf8(message);
      const pubKey = nacl.from_hex(publicKey);
      //@ts-ignore
      const encMessage = nacl.crypto_box_seal(messageBin, pubKey);
      encryptedMessage = nacl.to_hex(encMessage);
    });
  } catch (err) {
    console.error(err);
  }
  return encryptedMessage;
};

export const decryptMessageWithEncryptedPrivateKey = async (
  encryptedMessage: string,
  encryptedPrivateKey: string,
  publicKey: string,
  password: string
) => {
  let decryptedMessage = "";
  try {
    await nacl_factory.instantiate(async function (nacl) {
      const pswBin = nacl.encode_utf8(password);
      const encMsg = nacl.from_hex(encryptedMessage);
      const encPrivKey = nacl.from_hex(encryptedPrivateKey);
      const pubKey = nacl.from_hex(publicKey);
      // Generate private / public key from password
      const decryptionKeys = nacl.crypto_box_seed_keypair(pswBin);
      // Decrypt private key from encrypted priv key and password
      //@ts-ignore
      const unencryptedPrivKey = nacl.crypto_box_seal_open(encPrivKey, decryptionKeys.boxPk, decryptionKeys.boxSk);
      // Decrypt enc message using unencrypted priv key
      //@ts-ignore
      const unencryptedMessage = nacl.crypto_box_seal_open(encMsg, pubKey, unencryptedPrivKey);
      decryptedMessage = nacl.decode_utf8(unencryptedMessage);
    });
  } catch (err) {
    console.error(err);
  }
  return decryptedMessage;
};
