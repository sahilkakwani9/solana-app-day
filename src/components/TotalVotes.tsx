"use client";
import useAllVotes from '@/hooks/useTotalVotes';
import React from 'react';

function TotalVotes() {
  const { votes, isLoading } = useAllVotes();
  return (
    <div className="rounded-lg shadow-lg max-w-xs transform transition-all duration-300 hover:scale-105 sm:my-0 my-2">
      <div className="flex items-center justify-center space-x-3">
        <div className="text-sm text-[#98FB98]  font-medium mb-1">Total Votes</div>
        <div className={`text-2xl font-bold text-[#98FB98] transition-opacity duration-300 ${isLoading ? 'opacity-50' : 'opacity-100'
          }`}>
          {votes?.toLocaleString() ?? 0}
        </div>
      </div>
    </div>
  );
}

export default TotalVotes;
