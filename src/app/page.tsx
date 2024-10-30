"use client";

import { AnimatePresence, motion } from "framer-motion";

import { useContestants } from "@/hooks/useContestant";
import { useCallback, useRef, useState } from "react";
import { SkeletonCard } from "@/components/SkeletonCard";
import { useIntersectionObserver } from "@/hooks/useIntersectionObserver";
import SearchBar from "@/components/SearchBar";
import Categories from "@/components/Categories";
import ContestantCard from "@/components/ContestantCard";
import TotalVotes from "@/components/TotalVotes";

export default function Component() {
  const [searchTerm, setSearchTerm] = useState("");
  const [filter, setFilter] = useState("All");
  const [isSearchFocused, setIsSearchFocused] = useState(false);
  const loadMoreRef = useRef(null);
  const {
    data,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    isLoading,
    error,
  } = useContestants({
    search: searchTerm,
  });

  const onIntersect = useCallback(() => {
    if (hasNextPage && !isFetchingNextPage) {
      fetchNextPage();
    }
  }, [hasNextPage, isFetchingNextPage, fetchNextPage]);

  useIntersectionObserver({
    target: loadMoreRef,
    onIntersect,
  });

  const contestants = data?.pages.flatMap((page) => page.data) ?? [];

  if (error) return;
  const filteredTeams =
    filter === "All"
      ? contestants
      : contestants.filter((team) => team.category.includes(filter));

  return (
    <div className="min-h-screen bg-black text-white p-8 max-w-7xl mx-auto">
      <SearchBar
        isSearchFocused={isSearchFocused}
        searchTerm={searchTerm}
        setIsSearchFocused={setIsSearchFocused}
        setSearchTerm={setSearchTerm}
      />
      <div className="flex flex-col md:flex-row md:justify-between">

      <Categories filter={filter} setFilter={setFilter} />
      <TotalVotes />
      </div>
      <AnimatePresence>
        {isLoading ? (
          <motion.div
            key="skeleton"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 gap-x-12"
          >
            {[...Array(6)].map((_, index) => (
              <SkeletonCard key={index} />
            ))}
          </motion.div>
        ) : (
          <motion.div
            key="content"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 gap-x-12 "
          >
            {filteredTeams.map((contestant) => (
              <ContestantCard contestant={contestant} />
            ))}
          </motion.div>
        )}
        <div ref={loadMoreRef} className="w-full py-8 flex justify-center">
          {isFetchingNextPage ? (
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#98FB98]" />
          ) : hasNextPage ? (
            <div className="h-8" />
          ) : null}
        </div>
      </AnimatePresence>
    </div>
  );
}
