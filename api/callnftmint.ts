import { mintNFTById } from "./mint-by-id"; // Replace with actual file name

async function mintParchitaNFT() {
  const nftId = "parchita-mermaid";
  const recipientAddress = "6rAKkowi3d6BUtFV1DxyDxNQE75nkZdfJhhPswdXAJL6";

  try {
    const result = await mintNFTById({ nftId, recipientAddress });
    console.log("Mint Result:", result);
  } catch (error) {
    console.error("Error minting NFT:", error);
  }
}

mintParchitaNFT();
