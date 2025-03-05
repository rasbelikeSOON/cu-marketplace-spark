
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
    const { productTitle, productId, sellerName } = await req.json();

    // In a real implementation, you would use a service like Resend, SendGrid, etc.
    // For now, we'll just log the notification
    console.log(`New product listed: ${productTitle} by ${sellerName}`);

    // Simulate email notification
    const emailContent = `
      <h1>New Product Listed!</h1>
      <p>A new product has been listed on CU Marketplace:</p>
      <h2>${productTitle}</h2>
      <p>Listed by: ${sellerName}</p>
      <a href="/product/${productId}">View Product</a>
    `;

    console.log("Notification content:", emailContent);

    return new Response(
      JSON.stringify({ 
        success: true, 
        message: "Product notification sent successfully"
      }),
      { 
        headers: { 
          "Content-Type": "application/json",
          ...corsHeaders
        } 
      }
    );
  } catch (error) {
    console.error("Error sending product notification:", error);
    
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
