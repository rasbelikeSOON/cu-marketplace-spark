
import React from "react";
import { Link } from "react-router-dom";
import { ArrowRight, Book, Laptop, Sofa, Shirt, Utensils, Headphones } from "lucide-react";
import { Button } from "../ui-components/Button";
import CategoryPill from "../ui-components/CategoryPill";

const categories = [
  { name: "Books", icon: <Book size={18} />, color: "bg-blue-100 text-blue-700" },
  { name: "Electronics", icon: <Laptop size={18} />, color: "bg-purple-100 text-purple-700" },
  { name: "Furniture", icon: <Sofa size={18} />, color: "bg-amber-100 text-amber-700" },
  { name: "Clothing", icon: <Shirt size={18} />, color: "bg-green-100 text-green-700" },
  { name: "Kitchen", icon: <Utensils size={18} />, color: "bg-rose-100 text-rose-700" },
  { name: "Accessories", icon: <Headphones size={18} />, color: "bg-indigo-100 text-indigo-700" },
];

interface CategoriesSectionProps {
  activeCategory?: number;
  onCategoryChange?: (categoryId: number) => void;
}

const CategoriesSection: React.FC<CategoriesSectionProps> = ({
  activeCategory,
  onCategoryChange,
}) => {
  return (
    <section className="py-12 md:py-20 bg-muted/30">
      <div className="container-custom">
        <div className="text-center max-w-2xl mx-auto mb-10">
          <h2 className="text-2xl md:text-3xl font-display font-semibold mb-4">
            Browse by Category
          </h2>
          <p className="text-muted-foreground">
            Find exactly what you're looking for by browsing through our
            categories
          </p>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
          {categories.map((category, index) => (
            <Link 
              key={category.name} 
              to={`/products?category=${encodeURIComponent(category.name)}`}
              onClick={() => onCategoryChange && onCategoryChange(index + 1)}
            >
              <CategoryPill
                name={category.name}
                icon={category.icon}
                isActive={activeCategory === index + 1}
              />
            </Link>
          ))}
        </div>

        <div className="mt-12 text-center">
          <Link to="/products">
            <Button variant="outline">
              View All Categories
              <ArrowRight className="ml-2" size={16} />
            </Button>
          </Link>
        </div>
      </div>
    </section>
  );
};

export default CategoriesSection;
