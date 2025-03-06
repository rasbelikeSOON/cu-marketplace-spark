
import React from "react";
import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";
import { Button } from "../ui-components/Button";

const Hero = () => {
  return (
    <section className="relative overflow-hidden bg-gradient-to-r from-indigo-50 to-purple-50 py-12 md:py-16 lg:py-20">
      <div className="absolute inset-0 bg-[url('/grid-pattern.svg')] bg-center opacity-5"></div>
      <div className="container-custom">
        <div className="mx-auto max-w-4xl text-center">
          <h1 className="font-display font-semibold text-4xl md:text-5xl lg:text-6xl mb-6">
            The Campus Marketplace for{" "}
            <span className="bg-gradient-to-r from-primary to-covenant-purple bg-clip-text text-transparent">
              Students
            </span>
          </h1>
          <p className="text-muted-foreground text-lg md:text-xl max-w-3xl mx-auto mb-8">
            Buy and sell items, connect with fellow students, and get the best
            deals on campus. Covenant Marketplace is your one-stop shop for
            everything you need.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link to="/products">
              <Button size="lg">
                Browse Products
                <ArrowRight className="ml-2" size={16} />
              </Button>
            </Link>
            <Link to="/add-product">
              <Button variant="secondary" size="lg">
                Sell Something
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
