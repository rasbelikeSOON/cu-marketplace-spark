
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
    const { email, username } = await req.json();

    // In a real implementation, you would use a service like Resend, SendGrid, etc.
    // For now, we'll just log the email
    console.log(`Sending welcome email to ${email} (${username || 'New User'})`);

    // Simulate email sending
    const emailContent = `
      <h1>Welcome to CU Marketplace!</h1>
      <p>Hello ${username || 'there'},</p>
      <p>Thank you for signing up to CU Marketplace, the exclusive online marketplace for Covenant University students.</p>
      <p>Start browsing products from your fellow students or list your own items for sale!</p>
      <p>Best regards,<br>The CU Marketplace Team</p>
    `;

    console.log("Email content:", emailContent);

    return new Response(
      JSON.stringify({ 
        success: true, 
        message: "Welcome email sent successfully"
      }),
      { 
        headers: { 
          "Content-Type": "application/json",
          ...corsHeaders
        } 
      }
    );
  } catch (error) {
    console.error("Error sending welcome email:", error);
    
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
