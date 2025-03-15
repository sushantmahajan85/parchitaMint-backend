import {
  Connection,
  Keypair,
  PublicKey,
  Transaction,
  LAMPORTS_PER_SOL,
  TransactionInstruction,
  sendAndConfirmTransaction,
  SystemProgram,
} from "@solana/web3.js";
import * as fs from "fs";
import * as path from "path";
import * as os from "os";

// Load keypair from filesystem
const keypairPath = path.resolve(os.homedir(), ".config/solana/id.json");
console.log(`Loading keypair from: ${keypairPath}`);
const secretKey = Uint8Array.from(
  JSON.parse(fs.readFileSync(keypairPath, "utf-8"))
);
const feePayer = Keypair.fromSecretKey(secretKey);
console.log(`Using keypair with public key: ${feePayer.publicKey.toString()}`);

const connection = new Connection("https://api.devnet.solana.com", "confirmed");

// No need to airdrop if using an existing wallet that already has funds
// Uncomment if you still need to airdrop
/*
const airdropSignature = await connection.requestAirdrop(
  feePayer.publicKey,
  LAMPORTS_PER_SOL
);

await connection.confirmTransaction({
  signature: airdropSignature,
  blockhash: (await connection.getLatestBlockhash()).blockhash,
  lastValidBlockHeight: (
    await connection.getLatestBlockhash()
  ).lastValidBlockHeight,
});
*/

// Define recipient address - replace with the actual recipient address
const recipientAddress = new PublicKey(
  "codevLte54E2aQyQ74nDuqr8B2qr39DeNoGxqanXFzq"
);

// Create a transaction with both a memo instruction and a SOL transfer
const transaction = new Transaction();

// Add memo instruction
transaction.add(
  new TransactionInstruction({
    keys: [{ pubkey: feePayer.publicKey, isSigner: true, isWritable: true }],
    data: Buffer.from("parchita-astronaut", "utf-8"),
    programId: new PublicKey("MemoSq4gqABAXKb96qnH8TysNcWxMyWCqXgDLGmfcHr"),
  })
);

// Add SOL transfer instruction (0.1 SOL)
transaction.add(
  SystemProgram.transfer({
    fromPubkey: feePayer.publicKey,
    toPubkey: recipientAddress,
    lamports: 0.1 * LAMPORTS_PER_SOL, // 0.1 SOL in lamports
  })
);

// Get recent blockhash
const { blockhash, lastValidBlockHeight } =
  await connection.getLatestBlockhash();
transaction.recentBlockhash = blockhash;
transaction.feePayer = feePayer.publicKey;

// Send and confirm transaction
const signature = await sendAndConfirmTransaction(connection, transaction, [
  feePayer,
]);
console.log(`Transaction sent with signature: ${signature}`);
console.log(
  `Sent 0.1 SOL to ${recipientAddress.toString()} with memo "parchita-astronaut"`
);
