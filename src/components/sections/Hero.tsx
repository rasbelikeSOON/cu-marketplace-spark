
import React from "react";
import { Button } from "../ui-components/Button";
import { ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";
import SearchBar from "../ui-components/SearchBar";

const Hero: React.FC = () => {
  return (
    <section className="relative overflow-hidden pt-16 pb-20 md:pt-20 md:pb-28">
      <div className="container-custom relative z-10">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-6 items-center">
          <div className="space-y-6 max-w-xl mx-auto lg:mx-0 text-center lg:text-left">
            <div className="inline-flex items-center rounded-full py-1 px-4 gap-1.5 bg-primary/10 text-primary text-sm font-medium animate-fade-in">
              <span className="inline-block w-2 h-2 rounded-full bg-primary"></span>
              Exclusive to Covenant University
            </div>
            
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-display font-semibold tracking-tight text-balance animate-slide-up" style={{ animationDelay: "100ms" }}>
              Buy & Sell with
              <br />
              <span className="text-primary">fellow students</span>
            </h1>
            
            <p className="text-lg text-muted-foreground max-w-lg mx-auto lg:mx-0 text-balance animate-slide-up" style={{ animationDelay: "200ms" }}>
              Your safe and trusted marketplace exclusively for Covenant University students. Find everything from textbooks to electronics.
            </p>
            
            <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4 pt-2 animate-slide-up" style={{ animationDelay: "300ms" }}>
              <Link to="/products">
                <Button className="w-full sm:w-auto">
                  Browse Products
                  <ArrowRight size={16} className="ml-2" />
                </Button>
              </Link>
              <Link to="/signin">
                <Button variant="outline" className="w-full sm:w-auto">
                  Sign Up/Login
                </Button>
              </Link>
            </div>
            
            <div className="pt-2 animate-slide-up" style={{ animationDelay: "400ms" }}>
              <SearchBar className="max-w-md mx-auto lg:mx-0" />
            </div>
          </div>
          
          <div className="relative animate-fade-in" style={{ animationDelay: "500ms" }}>
            <div className="aspect-[4/3] md:aspect-square rounded-2xl overflow-hidden bg-secondary">
              <img
                src="https://images.unsplash.com/photo-1522202176988-66273c2fd55f?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1471&q=80"
                alt="Students collaborating"
                className="w-full h-full object-cover"
              />
            </div>
            
            <div className="absolute -bottom-6 -left-6 md:-bottom-8 md:-left-8 w-2/3 rounded-2xl overflow-hidden shadow-elevated animate-slide-in-right" style={{ animationDelay: "700ms" }}>
              <img
                src="https://images.unsplash.com/photo-1560769629-975ec94e6a86?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=928&q=80"
                alt="Student shopping"
                className="w-full aspect-video object-cover"
              />
            </div>
          </div>
        </div>
      </div>
      
      {/* Background Elements */}
      <div className="absolute top-0 right-0 w-1/3 h-1/3 bg-primary/5 rounded-bl-full -z-10" />
      <div className="absolute bottom-0 left-0 w-1/4 h-1/4 bg-secondary rounded-tr-full -z-10" />
    </section>
  );
};

export default Hero;
