"use client";

import { useEffect, useState } from "react";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { AnimatePresence } from "framer-motion";
import { motion } from "framer-motion";
import { useLeaderboard } from "@/hooks/useLeaderboard";
import { LeaderboardSkeleton } from "@/components/leaderboardSkeleton";
import Categories from "@/components/Categories";

export default function LeaderboardPage() {
  const [filter, setFilter] = useState("All");

  const { data, isLoading, error } = useLeaderboard();

  const [previousEntries, setPreviousEntries] = useState([]);

  useEffect(() => {
    if (data?.entries) {
      setPreviousEntries(data.entries);
    }
  }, [data]);

  const filteredTeams =
    filter === "All"
      ? data?.entries
      : data?.entries.filter((team) =>
          team.contestantData.category.includes(filter as Category)
        );

  if (isLoading || error || !filteredTeams) return <LeaderboardSkeleton />;

  return (
    <div className="min-h-screen bg-black text-white p-4 sm:p-8 max-w-7xl mx-auto font-sans">
      <Categories filter={filter} setFilter={setFilter} />

      <div className="bg-black rounded-lg overflow-x-auto border border-[#98FB98]">
        <Table>
          <TableHeader>
            <TableRow className="border-b bg-[#98FB98] hover:bg-[#98FB98]">
              <TableHead className="text-black text-center text-sm sm:text-lg font-barlow whitespace-nowrap px-2 sm:px-4">
                Rank
              </TableHead>
              <TableHead className="text-black text-center text-sm sm:text-lg font-barlow whitespace-nowrap px-2 sm:px-4">
                Team Name
              </TableHead>
              <TableHead className="text-black text-center text-sm sm:text-lg font-barlow whitespace-nowrap px-2 sm:px-4">
                Categories
              </TableHead>
              <TableHead className="text-black text-center text-sm sm:text-lg font-barlow whitespace-nowrap px-2 sm:px-4">
                Votes
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            <AnimatePresence>
              {filteredTeams.map((team) => (
                <motion.tr
                  key={team.contestantId}
                  layout
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{
                    layout: { duration: 0.5, ease: "easeInOut" },
                    opacity: { duration: 0.2 },
                  }}
                  className="border-b border-[#98FB98] border-[0.1px]"
                >
                  <TableCell className="font-medium text-center text-sm sm:text-lg font-barlow px-2 sm:px-4">
                    {team.rank}
                  </TableCell>
                  <TableCell className="text-center text-sm sm:text-lg font-barlow px-2 sm:px-4">
                    {team.contestantData.teamName}
                  </TableCell>
                  <TableCell className="text-center text-sm sm:text-lg font-barlow px-2 sm:px-4">
                    <div className="flex flex-wrap justify-center gap-1 sm:gap-2">
                      {team.contestantData.category.map((category, index) => (
                        <Badge
                          key={index}
                          variant="outline"
                          className="bg-[#98FB98] text-black text-xs sm:text-sm px-1 py-0.5 sm:px-2 sm:py-1"
                        >
                          {category}
                        </Badge>
                      ))}
                    </div>
                  </TableCell>
                  <TableCell className="text-center text-sm sm:text-lg font-barlow px-2 sm:px-4">
                    {team.votes}
                  </TableCell>
                </motion.tr>
              ))}
            </AnimatePresence>
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
