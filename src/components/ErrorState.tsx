import { motion } from "framer-motion";
import { Button } from "./ui/button";
import { RefreshCw } from "lucide-react";

const ErrorState = ({
  title,
  description,
  icon: Icon,
  action,
  variant = "default",
}: {
  title: string;
  description: string;
  icon: any;
  action?: { label: string; onClick: () => void };
  variant?: "default" | "warning";
}) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    exit={{ opacity: 0, y: -20 }}
    className="flex flex-col items-center justify-center p-8 text-center min-h-[80vh]"
  >
    <div
      className={`rounded-full p-4 mb-4 ${
        variant === "warning" ? "bg-yellow-500/10" : "bg-red-500/10"
      }`}
    >
      <Icon
        className={`w-8 h-8 ${
          variant === "warning" ? "text-yellow-500" : "text-red-500"
        }`}
      />
    </div>
    <h2 className="text-xl font-semibold mb-2">{title}</h2>
    <p className="text-gray-400 mb-6 max-w-md">{description}</p>
    {action && (
      <Button
        variant="outline"
        className="border-[#98FB98] text-[#98FB98] hover:bg-[#98FB98] hover:text-black"
        onClick={action.onClick}
      >
        <span className="flex items-center gap-2">
          {action.label.includes("Retry") && <RefreshCw className="w-4 h-4" />}
          {action.label}
        </span>
      </Button>
    )}
  </motion.div>
);

export default ErrorState;
