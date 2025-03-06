
import React from "react";
import { Link } from "react-router-dom";
import { ArrowRight, Book, Laptop, Sofa, Shirt, Utensils, Headphones } from "lucide-react";
import { Button } from "../ui-components/Button";
import CategoryPill from "../ui-components/CategoryPill";

const categories = [
  { name: "Books", icon: Book, color: "bg-blue-100 text-blue-700" },
  { name: "Electronics", icon: Laptop, color: "bg-purple-100 text-purple-700" },
  { name: "Furniture", icon: Sofa, color: "bg-amber-100 text-amber-700" },
  { name: "Clothing", icon: Shirt, color: "bg-green-100 text-green-700" },
  { name: "Kitchen", icon: Utensils, color: "bg-rose-100 text-rose-700" },
  { name: "Accessories", icon: Headphones, color: "bg-indigo-100 text-indigo-700" },
];

const CategoriesSection = () => {
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
          {categories.map((category) => (
            <Link 
              key={category.name} 
              to={`/products?category=${encodeURIComponent(category.name)}`}
            >
              <CategoryPill
                name={category.name}
                Icon={category.icon}
                color={category.color}
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
