# Parchita NFT Minting Server

A Bun server for minting NFTs on the Solana blockchain using Crossmint's API.

## Project Overview

This project provides a simple API for minting NFTs from a predefined collection. It uses:

- [Bun](https://bun.sh) as the JavaScript/TypeScript runtime
- [Crossmint API](https://docs.crossmint.com/) for minting NFTs on Solana
- TypeScript for type safety

## Features

- RESTful API for minting NFTs
- Predefined collection of NFTs with metadata
- Solana blockchain integration via Crossmint

## Installation

To install dependencies:

```bash
bun install
```

## Running the Server

To start the server:

```bash
bun run index.ts
```

The server will start on port 3000 by default.

## API Endpoints

### Mint an NFT

**Endpoint:** `POST /api/mint`

**Request Body:**

```json
{
  "walletAddress": "your_solana_wallet_address",
  "nftId": "nft_id_from_collection"
}
```

**Example:**

```json
{
  "walletAddress": "jkzJUkj7tU9pExVFJABFSQSRV2Jtx8EUJjnqzK1tiSB",
  "nftId": "parchita-astronaut"
}
```

**Response:**

```json
{
  "success": true,
  "data": {
    "id": "mint_id",
    "status": "pending"
    // Additional data from Crossmint
  }
}
```

### Check Mint Status

**Endpoint:** `POST /api/mint-status`

**Request Body:**

```json
{
  "actionId": "your_mint_action_id"
}
```

**Example:**

```json
{
  "actionId": "72ba0ac9-b435-49b8-a58d-5efbb55ab885"
}
```

**Response:**

```json
{
  "success": true,
  "data": {
    "id": "72ba0ac9-b435-49b8-a58d-5efbb55ab885",
    "status": "completed"
    // Additional status information from Crossmint
  }
}
```

## Testing with cURL

You can test the API using cURL:

```bash
curl --request POST \
  --url http://localhost:3000/api/mint \
  --header 'Content-Type: application/json' \
  --data '{
    "walletAddress": "jkzJUkj7tU9pExVFJABFSQSRV2Jtx8EUJjnqzK1tiSB",
    "nftId": "parchita-astronaut"
  }'
```

### Check Mint Status with cURL

```bash
curl --request POST \
  --url http://localhost:3000/api/mint-status \
  --header 'Content-Type: application/json' \
  --data '{
    "actionId": "72ba0ac9-b435-49b8-a58d-5efbb55ab885"
  }'
```

## Available NFTs

The server includes a collection of NFTs with various categories. Each NFT ID is based on its filename (without extension):

### Adventures & Exploration

- `parchita-astronaut` - Parchita Astronaut
- `parchita-adventurer` - Parchita Adventurer
- `parchita-pirate` - Parchita Pirate
- `parchita-tourist-dubai` - Parchita Tourist in Dubai
- `parchita-burj-khalifa` - Parchita in Front of Burj Khalifa
- `parchita-captain` - Parchita Captain
- `parchita-cosmic` - Parchita Cosmic

### Sports & Action

- `parchita-footballer` - Parchita Footballer
- `parchita-boxer` - Parchita Boxer
- `parchita-runner` - Parchita Runner
- `parchita-fitness` - Parchita Fitness
- `parchita-flow` - Parchita Flow

### Technology and Future

- `parchita-gamer` - Parchita Gamer
- `parchita-robot` - Parchita Robot
- `parchita-hack` - Parchita Hack

### Music & Arts

- `parchita-dj` - Parchita DJ
- `parchita-rockstar` - Parchita Rock Star
- `parchita-artist` - Parchita Artist
- `parchita-fiestera` - Parchita Fiestera
- `parchita-disco` - Parchita Disco

### Business & Leadership

- `parchita-visionary` - Parchita Visionary
- `parchita-entrepreneur` - Parchita Entrepreneur
- `parchita-influencer` - Parchita Influencer
- `parchita-millionaire` - Parchita Millionaire
- `parchita-diplomat` - Parchita Diplomat
- `parchita-aviator` - Parchita Aviator
- `parchita-majesty` - Parchita Majesty
- `crypto-parchita` - Crypto Parchita

### Culture & Traditions

- `parchita-emirati` - Parchita Emirati
- `parchita-emirati-woman` - Parchita Emirati Woman
- `parchita-aloha` - Parchita Aloha

### Spirituality & Wisdom

- `parchita-mystic` - Parchita Mystic
- `parchita-spiritual-warrior` - Parchita Spiritual Warrior
- `parchita-enlightened` - Parchita Enlightened
- `parchita-yogi` - Parchita Yogi
- `parchi-sleep` - ParchiSleep

### Gastronomy & Lifestyle

- `parchita-gourmet-chef` - Parchita Gourmet Chef

### Fantasy & Mystery

- `parchita-vampire` - Parchita Vampire
- `parchita-mermaid` - Parchita Mermaid
- `parchita-arcane` - Parchita Arcane

### Stories from de Street

- `parchita-detective` - Parchita Detective
- `parchita-prisoner` - Parchita Prisoner
- `parchita-ratera` - Parchita Ratera
- `parchita-urban` - Parchita Urban
- `parchita-boss` - Parchita Boss

### Luxury & Design

- `parchita-model` - Parchita Model
- `parchita-designer` - Parchita Designer
- `parchita-glam` - Parchita Glam

### Exotic & Summer Vibes

- `tropical-parchita` - Tropical Parchita
- `blooming-parchita` - Blooming Parchita

## Project Structure

- `index.ts` - Main server file
- `api/mint.ts` - NFT minting endpoint
- `api/mint-status.ts` - Endpoint to check mint status
- `api/create-collection.ts` - Endpoint to create a new NFT collection
- `api/nfts.json` - Collection of NFT metadata

## Environment Variables

Create a `.env` file in the root directory with the following variables:

```
CROSSMINT_API_KEY="your_crossmint_api_key"
SUB_DOMAIN="www"  # Use "www" for production or "staging" for testing
```

- `CROSSMINT_API_KEY`: Your API key from Crossmint
- `SUB_DOMAIN`: The subdomain to use for Crossmint API calls (use "www" for production or "staging" for testing)

## Creating a Collection

Before minting NFTs, you need to create a collection on the Solana blockchain. This can be done using the create-collection endpoint:

**Endpoint:** `POST /api/create-collection`

**Request Body:**

```json
{
  "name": "Parchita NFT Collection",
  "description": "A collection of unique Parchita NFTs on Solana",
  "symbol": "PARCHITA"
}
```

**Response:**

```json
{
  "success": true,
  "data": {
    "id": "collection_id",
    "status": "pending",
    "collection": {
      "name": "Parchita NFT Collection",
      "description": "A collection of unique Parchita NFTs on Solana",
      "symbol": "PARCHITA"
    }
  }
}
```

After creating a collection, you can use the collection ID when minting NFTs to ensure they belong to the same collection.

## License

This project was created using `bun init` in bun v1.1.42. [Bun](https://bun.sh) is a fast all-in-one JavaScript runtime.
