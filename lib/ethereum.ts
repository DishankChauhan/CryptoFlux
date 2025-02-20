import { ethers, TransactionResponse } from 'ethers';

// Create Alchemy provider
const ALCHEMY_SEPOLIA_URL = `https://eth-sepolia.g.alchemy.com/v2/${process.env.NEXT_PUBLIC_ALCHEMY_API_KEY}`;
const ALCHEMY_SEPOLIA_WS = `wss://eth-sepolia.g.alchemy.com/v2/${process.env.NEXT_PUBLIC_ALCHEMY_API_KEY}`;

// HTTP Provider for regular RPC calls
export const provider = new ethers.JsonRpcProvider(ALCHEMY_SEPOLIA_URL);

// WebSocket Provider for real-time updates
export const wsProvider = new ethers.WebSocketProvider(ALCHEMY_SEPOLIA_WS);

// Helper function to create a wallet instance
export const createWallet = (privateKey: string) => {
  return new ethers.Wallet(privateKey, provider);
};

// Helper function to format ETH amount
export const formatEth = (amount: string | null | undefined) => {
  if (!amount) return '0';
  try {
    return ethers.formatEther(amount);
  } catch (error) {
    console.error('Error formatting ETH:', error);
    return '0';
  }
};

// Helper function to parse ETH amount
export const parseEth = (amount: string) => {
  try {
    return ethers.parseEther(amount || '0');
  } catch (error) {
    console.error('Error parsing ETH:', error);
    return ethers.parseEther('0');
  }
};

// Helper function to get transaction URL on Etherscan
export const getEtherscanUrl = (hash: string) => {
  return `https://sepolia.etherscan.io/tx/${hash}`;
};

// Set up WebSocket listeners for transaction updates
export const setupTransactionListener = (
  callback: (txHash: string, status: 'confirmed' | 'failed') => void
) => {
  wsProvider.on('block', async (blockNumber) => {
    const block = await provider.getBlock(blockNumber, true);
    if (!block || !block.transactions) return;

    for (const tx of block.transactions as unknown as TransactionResponse[]) {
      if (typeof tx === 'string') continue;
      const receipt = await provider.getTransactionReceipt(tx.hash);
      callback(tx.hash, receipt?.status === 1 ? 'confirmed' : 'failed');
    }
  });

  return () => {
    wsProvider.removeAllListeners('block');
  };
};