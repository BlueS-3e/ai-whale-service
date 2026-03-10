"use client";

import { useEffect, useState } from 'react';
import { usePublicClient, useAccount } from 'wagmi';
import { formatEther, parseAbi } from 'viem';

interface Transaction {
  hash: string;
  from: string;
  to: string;
  value: string;
  blockNumber: bigint;
  timestamp?: number;
}

export function useWhaleTransactions(walletAddress?: string) {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState(false);
  const publicClient = usePublicClient();
  const { address } = useAccount();

  useEffect(() => {
    const fetchTransactions = async () => {
      const targetAddress = walletAddress || address;
      if (!targetAddress || !publicClient) return;

      setLoading(true);
      try {
        // Get latest block number
        const blockNumber = await publicClient.getBlockNumber();
        
        // Fetch last 10 blocks for demo
        const recentBlocks = 10;
        const txs: Transaction[] = [];

        for (let i = 0; i < recentBlocks; i++) {
          const block = await publicClient.getBlock({
            blockNumber: blockNumber - BigInt(i),
            includeTransactions: true,
          });

          // Filter whale transactions (>10 ETH for demo)
          const whaleTxs = (block.transactions as any[])
            .filter((tx: any) => {
              const value = typeof tx.value === 'bigint' ? tx.value : BigInt(tx.value || 0);
              return value > BigInt(10) * BigInt(10 ** 18); // > 10 ETH
            })
            .slice(0, 5)
            .map((tx: any) => ({
              hash: tx.hash,
              from: tx.from,
              to: tx.to || '',
              value: formatEther(tx.value),
              blockNumber: block.number,
              timestamp: Number(block.timestamp),
            }));

          txs.push(...whaleTxs);
        }

        setTransactions(txs.slice(0, 20));
      } catch (error) {
        console.error('Error fetching transactions:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchTransactions();
  }, [walletAddress, address, publicClient]);

  return { transactions, loading };
}

export function useTokenBalance(tokenAddress: string, walletAddress?: string) {
  const [balance, setBalance] = useState<string>('0');
  const [loading, setLoading] = useState(false);
  const publicClient = usePublicClient();
  const { address } = useAccount();

  useEffect(() => {
    const fetchBalance = async () => {
      const targetAddress = walletAddress || address;
      if (!targetAddress || !publicClient || !tokenAddress) return;

      setLoading(true);
      try {
        // ERC20 balanceOf ABI
        const data = await publicClient.readContract({
          address: tokenAddress as `0x${string}`,
          abi: parseAbi(['function balanceOf(address) view returns (uint256)']),
          functionName: 'balanceOf',
          args: [targetAddress as `0x${string}`],
        });

        setBalance(formatEther(data as bigint));
      } catch (error) {
        console.error('Error fetching token balance:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchBalance();
  }, [tokenAddress, walletAddress, address, publicClient]);

  return { balance, loading };
}

export function useChainData() {
  const { chain } = useAccount();
  const publicClient = usePublicClient();
  const [blockNumber, setBlockNumber] = useState<bigint>(BigInt(0));
  const [gasPrice, setGasPrice] = useState<bigint>(BigInt(0));

  useEffect(() => {
    const fetchChainData = async () => {
      if (!publicClient) return;

      try {
        const [block, gas] = await Promise.all([
          publicClient.getBlockNumber(),
          publicClient.getGasPrice(),
        ]);

        setBlockNumber(block);
        setGasPrice(gas);
      } catch (error) {
        console.error('Error fetching chain data:', error);
      }
    };

    fetchChainData();
    const interval = setInterval(fetchChainData, 12000); // Update every 12s

    return () => clearInterval(interval);
  }, [publicClient]);

  return {
    chain,
    blockNumber,
    gasPrice: formatEther(gasPrice),
  };
}
