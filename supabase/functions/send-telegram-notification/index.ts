
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { supabaseClient } from "../_shared/supabase-client.ts";

// Environment variables
const BOT_TOKEN = Deno.env.get("TELEGRAM_BOT_TOKEN") || "";

// CORS headers for browser requests
const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

// Send a message to a Telegram user
async function sendTelegramMessage(chatId: string, message: string) {
  try {
    const response = await fetch(
      `https://api.telegram.org/bot${BOT_TOKEN}/sendMessage`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          chat_id: chatId,
          text: message,
          parse_mode: "HTML",
        }),
      }
    );

    const result = await response.json();
    
    if (!result.ok) {
      throw new Error(`Telegram API error: ${result.description}`);
    }
    
    return result;
  } catch (error) {
    console.error("Error sending Telegram message:", error);
    throw error;
  }
}

// Handler for all requests
serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { userId, notificationType, data } = await req.json();
    
    if (!userId || !notificationType || !data) {
      throw new Error("Missing required parameters");
    }
    
    // Get the user's Telegram ID from their profile
    const { data: profileData, error: profileError } = await supabaseClient
      .from("profiles")
      .select("telegram_id")
      .eq("id", userId)
      .single();
    
    if (profileError || !profileData?.telegram_id) {
      return new Response(
        JSON.stringify({ 
          success: false, 
          message: "User not found or no Telegram ID linked" 
        }),
        { 
          status: 404,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        }
      );
    }
    
    // Format the message based on notification type
    let message = "";
    
    switch (notificationType) {
      case "cart_update":
        message = `🛒 <b>Cart Update</b>\n\n`;
        if (data.action === "add") {
          message += `✅ Added to cart: <b>${data.product.title}</b>\n`;
          message += `Quantity: ${data.quantity}\n`;
          message += `Price: $${data.product.price.toFixed(2)}\n`;
        } else if (data.action === "remove") {
          message += `❌ Removed from cart: <b>${data.product.title}</b>\n`;
        } else if (data.action === "update") {
          message += `🔄 Updated cart item: <b>${data.product.title}</b>\n`;
          message += `New quantity: ${data.quantity}\n`;
        }
        break;
      
      case "new_product":
        message = `🆕 <b>New Product Listed!</b>\n\n`;
        message += `<b>${data.title}</b>\n`;
        message += `Price: $${data.price.toFixed(2)}\n`;
        message += `Category: ${data.category}\n`;
        if (data.seller) {
          message += `Seller: ${data.seller.username}\n`;
        }
        message += `\nCheck it out in the CU Marketplace app!`;
        break;
      
      default:
        message = `📢 <b>Notification from CU Marketplace</b>\n\n${JSON.stringify(data)}`;
    }
    
    // Send the message via Telegram
    await sendTelegramMessage(profileData.telegram_id, message);
    
    return new Response(
      JSON.stringify({ 
        success: true, 
        message: "Notification sent successfully" 
      }),
      { 
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      }
    );
  } catch (error) {
    console.error("Error sending notification:", error);
    
    return new Response(
      JSON.stringify({ 
        success: false, 
        error: error.message 
      }),
      { 
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      }
    );
  }
});
