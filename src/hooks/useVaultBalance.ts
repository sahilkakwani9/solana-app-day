import { useAnchor } from "./useAnchor";
import { LAMPORTS_PER_SOL, PublicKey } from "@solana/web3.js";
import { useQuery } from "@tanstack/react-query";

const fetchVaultBalance = async (program) => {
  const pdaAddress = PublicKey.findProgramAddressSync(
    [Buffer.from("vault")],
    program.programId,
  )[0];
  console.log(pdaAddress.toString());

  const balance = await program.provider.connection.getBalance(pdaAddress);
  return balance / LAMPORTS_PER_SOL;
};

const useVaultBalance = () => {
  const { program } = useAnchor();

  const { data: vaultBalance, isLoading } = useQuery({
    queryKey: ["VaultBalance"],
    queryFn: () => fetchVaultBalance(program),
    enabled: !!program,
    staleTime: Infinity,
  });

  return { vaultBalance, isLoading };
};
export default useVaultBalance;
