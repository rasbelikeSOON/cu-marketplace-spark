
import React from "react";
import MainLayout from "../layouts/MainLayout";
import Hero from "../components/sections/Hero";
import FeaturedProducts from "../components/sections/FeaturedProducts";
import CategoriesSection from "../components/sections/CategoriesSection";
import { products } from "../data/mockData";
import { Button } from "../components/ui-components/Button";
import { ShieldCheck, Repeat, MessageCircle } from "lucide-react";

const Index = () => {
  const [activeCategory, setActiveCategory] = React.useState(1);

  return (
    <MainLayout>
      <Hero />
      
      <CategoriesSection
        activeCategory={activeCategory}
        onCategoryChange={setActiveCategory}
      />
      
      <FeaturedProducts products={products.slice(0, 8)} />
      
      {/* Features Section */}
      <section className="section-spacing bg-secondary/50">
        <div className="container-custom">
          <div className="text-center mb-14">
            <h2 className="text-2xl md:text-3xl font-display font-semibold text-foreground">
              Why Use CU Marketplace?
            </h2>
            <p className="mt-3 text-muted-foreground max-w-xl mx-auto">
              Our platform is designed specifically for Covenant University students
              to create a safe and convenient trading environment.
            </p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8 md:gap-6 lg:gap-12">
            {[
              {
                icon: <ShieldCheck className="h-8 w-8 text-primary" />,
                title: "University-Verified Users",
                description:
                  "All users are verified with their Covenant University email, ensuring a trusted community of fellow students.",
              },
              {
                icon: <MessageCircle className="h-8 w-8 text-primary" />,
                title: "Direct Communication",
                description:
                  "Chat directly with sellers or buyers to negotiate prices and arrange meetups on campus.",
              },
              {
                icon: <Repeat className="h-8 w-8 text-primary" />,
                title: "Sustainable Campus Economy",
                description:
                  "Reuse, recycle, and save money by buying and selling within our university community.",
              },
            ].map((feature, index) => (
              <div
                key={index}
                className="bg-white p-6 rounded-2xl shadow-subtle flex flex-col items-center text-center animate-scale"
                style={{ animationDelay: `${index * 100}ms` }}
              >
                <div className="p-3 rounded-full bg-primary/10 mb-5">
                  {feature.icon}
                </div>
                <h3 className="text-lg font-semibold mb-3">{feature.title}</h3>
                <p className="text-muted-foreground">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
      
      {/* CTA Section */}
      <section className="section-spacing">
        <div className="container-custom">
          <div className="bg-primary rounded-3xl overflow-hidden">
            <div className="grid md:grid-cols-2 items-center">
              <div className="p-8 md:p-12 lg:p-16">
                <h2 className="text-2xl md:text-3xl font-display font-semibold text-white mb-4">
                  Ready to buy or sell?
                </h2>
                <p className="text-primary-foreground/80 mb-8 max-w-md">
                  Join our community of Covenant University students and start trading safely and conveniently on campus.
                </p>
                <div className="flex flex-col sm:flex-row gap-4">
                  <Button className="bg-white text-primary hover:bg-white/90 shadow-subtle">
                    Sign Up Now
                  </Button>
                  <Button variant="outline" className="border-white/30 text-white hover:bg-white/10">
                    Learn More
                  </Button>
                </div>
              </div>
              <div className="hidden md:block h-full">
                <img
                  src="https://images.unsplash.com/photo-1552664730-d307ca884978?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=2070&q=80"
                  alt="Students on campus"
                  className="w-full h-full object-cover"
                />
              </div>
            </div>
          </div>
        </div>
      </section>
    </MainLayout>
  );
};

export default Index;
