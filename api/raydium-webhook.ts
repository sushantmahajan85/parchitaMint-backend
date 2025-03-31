import bs58 from "bs58";
import { mintNFT } from "./mint"; // Import the mintNFT function from mint.ts
import nftsData from "./nfts.json"; // Import the NFT data

// Updated Helius webhook payload structure based on the actual data received
interface HeliusTransaction {
  accountData: {
    account: string;
    nativeBalanceChange: number;
    tokenBalanceChanges: any[];
  }[];
  description: string;
  events: any;
  fee: number;
  feePayer: string;
  instructions: {
    accounts: string[];
    data: string;
    innerInstructions: any[];
    programId: string;
  }[];
  nativeTransfers: {
    amount: number;
    fromUserAccount: string;
    toUserAccount: string;
  }[];
  signature: string;
  slot: number;
  source: string;
  timestamp: number;
  tokenTransfers: any[];
  transactionError: any;
  type: string;
}

type HeliusWebhookPayload = HeliusTransaction[];

interface WebhookResponse {
  success: boolean;
  message: string;
  data?: any;
  error?: string;
}

// Memo program ID
const MEMO_PROGRAM_ID = "MemoSq4gqABAXKb96qnH8TysNcWxMyWCqXgDLGmfcHr";
// Legacy Memo program ID (System Program can also be used for memos)
const LEGACY_MEMO_PROGRAM_ID = "Memo1UhkJRfHyvLMcVucJwxXeuD728EqVDDwQDxFMNo";

// Target wallet address that should receive SOL payments
const TARGET_WALLET = "codevLte54E2aQyQ74nDuqr8B2qr39DeNoGxqanXFzq";
const AMM_CONTRACT = "675kPX9MHTjS2zt1qfr1NYHuzeLXfQM9H24wFSUt1Mp8";
const CLMM_CONTRACT = "CAMMCzo5YL8w4VFF8KVHrK22GGUsp5VTaW7grrKgrWqK";
const CPMM_CONTRACT = "CPMMoo8L3F4NbTegBCKVNunggL7H1ZpdTHKxQB5qKP1C";

// Add these interfaces after the existing interfaces
interface TransactionLog {
  signature: string;
  nftId: string | null;
  timestamp: string;
  status: "processing" | "completed" | "failed";
  recipientAddress: string;
  amount: number;
  error?: string;
}

interface TransactionStore {
  transactions: TransactionLog[];
}

// Add these functions before processHeliusWebhook
async function loadTransactionLog(): Promise<TransactionStore> {
  try {
    const data = await Bun.file("transaction-log.json").json();
    return data as TransactionStore;
  } catch {
    return { transactions: [] };
  }
}

async function saveTransactionLog(store: TransactionStore): Promise<void> {
  await Bun.write("transaction-log.json", JSON.stringify(store, null, 2));
}

async function isTransactionProcessed(signature: string): Promise<boolean> {
  const store = await loadTransactionLog();
  return store.transactions.some((tx) => tx.signature === signature);
}

async function logTransaction(log: TransactionLog): Promise<void> {
  const store = await loadTransactionLog();
  store.transactions.push(log);
  await saveTransactionLog(store);
}

/**
 * Decode base58 encoded memo data to extract the NFT ID
 * @param data Base58 encoded memo data
 * @returns Decoded memo string
 */
function decodeMemoData(data: string): string {
  try {
    console.log(`Decoding memo data: ${data}`);
    // For Helius webhook data, we need to decode from base58 to UTF-8
    // Decode the base58 string to a buffer
    const buffer = bs58.decode(data);

    // Convert the buffer to a UTF-8 string
    const decodedString = new TextDecoder("utf-8").decode(buffer);

    console.log(`Decoded memo data: ${decodedString}`);
    return decodedString;
  } catch (error) {
    console.error("Error decoding memo data:", error);
    return "";
  }
}

/**
 * Find NFT data by ID
 * @param nftId - The ID of the NFT to find
 * @returns The NFT data or undefined if not found
 */
function findNFTById(nftId: string) {
  return nftsData.find((nft) => nft.id === nftId);
}

/**
 * Process webhook data from Helius RPC
 * @param payload The webhook payload from Helius
 * @returns Response object with processing results
 */
