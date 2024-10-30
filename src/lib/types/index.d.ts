interface Contestant {
  id: string;
  name: string;
  teamName: string;
  productName: string;
  description: string;
  category: string[];
  votes: number;
  logo: string;
  headshot: string;
  eclipseAddress: string;
  onChainId: number;
  createdAt: string;
  updatedAt: string;
}

interface QueryOptions {
  page?: number;
  limit?: number;
  search?: string;
  category?: string;
}

interface PaginationInfo {
  total: number;
  pages: number;
  currentPage: number;
  limit: number;
}

interface ContestantsResponse {
  success: boolean;
  data: Contestant[];
  pagination: PaginationInfo;
}

interface BackpackEvents {
  on(event: "connect", callback: (data: { publicKey: string }) => void): void;
}

declare interface LeaderboardEntry {
  rank: number;
  contestantId: string;
  votes: number;
  percentageOfTotal: number;
  contestantData: Contestant;
}

interface Backpack {
  connect(): Promise<void>;
  disconnect(): Promise<void>;
  on: BackpackEvents["on"];
}
