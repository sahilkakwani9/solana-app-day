"use client";
import { motion } from "framer-motion";
import { Card, CardContent, CardFooter, CardHeader } from "./ui/card";

const MotionCard = motion(Card);

export const SkeletonCard = () => (
  <MotionCard
    className="bg-black border-[#98FB98] border-[0.8px] shadow-lg shadow-[#98FB98]/10 backdrop-blur-sm rounded-lg"
    initial={{ opacity: 0 }}
    animate={{ opacity: 1 }}
    exit={{ opacity: 0 }}
  >
    <CardHeader>
      <div className="flex flex-col items-start">
        <div className="w-3/4 h-8 bg-[#98FB98]/20 rounded mb-2" />
        <div className="w-1/2 h-6 bg-[#98FB98]/20 rounded mb-2" />
        <div className="flex gap-2">
          <div className="w-16 h-6 bg-[#98FB98]/20 rounded" />
          <div className="w-16 h-6 bg-[#98FB98]/20 rounded" />
        </div>
      </div>
    </CardHeader>
    <CardContent>
      <div className="w-full h-56 bg-[#98FB98]/20 rounded-xl mb-4" />
      <div className="w-full h-10 bg-[#98FB98]/20 rounded" />
    </CardContent>
    <CardFooter>
      <div className="w-full h-10 bg-[#98FB98]/20 rounded" />
    </CardFooter>
  </MotionCard>
);
