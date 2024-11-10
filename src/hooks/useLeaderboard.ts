import { useQuery } from "@tanstack/react-query";

interface LeaderboardData {
  entries: LeaderboardEntry[];
  totalVotes: number;
  totalContestants: number;
  contestId: string;
  lastUpdated: number;
}

const fetchLeaderboard = async (): Promise<LeaderboardData> => {
  const response = await fetch("http://142.93.203.227/leaderboard", {
    method: "GET",
    headers: {
      "ngrok-skip-browser-warning": "true",
    },
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
