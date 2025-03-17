const apiKey = process.env.EZMINT_API_KEY;
const subDomain = process.env.SUB_DOMAIN;

if (!apiKey) {
  throw new Error("EZMINT_API_KEY is not set");
}
const env = subDomain || "devnet"; // or "mainnet"

// Define types for better type safety
interface Attribute {
  trait_type: string;
  value: string;
}

interface MintRequest {
  name: string;
  description: string;
  image: string;
  attributes: Attribute[];
  recipientAddress: string;
}

interface MintResponse {
  success: boolean;
  data?: any;
  error?: string;
}

/**
 * Mint an NFT to the specified wallet address
 * @param collectionId - The ID of the collection to mint to
 * @param mintData - The NFT data to mint
 * @returns Promise with the minting result
 */
export async function mintNFT(
  collectionId: string,
  mintData: MintRequest
): Promise<MintResponse> {
  try {
    // Validate inputs
    if (!mintData.recipientAddress) {
      return { success: false, error: "Recipient address is required" };
    }

    if (!mintData.name) {
      return { success: false, error: "Name is required" };
    }

    if (!mintData.image) {
      return { success: false, error: "Image URL is required" };
    }

    // Prepare the API request
    const url = `https://ezmint.xyz/api/${env}/collections/${collectionId}/mint`;
    const options = {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-api-key": apiKey!,
      },
      body: JSON.stringify(mintData),
    };

    // Make the API call
    const response = await fetch(url, options);
    const data = await response.json();

    if (!response.ok) {
      return {
        success: false,
        error: data?.message || "Failed to mint NFT",
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

  // Get collection ID from URL
  const url = new URL(req.url);
  const pathParts = url.pathname.split("/");
  const collectionId = pathParts[pathParts.length - 2]; // Assuming URL pattern .../collections/{collectionId}/mint

  if (!collectionId) {
    return Response.json(
      { success: false, error: "Collection ID is required" },
      { status: 400 }
    );
  }

  // Process the request
  try {
    const body = (await req.json()) as MintRequest;
    const result = await mintNFT(collectionId, body);

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