async function processHeliusWebhook(
  payload: HeliusWebhookPayload
): Promise<WebhookResponse> {
  try {
    console.log(
      "Received webhook data from Helius:",
      JSON.stringify(payload, null, 2)
    );

    let transferTransactions: any = [];
    payload.map((tx) => {
      tx.accountData.map((accountData: any) => {
        if(accountData.account === AMM_CONTRACT) {
          transferTransactions.push(tx);
        }
      })
    });

    return transferTransactions;
    
    // if (transferTransactions.length === 0) {
    //   return {
    //     success: true,
    //     message: "No transfer transactions to process",
    //     data: {
    //       receivedAt: new Date().toISOString(),
    //       processedItems: 0,
    //     },
    //   };
    // }

    // const mintingResults = [];

    // // Process each transfer transaction
    // for (const tx of transferTransactions) {
    //   // Check if transaction was already processed
    //   if (await isTransactionProcessed(tx.signature)) {
    //     console.log(`Transaction ${tx.signature} already processed, skipping`);
    //     continue;
    //   }

    //   // Log transaction as processing
    //   await logTransaction({
    //     signature: tx.signature,
    //     nftId: null, // Will be updated later if NFT ID is found
    //     timestamp: new Date(tx.timestamp * 1000).toISOString(),
    //     status: "processing",
    //     recipientAddress: tx.feePayer,
    //     amount:
    //       tx.nativeTransfers.reduce(
    //         (sum, transfer) => sum + transfer.amount,
    //         0
    //       ) / 1e9,
    //   });

    //   // Extract relevant information
    //   const {
    //     signature,
    //     timestamp,
    //     nativeTransfers,
    //     description,
    //     feePayer,
    //     instructions,
    //   } = tx;

    //   // Convert Solana timestamp to JavaScript Date
    //   const date = new Date(timestamp * 1000);

    //   // Look for memo instructions
    //   const memoInstructions = instructions.filter(
    //     (instruction) =>
    //       instruction.programId === MEMO_PROGRAM_ID ||
    //       instruction.programId === LEGACY_MEMO_PROGRAM_ID
    //   );

    //   // Extract memo data if available
    //   let nftId = null;
    //   if (memoInstructions.length > 0) {
    //     // Get the memo data from the first memo instruction
    //     const memoData = memoInstructions[0].data;
    //     // Decode the memo data to get the NFT ID
    //     const decodedMemo = decodeMemoData(memoData);

    //     // Check if the memo contains an NFT ID
    //     if (decodedMemo) {
    //       nftId = decodedMemo;
    //       console.log(`Found NFT ID in memo: ${nftId}`);
    //     }
    //   }

    //   // Process native SOL transfers
    //   const transfers = nativeTransfers.map((transfer) => {
    //     const solAmount = transfer.amount / 1_000_000_000; // Convert lamports to SOL
    //     return {
    //       from: transfer.fromUserAccount,
    //       to: transfer.toUserAccount,
    //       amount: solAmount, // SOL amount
    //       amountFormatted: `${solAmount} SOL`, // Formatted SOL amount
    //       signature,
    //       timestamp: date.toISOString(),
    //     };
    //   });

    //   // Find transfers to our target wallet
    //   const relevantTransfers = transfers.filter(
    //     (transfer) => transfer.to === TARGET_WALLET
    //   );

    //   // Calculate total SOL received by our target wallet
    //   const totalSolReceived = relevantTransfers.reduce(
    //     (total, transfer) => total + transfer.amount,
    //     0
    //   );

    //   // Get the sender's wallet address (from the first relevant transfer)
    //   const senderWallet =
    //     relevantTransfers.length > 0 ? relevantTransfers[0].from : feePayer; // Fallback to feePayer if no relevant transfer found

      // When processing NFT minting, update the transaction log
    //   if (nftId) {
    //     const result = await mintNow(nftId, senderWallet);

    //     // Update transaction log with final status
    //     await logTransaction({
    //       signature: signature,
    //       nftId: nftId,
    //       timestamp: date.toISOString(),
    //       status: result.success ? "completed" : "failed",
    //       recipientAddress: senderWallet,
    //       amount: totalSolReceived,
    //       error: result.error,
    //     });

    //     mintingResults.push({
    //       signature: signature,
    //       nftId: nftId,
    //       success: result.success,
    //       error: result.error,
    //       data: result.data,
    //     });
    //   }
    // }

    // return {
    //   success: true,
    //   message: "Transfer transactions processed successfully",
    //   data: {
    //     receivedAt: new Date().toISOString(),
    //     processedTransactions: transferTransactions,
    //     transactionsWithNftId: mintingResults.length,
    //     // mintingResults,
    //     count: transferTransactions.length,
    //   },
    // };
  } catch (error) {
    console.error("Error processing webhook data:", error);
    return {
      success: false,
      message: "Failed to process webhook data",
      error: error instanceof Error ? error.message : String(error),
    };
  }
}

/**
 * Handle incoming webhook requests from Helius RPC
 * @param req The incoming request
 * @returns Response to the webhook request
 */
export async function handleRaydiumWebhookRequest(req: Request): Promise<Response> {
  // Only accept POST requests
  if (req.method !== "POST") {
    return new Response(
      JSON.stringify({
        success: false,
        message: "Method not allowed",
      }),
      {
        status: 405,
        headers: {
          "Content-Type": "application/json",
        },
      }
    );
  }

  try {
    // Parse the request body
    const payload = (await req.json()) as HeliusWebhookPayload;

    // Process the webhook data
    const result = await processHeliusWebhook(payload);

    // Return the response
    return Response.json(result, {
      status: result.success ? 200 : 500,
    });
  } catch (error) {
    console.error("Error handling webhook request:", error);

    return Response.json(
      {
        success: false,
        message: "Failed to process webhook request",
        error: error instanceof Error ? error.message : String(error),
      },
      {
        status: 400,
      }
    );
  }
}