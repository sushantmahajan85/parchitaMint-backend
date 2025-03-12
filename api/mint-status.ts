const apiKey = process.env.CROSSMINT_API_KEY;
const subDomain = process.env.SUB_DOMAIN;

if (!apiKey) {
  throw new Error("CROSSMINT_API_KEY is not set");
}
const env = subDomain || "www"; // or "staging"

// Define types for better type safety
interface StatusRequest {
  actionId: string;
}

interface StatusResponse {
  success: boolean;
  data?: any;
  error?: string;
}

/**
 * Check the status of an NFT mint action
 * @param actionId - The ID of the mint action to check
 * @returns Promise with the status result
 */
export async function checkMintStatus({
  actionId,
}: StatusRequest): Promise<StatusResponse> {
  try {
    if (!actionId) {
      return { success: false, error: "Action ID is required" };
    }

    const url = `https://${env}.crossmint.com/api/2022-06-09/actions/${actionId}`;
    const options = {
      method: "GET",
      headers: { "X-API-KEY": apiKey as string },
    };

    // Make the API call
    const response = await fetch(url, options);
    const data = await response.json();

    if (!response.ok) {
      return {
        success: false,
        error: data.message || "Failed to check mint status",
        data,
      };
    }

    return { success: true, data };
  } catch (error) {
    console.error("Error checking mint status:", error);
    return {
      success: false,
      error: error instanceof Error ? error.message : "Unknown error occurred",
    };
  }
}

// Handler for API requests
export async function handleStatusRequest(req: Request): Promise<Response> {
  console.log("handleStatusRequest");
  // Only allow POST requests
  if (req.method !== "POST") {
    return Response.json(
      { success: false, error: "Method not allowed" },
      { status: 405 }
    );
  }

  // Process the request
  try {
    const body = (await req.json()) as StatusRequest;
    const result = await checkMintStatus(body);

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
  fetch: handleStatusRequest,
};
