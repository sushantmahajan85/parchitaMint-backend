# Parchita NFT Minting Server

A Bun server for minting NFTs on the Solana blockchain using EZMINT's API.

## Project Overview

This project provides a simple API server that interfaces with EZMINT's API for NFT operations. It uses:

- [Bun](https://bun.sh) as the JavaScript/TypeScript runtime
- [EZMINT API](https://ezmint.xyz) as the underlying NFT service
- TypeScript for type safety

## Features

- RESTful API for minting NFTs
- Solana blockchain integration via EZMINT

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

### Create a Collection

**Endpoint:** `POST /api/create-collection`

**Request Body:**

```json
{
  "name": "BATMAN",
  "symbol": "BAT",
  "description": "I am Batman",
  "image": "https://example.com/batman.png",
  "website": "https://batman.com",
  "x": "https://x.com/batman",
  "discord": "https://discord.gg/batman",
  "telegram": "https://t.me/batman",
  "medium": "https://medium.com/batman",
  "github": "https://github.com/batman"
}
```

**Response:**

```json
{
  "success": true,
  "data": {
    // Collection data
  }
}
```

### Mint an NFT

**Endpoint:** `POST /api/collections/{collectionId}/mint`

**Request Body:**

```json
{
  "name": "The Joker",
  "description": "The Joker is a unique NFT in my collection with special attributes",
  "image": "https://example.com/joker.png",
  "attributes": [
    {
      "trait_type": "Background",
      "value": "Purple"
    },
    {
      "trait_type": "Eyes",
      "value": "Red"
    },
    {
      "trait_type": "Species",
      "value": "Human"
    },
    {
      "trait_type": "Rarity",
      "value": "Legendary"
    }
  ],
  "recipientAddress": "your_solana_wallet_address"
}
```

**Response:**

```json
{
  "success": true,
  "data": {
    // Minting data
  }
}
```

## Testing with cURL

### Create a Collection

```bash
curl -X POST \
  'http://localhost:3000/api/create-collection' \
  -H 'Content-Type: application/json' \
  -d '{
    "name": "BATMAN",
    "symbol": "BAT",
    "description": "I am Batman",
    "image": "https://example.com/batman.png",
    "website": "https://batman.com",
    "x": "https://x.com/batman",
    "discord": "https://discord.gg/batman"
  }'
```

### Mint an NFT

```bash
curl -X POST \
  'http://localhost:3000/api/collections/{collectionId}/mint' \
  -H 'Content-Type: application/json' \
  -d '{
    "name": "The Joker",
    "description": "The Joker is a unique NFT",
    "image": "https://example.com/joker.png",
    "attributes": [
      {
        "trait_type": "Background",
        "value": "Purple"
      }
    ],
    "recipientAddress": "your_solana_wallet_address"
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
- `api/create-collection.ts` - Endpoint to create a new NFT collection

## Environment Variables

Create a `.env` file in the root directory with the following variables:

```
EZMINT_API_KEY="your_ezmint_api_key"
SUB_DOMAIN="mainnet"  # Use "mainnet" for production or "devnet" for testing
DEFAULT_COLLECTION_ID="your_default_collection_id"  # Default collection ID for webhook minting
```

- `EZMINT_API_KEY`: Your API key from EZMINT
- `SUB_DOMAIN`: The environment to use for EZMINT API calls (use "mainnet" for production or "devnet" for testing)
- `DEFAULT_COLLECTION_ID`: The default collection ID to use when minting NFTs through the webhook endpoint

## License

This project was created using `bun init`
