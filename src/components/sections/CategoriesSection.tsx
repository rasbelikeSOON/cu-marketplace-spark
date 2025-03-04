
import React from "react";
import CategoryPill from "../ui-components/CategoryPill";
import { Book, Laptop, Shirt, Home, MessageSquare, Briefcase, Music, Gift } from "lucide-react";

interface Category {
  id: number;
  name: string;
  icon: React.ReactNode;
}

const categories: Category[] = [
  { id: 1, name: "All", icon: <Home size={16} /> },
  { id: 2, name: "Textbooks", icon: <Book size={16} /> },
  { id: 3, name: "Electronics", icon: <Laptop size={16} /> },
  { id: 4, name: "Clothing", icon: <Shirt size={16} /> },
  { id: 5, name: "Services", icon: <MessageSquare size={16} /> },
  { id: 6, name: "Internships", icon: <Briefcase size={16} /> },
  { id: 7, name: "Entertainment", icon: <Music size={16} /> },
  { id: 8, name: "Other", icon: <Gift size={16} /> },
];

interface CategoriesSectionProps {
  activeCategory?: number;
  onCategoryChange?: (categoryId: number) => void;
}

const CategoriesSection: React.FC<CategoriesSectionProps> = ({
  activeCategory = 1,
  onCategoryChange,
}) => {
  return (
    <section className="py-8">
      <div className="container-custom">
        <div className="flex items-center overflow-x-auto pb-4 scrollbar-none space-x-3 animate-fade-in">
          {categories.map((category) => (
            <div key={category.id} className="flex-none">
              <CategoryPill
                name={category.name}
                icon={category.icon}
                isActive={activeCategory === category.id}
                onClick={() => onCategoryChange?.(category.id)}
              />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default CategoriesSection;
