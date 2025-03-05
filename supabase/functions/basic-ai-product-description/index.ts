
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { title, category, condition } = await req.json();

    // Generate a simple description based on input
    const descriptions = {
      "Electronics": [
        `This ${condition.toLowerCase()} ${title} is perfect for students who need reliable technology. It's in ${condition.toLowerCase()} condition and ready to use.`,
        `A great ${title} for all your tech needs. This device is in ${condition.toLowerCase()} condition and would be perfect for coursework and projects.`,
        `Looking for affordable tech? This ${title} is in ${condition.toLowerCase()} condition and priced for student budgets.`
      ],
      "Textbooks": [
        `This ${condition.toLowerCase()} ${title} is essential for your coursework. Save money by buying used!`,
        `Need this textbook for class? This copy is in ${condition.toLowerCase()} condition and much cheaper than the bookstore price.`,
        `Get ahead in your studies with this ${title}. It's in ${condition.toLowerCase()} condition with minimal highlighting.`
      ],
      "Clothing": [
        `Stylish ${title} in ${condition.toLowerCase()} condition. Perfect for campus life!`,
        `Look great with this ${title}. It's in ${condition.toLowerCase()} condition and ready to wear.`,
        `Upgrade your wardrobe with this ${title}. It's in ${condition.toLowerCase()} condition and perfect for the university lifestyle.`
      ],
      "Dorm Essentials": [
        `Make your dorm room feel like home with this ${condition.toLowerCase()} ${title}.`,
        `Essential item for hostel living! This ${title} is in ${condition.toLowerCase()} condition and perfect for your dorm room.`,
        `Improve your dorm life with this ${title}. It's in ${condition.toLowerCase()} condition and a must-have for campus living.`
      ],
      "Services": [
        `Professional ${title} service for fellow students. Quality work guaranteed!`,
        `Need help with ${title}? I offer quality service at student-friendly rates.`,
        `Expert ${title} services tailored to student needs. Contact me for details!`
      ]
    };

    const defaultDescriptions = [
      `This ${title} is in ${condition.toLowerCase()} condition and perfect for university students.`,
      `Great deal on this ${condition.toLowerCase()} ${title}. Don't miss out!`,
      `Quality ${title} for sale in ${condition.toLowerCase()} condition. Priced for the student budget.`
    ];

    const categoryDescriptions = descriptions[category] || defaultDescriptions;
    const randomIndex = Math.floor(Math.random() * categoryDescriptions.length);
    const description = categoryDescriptions[randomIndex];

    return new Response(
      JSON.stringify({ 
        success: true, 
        description: description
      }),
      { 
        headers: { 
          "Content-Type": "application/json",
          ...corsHeaders
        } 
      }
    );
  } catch (error) {
    console.error("Error generating description:", error);
    
    return new Response(
      JSON.stringify({ 
        success: false, 
        error: error.message 
      }),
      { 
        status: 400,
        headers: { 
          "Content-Type": "application/json",
          ...corsHeaders 
        } 
      }
    );
  }
});
