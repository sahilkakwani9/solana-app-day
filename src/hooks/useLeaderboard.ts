import { useQuery } from "@tanstack/react-query";

interface LeaderboardData {
  entries: LeaderboardEntry[];
  totalVotes: number;
  totalContestants: number;
  contestId: string;
  lastUpdated: number;
}

const fetchLeaderboard = async (): Promise<LeaderboardData> => {
  const response = await fetch("https://api.devvivek.tech/leaderboard", {
    method: "GET",
  });
  if (!response.ok) {
    throw new Error("Error fetching leaderboard data");
  }
  return response.json();
};

export const useLeaderboard = () => {
  return useQuery({
    queryKey: ["leaderboard"],
    queryFn: fetchLeaderboard,
    refetchInterval: 2000,
  });
};
