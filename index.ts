import { handleMintRequest } from "./api/mint";
import { handleStatusRequest } from "./api/mint-status";
import { handleCreateCollectionRequest } from "./api/create-collection";
import { handleWebhookRequest } from "./api/webhook";

const server = Bun.serve({
  port: 3000,
  fetch(req) {
    const url = new URL(req.url);

    // Handle different routes
    if (url.pathname === "/") {
      return new Response("Welcome to the Bun server!");
    }

    if (url.pathname === "/api") {
      return Response.json({
        message: "This is a JSON response from the API endpoint",
        timestamp: new Date().toISOString(),
      });
    }

    console.log("url.pathname", url.pathname);

    if (url.pathname === "/api/mint-status") {
      console.log("mintstatus");
      return handleStatusRequest(req);
    }

    // Handle the mint endpoint
    if (url.pathname === "/api/mint") {
      return handleMintRequest(req);
    }

    // Handle the create collection endpoint
    if (url.pathname === "/api/create-collection") {
      return handleCreateCollectionRequest(req);
    }

    // Handle the Helius webhook endpoint
    if (url.pathname === "/api/webhook") {
      return handleWebhookRequest(req);
    }

    // Handle 404 for unknown routes
    return new Response("Not Found", { status: 404 });
  },
});

console.log(`Server running at http://localhost:${server.port}`);
