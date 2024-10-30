import { useQuery } from "@tanstack/react-query";

export const fetchEthereumPrice = async (): Promise<EthereumPrice> => {
  const response = await fetch("/api/eth-price");
  if (!response.ok) {
    throw new Error("Network response was not ok");
  }
  return response.json();
};

export function useEthereumPrice() {
  return useQuery<EthereumPrice, Error>({
    queryKey: ["ethereum-price"],
    queryFn: fetchEthereumPrice,
    staleTime: 60000,
    refetchOnWindowFocus: false,
  });
}
