import { Search } from "lucide-react";
import React from "react";

function SearchBar({
  isSearchFocused,
  searchTerm,
  setIsSearchFocused,
  setSearchTerm,
}: {
  isSearchFocused: boolean;
  searchTerm: string;
  setSearchTerm: React.Dispatch<React.SetStateAction<string>>;
  setIsSearchFocused: React.Dispatch<React.SetStateAction<boolean>>;
}) {
  return (
    <div className="mb-8">
      <div
        className={`relative transition-all duration-300 ${
          isSearchFocused ? "scale-105" : ""
        }`}
      >
        <input
          type="text"
          placeholder="Search for contestants..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          onFocus={() => setIsSearchFocused(true)}
          onBlur={() => setIsSearchFocused(false)}
          className="w-full bg-black border-b-2 border-[#98FB98] text-white py-2 px-4 pl-10 focus:outline-none focus:border-b-4 transition-all duration-300"
        />
        <Search
          className="absolute left-3 top-1/2 transform -translate-y-1/2 text-[#98FB98]"
          size={20}
        />
        <div
          className={`absolute bottom-0 left-0 w-full h-0.5 bg-[#98FB98] transform scale-x-0 transition-transform duration-300 ${
            isSearchFocused ? "scale-x-100" : ""
          }`}
        ></div>
      </div>
    </div>
  );
}

export default SearchBar;
