
import React from "react";
import ProductCard from "../ui-components/ProductCard";
import { Button } from "../ui-components/Button";
import { ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";

interface Product {
  id: number;
  title: string;
  price: number;
  image: string;
  category: string;
  sellerName: string;
}

interface FeaturedProductsProps {
  products: Product[];
}

const FeaturedProducts: React.FC<FeaturedProductsProps> = ({ products }) => {
  return (
    <section className="section-spacing">
      <div className="container-custom">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-8 md:mb-12">
          <div>
            <h2 className="text-2xl md:text-3xl font-display font-semibold text-foreground">
              Hot Deals from Fellow Eagles 🔥
            </h2>
            <p className="mt-2 text-muted-foreground max-w-md">
              Check out what your fellow students are selling this week. Quality items at student-friendly prices!
            </p>
          </div>
          <Link to="/products">
            <Button variant="ghost" className="mt-4 md:mt-0">
              View All <ArrowRight size={16} className="ml-1" />
            </Button>
          </Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {products.map((product) => (
            <div key={product.id} className="animate-scale" style={{ animationDelay: `${(product.id % 8) * 100}ms` }}>
              <ProductCard {...product} />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default FeaturedProducts;
