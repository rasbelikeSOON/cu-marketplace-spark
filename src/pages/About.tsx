
import React from "react";
import MainLayout from "../layouts/MainLayout";
import { Link } from "react-router-dom";
import { Button } from "../components/ui-components/Button";
import { ShieldCheck, Users, BookOpen, HelpCircle, Mail } from "lucide-react";

const About = () => {
  return (
    <MainLayout>
      <div className="container-custom py-12 md:py-16">
        {/* Hero Section */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <h1 className="text-3xl md:text-4xl font-display font-semibold mb-6">
            About CU Marketplace
          </h1>
          <p className="text-muted-foreground text-lg">
            The premier online marketplace exclusively for Covenant University students.
            Buy, sell, and connect with fellow Kings and Queens in a safe and trusted environment.
          </p>
        </div>

        {/* Mission & Vision */}
        <div className="grid md:grid-cols-2 gap-8 mb-16">
          <div className="bg-white p-8 rounded-2xl shadow-subtle">
            <h2 className="text-xl font-display font-semibold mb-4">Our Mission</h2>
            <p className="text-muted-foreground">
              To create a secure, convenient platform where Covenant University students can buy
              and sell goods and services, fostering a sustainable campus economy while
              building connections within our unique community.
            </p>
          </div>
          <div className="bg-white p-8 rounded-2xl shadow-subtle">
            <h2 className="text-xl font-display font-semibold mb-4">Our Vision</h2>
            <p className="text-muted-foreground">
              To become the go-to marketplace for all CU students' needs, creating a vibrant
              ecosystem where Kings and Queens help Kings and Queens, promoting resourcefulness, entrepreneurship,
              and community building on campus.
            </p>
          </div>
        </div>

        {/* Core Values */}
        <div className="mb-16">
          <h2 className="text-2xl font-display font-semibold text-center mb-8">
            Our Core Values
          </h2>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              {
                icon: <ShieldCheck className="h-8 w-8 text-primary" />,
                title: "Trust & Safety",
                description:
                  "We verify all users with their CU email to ensure a secure trading environment.",
              },
              {
                icon: <Users className="h-8 w-8 text-primary" />,
                title: "Community",
                description:
                  "We believe in the power of students helping students through resource sharing.",
              },
              {
                icon: <BookOpen className="h-8 w-8 text-primary" />,
                title: "Education",
                description:
                  "We support academic success by making textbooks and study materials accessible.",
              },
              {
                icon: <HelpCircle className="h-8 w-8 text-primary" />,
                title: "Support",
                description:
                  "We're always here to help with any questions or issues you might encounter.",
              },
            ].map((value, index) => (
              <div
                key={index}
                className="bg-white p-6 rounded-xl shadow-subtle text-center"
              >
                <div className="mx-auto w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mb-4">
                  {value.icon}
                </div>
                <h3 className="font-medium text-lg mb-2">{value.title}</h3>
                <p className="text-muted-foreground text-sm">{value.description}</p>
              </div>
            ))}
          </div>
        </div>

        {/* FAQ Section */}
        <div className="mb-16">
          <h2 className="text-2xl font-display font-semibold text-center mb-8">
            Frequently Asked Questions
          </h2>
          <div className="max-w-3xl mx-auto space-y-6">
            {[
              {
                question: "Who can use CU Marketplace?",
                answer:
                  "CU Marketplace is exclusively for Covenant University students. You must verify your account with a valid Google account.",
              },
              {
                question: "How do I list an item for sale?",
                answer:
                  "Once you've created and verified your account, click on 'Sell' in the navigation menu, fill out the product details form, upload photos, set your price, and publish your listing.",
              },
              {
                question: "Is it free to use?",
                answer:
                  "Yes! Creating an account, listing items, and browsing the marketplace is completely free for all CU students.",
              },
              {
                question: "How do payments work?",
                answer:
                  "CU Marketplace facilitates connections between buyers and sellers. You can arrange payment methods directly with the other party, though we recommend meeting in person on campus for exchanges.",
              },
              {
                question: "What if I have an issue with a buyer or seller?",
                answer:
                  "If you encounter any problems, please use the 'Report' feature or contact our support team directly. We take all reports seriously to maintain a safe trading environment.",
              },
            ].map((faq, index) => (
              <div key={index} className="bg-white rounded-xl shadow-subtle overflow-hidden">
                <div className="p-6">
                  <h3 className="font-medium text-lg mb-2">{faq.question}</h3>
                  <p className="text-muted-foreground">{faq.answer}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Contact CTA */}
        <div className="bg-primary rounded-3xl overflow-hidden">
          <div className="p-8 md:p-12 text-center">
            <h2 className="text-2xl md:text-3xl font-display font-semibold text-white mb-4">
              Have More Questions?
            </h2>
            <p className="text-primary-foreground/90 mb-8 max-w-xl mx-auto">
              Our team is here to help! Reach out to us with any questions, feedback, or
              suggestions to improve CU Marketplace.
            </p>
            <Link to="/contact">
              <Button className="bg-white text-primary hover:bg-white/90">
                <Mail className="mr-2 h-5 w-5" />
                Contact Us
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </MainLayout>
  );
};

export default About;
