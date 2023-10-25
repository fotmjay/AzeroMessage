# Azero Message

Azero Message is an app that runs on top of the Aleph Zero blockchain. It consists of 3 parts: [front-end](https://github.com/fotmjay/AzeroMessage) (TypeScript React), [back-end](https://github.com/fotmjay/AzeroMessageBackend) (TypeScript) and [smart-contract](https://github.com/fotmjay/AzeroMessageSC) (ink!).

The app allows to message any address (or AzeroID domain) on the blockchain through the use of a smart-contract. The event is emitted and the message is saved in the blockchain. It is then picked up by an indexer and placed inside a database. Retrieving messages going to (or leaving from) an address is as simple as searching the address.

The app also allows the creation of asymetric key pairs to allow encryption of messages using someone's generated public key, which can only be decrypted by their associated private key. The asymetric keypair is separate from the crypto wallet's of the user (view Appendix for more details).

### Encryption and Decryption

Once created, the encrypted private key aswell as the public key are stored in the database and secured by a user-chosen password. Note that all the cryptography happens in the client (using js-nacl). The database does not see or receive the user's password, or non-encrypted decryption private key.

Once the user wants to decrypt a received message, they need to prove ownership of their wallet. The database then sends the encrypted private key along with the public key associated with their address, and the user then enters their password on the client side to decrypt messages (also all happens on client-side).

# Installation

Considering this is split in 3 repos, you will need to separately clone and install.

In 2 different directories, clone the repos:

```
git clone https://github.com/fotmjay/AzeroMessage
cd AzeroMessage
npm install

git clone https://github.com/fotmjay/AzeroMessageBackend
cd AzeroMessageBackend
npm install
```

You may use the already deployed smart-contract on the Aleph Zero main net at `5HBYqDMzTQFTux4Nx2Lez9ruuuFUrzdMsmkXAUcNJBpUpHx9`.

If you decide to redeploy it, I suggest using [useInk's guide](https://use.ink/getting-started/deploy-your-contract/).

You may clone the smart-contract using

```
git clone https://github.com/fotmjay/AzeroMessageSC
```

### Back-End

Full list of API commands available in the [backend readme](https://github.com/fotmjay/AzeroMessageBackend).

The database is currently hosted on MongoDB (NoSQL). The .env file will be missing when you clone the repo.

Create it in `./src/config/.env`:

```
DB_STRING=YOUR_MONGODB_STRING_HERE
SUBSCAN_API_KEY=YOUR_SUBSCAN_API_KEY_HERE
```

If you redeployed the smart-contract, you will also need to update the contract address in `./src/constants/constants.ts`.

Once done, use: `npm run dev`.

### Front-End

Make sure you modify the API endpoint for your backend access located in `./src/constants/apiendpoint.ts`.

If you decide to redeploy the smart-contract, make sure you update the contract address in `./src/constants/constants.ts`

You will also need to update the metadata import file located at `./src/assets/azero_message.json`

Once done, use: `npm run dev`.

# Issues When Cloning

- Database only fetches the last 100 interactions with the smart-contract. If the smart-contract has been used a lot without database update (or if you are catching up from a new database), it will necessitate a change in code.
- Database also only fetches the current smart-contract, which means anytime the contract address changes, a manual update of the transactions passed to the old contract will be necessary.

# Known bugs and improvements needed

## Improvements needed

- How to use/enable encryption is not clear enough for users.
- Need to make the loop between proving ownership of wallet / decrypting messages more seemless.
- Error and confirmations management needs work.
- A lot of parts are split between PolkadotJS and useInk API's, should commit to one instead of going from one to the other.
- State sharing is cumbersome and needs to be reorganized.
- Should use an event indexer (or make one) instead of relying on Subscan API.
- General clean up.

## Bugs

- "ENCRYPTED" sometimes does not show up to hide the encrypted text (whilst still encrypted, text is shown instead).
- Address while sometimes evaluate to "not valid" even though it is. Need to make a change in the address and back for it to register properly.
- Balance does not instantly update after making a transaction.
- RPC Decoration warning shows up in console on every refresh.

## Appendix

Note that I am not a cyber security expert or cryptographer but my research led me to: "One key, one job". You shouldn't use your wallet signing key to decrypt messages and vice-versa. Additionnally, due to encryption/decryption not being exposed on the various wallet extensions API, there was no way to safely use the private key to decrypt messages (for obvious security reasons).
