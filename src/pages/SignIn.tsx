
import React from "react";
import { Link, useNavigate } from "react-router-dom";
import MainLayout from "../layouts/MainLayout";
import { Button } from "../components/ui-components/Button";
import { 
  SignIn as ClerkSignIn,
  SignUp as ClerkSignUp,
  useUser
} from "@clerk/clerk-react";
import { Mail } from "lucide-react";

const SignIn = () => {
  const [isLogin, setIsLogin] = React.useState(true);
  const navigate = useNavigate();
  const { isSignedIn } = useUser();
  
  // Redirect if user is already signed in
  React.useEffect(() => {
    if (isSignedIn) {
      navigate("/");
    }
  }, [isSignedIn, navigate]);

  // Toggle between login and signup forms
  const toggleForm = () => {
    setIsLogin(!isLogin);
  };
  
  return (
    <MainLayout>
      <div className="container-custom py-12 md:py-20">
        <div className="max-w-md mx-auto">
          <div className="text-center mb-8">
            <h1 className="text-2xl md:text-3xl font-display font-semibold">
              {isLogin ? "Welcome Back" : "Create an Account"}
            </h1>
            <p className="mt-2 text-muted-foreground">
              {isLogin
                ? "Sign in to your CU Marketplace account"
                : "Join the exclusive marketplace for Covenant University students"}
            </p>
          </div>
          
          <div className="bg-white rounded-2xl shadow-subtle p-8">
            {isLogin ? (
              <ClerkSignIn 
                routing="path" 
                path="/signin" 
                signUpUrl="/signup"
                afterSignInUrl="/"
                appearance={{
                  elements: {
                    rootBox: "w-full",
                    card: "shadow-none p-0",
                    headerTitle: "hidden",
                    headerSubtitle: "hidden",
                    socialButtonsBlockButton: "rounded-lg h-11",
                  }
                }}
              />
            ) : (
              <ClerkSignUp 
                routing="path" 
                path="/signup" 
                signInUrl="/signin"
                afterSignUpUrl="/"
                appearance={{
                  elements: {
                    rootBox: "w-full",
                    card: "shadow-none p-0",
                    headerTitle: "hidden",
                    headerSubtitle: "hidden",
                    socialButtonsBlockButton: "rounded-lg h-11",
                  }
                }}
              />
            )}
            
            <div className="mt-6 text-center text-sm">
              <p className="text-muted-foreground">
                {isLogin ? "Don't have an account?" : "Already have an account?"}
                <button
                  type="button"
                  onClick={toggleForm}
                  className="ml-1 text-primary hover:underline font-medium"
                >
                  {isLogin ? "Sign up" : "Sign in"}
                </button>
              </p>
            </div>
          </div>
          
          <p className="mt-8 text-xs text-center text-muted-foreground">
            By signing up, you agree to our{" "}
            <Link to="/terms" className="text-primary hover:underline">
              Terms of Service
            </Link>{" "}
            and{" "}
            <Link to="/privacy" className="text-primary hover:underline">
              Privacy Policy
            </Link>
            .
          </p>
        </div>
      </div>
    </MainLayout>
  );
};

export default SignIn;
