import { useInfiniteQuery } from "@tanstack/react-query";

export class ContestantApi {
  static async fetchContestants({
    pageParam = 1,
    limit = 9,
    search,
    category,
  }: QueryOptions & { pageParam?: number } = {}): Promise<ContestantsResponse> {
    const params = new URLSearchParams({
      page: pageParam.toString(),
      limit: limit.toString(),
      ...(search && { search }),
      ...(category && { category }),
    });

    try {
      const response = await fetch(`/api/contestant?${params}`);
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Failed to fetch contestants");
      }
      return response.json();
    } catch (error) {
      console.error("Error fetching contestants:", error);
      throw error;
    }
  }
}

export function useContestants(options: Omit<QueryOptions, "page"> = {}) {
  return useInfiniteQuery<ContestantsResponse, Error>({
    queryKey: ["contestants", options],
    queryFn: ({ pageParam }) =>
      ContestantApi.fetchContestants({ ...options, pageParam }),
    getNextPageParam: (lastPage) => {
      if (lastPage.pagination.currentPage < lastPage.pagination.pages) {
        return lastPage.pagination.currentPage + 1;
      }
      return undefined;
    },
    initialPageParam: 1,
  });
}
