
import React from "react";
import { Link } from "react-router-dom";

interface ProductCardProps {
  id: number;
  title: string;
  price: number;
  image: string;
  category: string;
  sellerName: string;
}

const ProductCard: React.FC<ProductCardProps> = ({
  id,
  title,
  price,
  image,
  category,
  sellerName,
}) => {
  return (
    <Link to={`/product/${id}`} className="group">
      <div className="rounded-2xl overflow-hidden bg-white shadow-subtle hover:shadow-elevated transition-all duration-300 ease-apple hover:translate-y-[-4px]">
        <div className="relative aspect-square overflow-hidden">
          <img
            src={image}
            alt={title}
            className="object-cover w-full h-full transition-transform duration-500 ease-apple group-hover:scale-105"
            loading="lazy"
          />
          <div className="absolute top-3 left-3">
            <span className="inline-block py-1 px-3 bg-white/80 backdrop-blur-sm text-2xs font-medium rounded-full">
              {category}
            </span>
          </div>
        </div>
        <div className="p-4">
          <h3 className="font-medium text-base text-foreground leading-tight line-clamp-1">
            {title}
          </h3>
          <p className="mt-1 text-muted-foreground text-sm line-clamp-1">
            by {sellerName}
          </p>
          <div className="mt-2 font-semibold">₦{price.toLocaleString()}</div>
        </div>
      </div>
    </Link>
  );
};

export default ProductCard;
