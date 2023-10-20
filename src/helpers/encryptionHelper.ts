export const generateKeyPair = async (password: string) => {
  const crypto = new SubtleCrypto();
  const keyPair = await crypto.generateKey(
    {
      name: "RSA-OAEP",
      modulusLength: 4096,
      publicExponent: new Uint8Array([1, 0, 1]),
      hash: "SHA-256",
    },
    true,
    ["encrypt", "decrypt"]
  );
  // const publicKey = await crypto.exportKey("jwk", keyPair.publicKey);
  // const privateKey = await crypto.wrapKey("pkcs8",keyPair.privateKey,password, );
};
