const apiKey = process.env.EZMINT_API_KEY;
const subDomain = process.env.SUB_DOMAIN;
if (!apiKey) {
  throw new Error("EZMINT_API_KEY is not set");
}
const env = subDomain || "devnet"; // or "mainnet"

// Define types for better type safety
interface CreateCollectionRequest {
  name: string;
  symbol: string;
  description: string;
  image: string;
  website?: string;
  x?: string;
  discord?: string;
  telegram?: string;
  medium?: string;
  github?: string;
}

interface CreateCollectionResponse {
  success: boolean;
  data?: any;
  error?: string;
}

/**
 * Create a new collection on EZMINT
 * @param collectionData - The collection data to create
 * @returns Promise with the creation result
 */
export async function createCollection(
  collectionData: CreateCollectionRequest
): Promise<CreateCollectionResponse> {
  try {
    // Validate inputs
    if (!collectionData.name) {
      return { success: false, error: "Collection name is required" };
    }

    if (!collectionData.symbol) {
      return { success: false, error: "Symbol is required" };
    }

    if (!collectionData.image) {
      return { success: false, error: "Image URL is required" };
    }

    if (!collectionData.description) {
      return { success: false, error: "Description is required" };
    }

    // Prepare the API request
    const url = `https://ezmint.xyz/api/${env}/collections`;
    const options = {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-api-key": apiKey!,
      },
      body: JSON.stringify(collectionData),
    };

    // Make the API call
    const response = await fetch(url, options);
    const data = await response.json();

    if (!response.ok) {
      return {
        success: false,
        error: data.message || "Failed to create collection",
        data,
      };
    }

    return { success: true, data };
  } catch (error) {
    console.error("Error creating collection:", error);
    return {
      success: false,
      error: error instanceof Error ? error.message : "Unknown error occurred",
    };
  }
}

// Handler for API requests
export async function handleCreateCollectionRequest(
  req: Request
): Promise<Response> {
  // Only allow POST requests
  if (req.method !== "POST") {
    return Response.json(
      { success: false, error: "Method not allowed" },
      { status: 405 }
    );
  }

  // Process the request
  try {
    const body = (await req.json()) as CreateCollectionRequest;
    const result = await createCollection(body);

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
  fetch: handleCreateCollectionRequest,
};
