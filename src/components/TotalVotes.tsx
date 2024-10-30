"use client";
import useAllVotes from '@/hooks/useTotalVotes';
import React from 'react';

function TotalVotes() {
  const { votes, isLoading } = useAllVotes();
  return (
    <div className="rounded-lg shadow-lg max-w-xs transform transition-all duration-300 hover:scale-105 sm:my-0 my-2">
      <div className="flex items-center justify-center space-x-2">
        <div className="text-md text-eclipseGreen  font-bold">Total Votes -</div>
        <div className={`text-lg font-bold text-eclipseGreen transition-opacity duration-300 ${isLoading ? 'opacity-50' : 'opacity-100'
          }`}>
          {votes?.toLocaleString() ?? 0}
        </div>
      </div>
    </div>
  );
}

export default TotalVotes;
