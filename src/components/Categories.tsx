import { PRODUCT_CATEGORIES } from "@/lib/constant";
import React from "react";
import { Button } from "./ui/button";

function Categories({
  setFilter,
  filter,
}: {
  filter: string;
  setFilter: React.Dispatch<React.SetStateAction<string>>;
}) {
  return (
    <div className="flex flex-wrap justify-start gap-2 mb-8">
      {PRODUCT_CATEGORIES.map((category) => (
        <Button
          key={category}
          onClick={() => setFilter(category)}
          variant={filter === category ? "default" : "outline"}
          className={`
          ${
            filter === category
              ? "bg-[#98FB98] text-black"
              : "bg-black text-[#98FB98] border-[#98FB98]"
          }
          hover:bg-[#98FB98] hover:text-black transition-colors duration-300 rounded-lg py-2 h-8 font-barlow text-sm sm:text-base
        `}
        >
          {category}
        </Button>
      ))}
    </div>
  );
}

export default Categories;
