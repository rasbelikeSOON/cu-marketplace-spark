
import React from "react";
import CategoryPill from "../ui-components/CategoryPill";
import { 
  Smartphone, Book, Shirt, Home, Gamepad, Dumbbell, 
  Rocket, Laptop, Headphones, Watch, FileText, PenTool, 
  ShoppingBag, Watch as WatchIcon, UtensilsCrossed, Package, 
  Controller, Dice, Music, Dumbbell as DumbbellIcon, Trophy,
  Wine, Camera, Scissors, Pencil
} from "lucide-react";

interface Category {
  id: number;
  name: string;
  icon: React.ReactNode;
}

const categories: Category[] = [
  { id: 1, name: "All", icon: <Home size={16} /> },
  // Electronics & Gadgets
  { id: 2, name: "Electronics", icon: <Smartphone size={16} /> },
  { id: 3, name: "Phones & Tablets", icon: <Smartphone size={16} /> },
  { id: 4, name: "Laptops & Accessories", icon: <Laptop size={16} /> },
  { id: 5, name: "Headphones & Speakers", icon: <Headphones size={16} /> },
  { id: 6, name: "Smartwatches", icon: <Watch size={16} /> },
  // Books & Study Materials
  { id: 7, name: "Books", icon: <Book size={16} /> },
  { id: 8, name: "Textbooks", icon: <Book size={16} /> },
  { id: 9, name: "Lecture Notes", icon: <FileText size={16} /> },
  { id: 10, name: "Stationery", icon: <PenTool size={16} /> },
  // Fashion & Accessories
  { id: 11, name: "Fashion", icon: <Shirt size={16} /> },
  { id: 12, name: "Clothing", icon: <Shirt size={16} /> },
  { id: 13, name: "Shoes", icon: <ShoppingBag size={16} /> },
  { id: 14, name: "Bags", icon: <ShoppingBag size={16} /> },
  { id: 15, name: "Jewelry", icon: <WatchIcon size={16} /> },
  // Home & Dorm Essentials
  { id: 16, name: "Dorm Essentials", icon: <Home size={16} /> },
  { id: 17, name: "Bedding", icon: <Home size={16} /> },
  { id: 18, name: "Kitchenware", icon: <UtensilsCrossed size={16} /> },
  { id: 19, name: "Storage", icon: <Package size={16} /> },
  // Entertainment & Games
  { id: 20, name: "Entertainment", icon: <Gamepad size={16} /> },
  { id: 21, name: "Gaming", icon: <Controller size={16} /> },
  { id: 22, name: "Board Games", icon: <Dice size={16} /> },
  { id: 23, name: "Music & Movies", icon: <Music size={16} /> },
  // Sports & Fitness
  { id: 24, name: "Sports", icon: <Dumbbell size={16} /> },
  { id: 25, name: "Gym Equipment", icon: <DumbbellIcon size={16} /> },
  { id: 26, name: "Sports Gear", icon: <Trophy size={16} /> },
  { id: 27, name: "Water Bottles", icon: <Wine size={16} /> },
  // Services & Offers
  { id: 28, name: "Services", icon: <Rocket size={16} /> },
  { id: 29, name: "Photography", icon: <Camera size={16} /> },
  { id: 30, name: "Beauty Services", icon: <Scissors size={16} /> },
  { id: 31, name: "Academic Help", icon: <Pencil size={16} /> },
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
        <h2 className="font-display text-lg md:text-xl font-medium mb-4">
          What are you looking for today, Eagles? 🦅
        </h2>
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
