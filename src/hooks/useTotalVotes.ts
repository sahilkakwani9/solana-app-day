import { useAnchor } from "./useAnchor";
import { CONTEST_ADDRESS } from "@/lib/constant";
import { useQuery } from "@tanstack/react-query";

const fetchVotes = async (program) => {
  const data = await program.account.contest.fetch(CONTEST_ADDRESS);
  return data.upvotes.toNumber();
};

const useAllVotes = () => {
  const { program } = useAnchor();

  const { data: votes, isLoading } = useQuery({
    queryKey: ["AllVotes"],
    queryFn: () => fetchVotes(program),
    enabled: !!program,
    staleTime: Infinity,
  });

  return { votes, isLoading };
};
export default useAllVotes;
