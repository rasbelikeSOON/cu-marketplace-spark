
import React from "react";
import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";
import { Button } from "../ui-components/Button";
import ProductCard from "../ui-components/ProductCard";

const FeaturedProducts = ({ products }) => {
  return (
    <section className="py-12 md:py-20">
      <div className="container-custom">
        <div className="flex flex-col md:flex-row justify-between items-center mb-8">
          <div>
            <h2 className="text-2xl md:text-3xl font-display font-semibold">
              Featured Products
            </h2>
            <p className="text-muted-foreground mt-2">
              Discover the most popular items on campus
            </p>
          </div>
          <Link to="/products" className="mt-4 md:mt-0">
            <Button variant="outline">
              View All Products
              <ArrowRight className="ml-2" size={16} />
            </Button>
          </Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {products?.slice(0, 8).map((product) => (
            <div key={product.id} className="animate-scale">
              <ProductCard
                id={product.id}
                title={product.title}
                price={product.price}
                image={product.image}
                category={product.category}
                sellerName={product.sellerName}
              />
            </div>
          ))}
        </div>

        <div className="mt-12 text-center">
          <Link to="/products">
            <Button>
              Explore All Products
              <ArrowRight className="ml-2" size={16} />
            </Button>
          </Link>
        </div>
      </div>
    </section>
  );
};

export default FeaturedProducts;
