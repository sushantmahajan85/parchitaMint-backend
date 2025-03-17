import { mintNFT } from "./mint";
import nftsData from "./nfts.json";

const DEFAULT_COLLECTION_ID = process.env.DEFAULT_COLLECTION_ID;

if (!DEFAULT_COLLECTION_ID) {
  throw new Error("DEFAULT_COLLECTION_ID is not set");
}

interface MintByIdRequest {
  nftId: string;
  recipientAddress: string;
}

/**
 * Mint an NFT by its ID from the nfts.json data
 * @param params - Object containing nftId and recipientAddress
 * @returns Promise with the minting result
 */
export async function mintNFTById({
  nftId,
  recipientAddress,
}: MintByIdRequest) {
  try {
    // Get NFT data from nfts.json array
    const nftData = nftsData.find((nft) => nft.id === nftId);

    if (!nftData) {
      return {
        success: false,
        error: `NFT with ID ${nftId} not found`,
      };
    }

    // Prepare mint data
    const mintData = {
      name: nftData.name,
      description: nftData.description,
      image: nftData.fileUrl,
      attributes: [
        {
          trait_type: "Category",
          value: nftData.category,
        },
        ...(nftData.specialTraits || []).map((trait: string) => ({
          trait_type: "Special Trait",
          value: trait,
        })),
      ],
      recipientAddress,
    };
    if (!DEFAULT_COLLECTION_ID) {
      throw new Error("DEFAULT_COLLECTION_ID is not set");
    }

    // Mint the NFT using the default collection
    return await mintNFT(DEFAULT_COLLECTION_ID, mintData);
  } catch (error) {
    console.error("Error minting NFT by ID:", error);
    return {
      success: false,
      error: error instanceof Error ? error.message : "Unknown error occurred",
    };
  }
}

// API route handler
export async function handleMintByIdRequest(req: Request): Promise<Response> {
  if (req.method !== "POST") {
    return Response.json(
      { success: false, error: "Method not allowed" },
      { status: 405 }
    );
  }

  try {
    const body = (await req.json()) as MintByIdRequest;

    if (!body.nftId) {
      return Response.json(
        { success: false, error: "NFT ID is required" },
        { status: 400 }
      );
    }

    if (!body.recipientAddress) {
      return Response.json(
        { success: false, error: "Recipient address is required" },
        { status: 400 }
      );
    }

    const result = await mintNFTById(body);

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
