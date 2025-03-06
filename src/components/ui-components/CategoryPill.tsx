
import React from "react";

interface CategoryPillProps {
  name: string;
  icon?: React.ReactNode;
  isActive?: boolean;
  onClick?: () => void;
  color?: string;
}

const CategoryPill: React.FC<CategoryPillProps> = ({
  name,
  icon,
  isActive = false,
  onClick,
  color,
}) => {
  return (
    <button
      className={`inline-flex items-center gap-2 py-2 px-4 rounded-full text-sm font-medium transition-all ease-apple ${
        isActive
          ? "bg-primary text-primary-foreground shadow-subtle"
          : color || "bg-secondary/80 text-foreground hover:bg-secondary"
      }`}
      onClick={onClick}
    >
      {icon && <span className="text-lg">{icon}</span>}
      {name}
    </button>
  );
};

export default CategoryPill;
