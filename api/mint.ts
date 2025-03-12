const apiKey = process.env.CROSSMINT_API_KEY;
const subDomain = process.env.SUB_DOMAIN;

if (!apiKey) {
  throw new Error("CROSSMINT_API_KEY is not set");
}
const chain = "solana"; // or "polygon-amoy", "ethereum-sepolia", ...
const env = subDomain || "www"; // or "www"

// Import the NFT data
import nftsData from "./nfts.json";

// Define types for better type safety
interface MintRequest {
  walletAddress: string;
  nftId: string;
  collectionId?: string; // Optional collection ID
}

interface MintResponse {
  success: boolean;
  data?: any;
  error?: string;
}

interface NFTData {
  id: string;
  name: string;
  fileName: string;
  description: string;
  specialTraits: string[];
  category: string;
  fileUrl: string;
}

/**
 * Find NFT data by ID
 * @param nftId - The ID of the NFT to find
 * @returns The NFT data or undefined if not found
 */
function findNFTById(nftId: string): NFTData | undefined {
  return nftsData.find((nft) => nft.id === nftId);
}

/**
 * Mint an NFT to the specified wallet address
 * @param walletAddress - The recipient's wallet address
 * @param nftId - The ID of the NFT to mint
 * @param collectionId - Optional ID of the collection to mint to (defaults to "default-solana")
 * @returns Promise with the minting result
 */
export async function mintNFT({
  walletAddress,
  nftId,
  collectionId = "a0a30de7-b755-4025-8c25-3a2bfa29e03d", // Default to "default-solana" collection
}: MintRequest): Promise<MintResponse> {
  try {
    // Validate inputs
    if (!walletAddress) {
      return { success: false, error: "Wallet address is required" };
    }

    if (!nftId) {
      return { success: false, error: "NFT ID is required" };
    }

    // Find the NFT data
    const nftData = findNFTById(nftId);
    if (!nftData) {
      return { success: false, error: `NFT with ID ${nftId} not found` };
    }

    // Format the recipient address for Solana
    const recipientAddress = `solana:${walletAddress}`;

    // Prepare the API request with the specified collection
    const url = `https://${env}.crossmint.com/api/2022-06-09/collections/${collectionId}/nfts`;
    const options = {
      method: "POST",
      headers: {
        accept: "application/json",
        "content-type": "application/json",
        "x-api-key": apiKey as string,
      },
      body: JSON.stringify({
        recipient: recipientAddress,
        metadata: {
          name: nftData.name,
          image: nftData.fileUrl, // Update with your actual image URL
          description: nftData.description,
          attributes: [
            {
              trait_type: "Category",
              value: nftData.category,
            },
            ...nftData.specialTraits.map((trait) => ({
              trait_type: "Special Trait",
              value: trait,
            })),
          ],
        },
        compressed: true,
        reuploadLinkedFiles: true,
      }),
    };

    // Make the API call
    const response = await fetch(url, options);
    const data = await response.json();

    if (!response.ok) {
      return {
        success: false,
        error: data.message || "Failed to mint NFT",
        data,
      };
    }

    return { success: true, data };
  } catch (error) {
    console.error("Error minting NFT:", error);
    return {
      success: false,
      error: error instanceof Error ? error.message : "Unknown error occurred",
    };
  }
}

// Handler for API requests
export async function handleMintRequest(req: Request): Promise<Response> {
  // Only allow POST requests
  if (req.method !== "POST") {
    return Response.json(
      { success: false, error: "Method not allowed" },
      { status: 405 }
    );
  }

  // Process the request
  try {
    const body = (await req.json()) as MintRequest;
    const result = await mintNFT(body);

    if (!result.success) {
      return Response.json(result, { status: 400 });
    }

    return Response.json(result);
  } catch (error) {
    return Response.json(
      { success: false, error: "Invalid request body" },
      { status: 400 }
    );
  }
}

// Default export for Bun to use as an API endpoint
export default {
  fetch: handleMintRequest,
};
