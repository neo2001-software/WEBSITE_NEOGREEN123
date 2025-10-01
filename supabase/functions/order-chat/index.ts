import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { messages } = await req.json();
    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    
    if (!LOVABLE_API_KEY) {
      throw new Error("LOVABLE_API_KEY is not configured");
    }

    const systemPrompt = `You are an order assistant for NeoGreen Agribusiness, a Sri Lankan agricultural company. 
Your job is to help buyers place orders by understanding their requirements in natural language (English or Sinhala).

Products available:
1. Premium Chili (Hot Dragon F1 / Scotch Bonnet)
   - Packaging: 5kg, 10kg, or 25kg export cartons
   - Options: Fresh or Dried
   - HS Code: 070960 (fresh) / 090420 (dried)

2. Organic Worm Compost
   - Packaging: 5kg or 25kg bags
   - HS Code: 310100

3. Premium Cocopeat
   - Packaging: 5kg or 25kg blocks
   - Options: Washed or Unwashed
   - HS Code: 530500

Extract the following entities from the user's message and respond in a structured JSON format:
{
  "entities": {
    "product": "Premium Chili | Organic Worm Compost | Premium Cocopeat",
    "variety": "Hot Dragon F1 | Scotch Bonnet (for chili only)",
    "quantity": "number with unit (kg/bags/blocks/cartons)",
    "packaging": "5kg | 10kg | 25kg",
    "packaging_option": "Fresh | Dried | Washed | Unwashed",
    "destination_country": "country name",
    "incoterms": "EXW | FOB | CIF",
    "target_date": "YYYY-MM-DD or natural language date",
    "buyer_name": "name",
    "company": "company name",
    "email": "email address",
    "phone": "phone number"
  },
  "message": "A friendly confirmation or follow-up question in the user's language",
  "missing_fields": ["array of required fields still needed"],
  "ready_to_submit": false
}

Required fields: product, quantity, destination_country, buyer_name, email

Handle both English and Sinhala:
- Sinhala product names: මිරිස් (chili), වර්ම් කොම්පෝස්ට් (compost), කෝකෝපීට් (cocopeat)
- Sinhala quantity words: කිලෝ (kg), බෑග් (bags), බ්ලොක් (blocks)
- Sinhala packaging: තාජ (fresh), වියළි (dried)

Be conversational and helpful. If information is ambiguous, ask clarifying questions.`;

    const response = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${LOVABLE_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "google/gemini-2.5-flash",
        messages: [
          { role: "system", content: systemPrompt },
          ...messages,
        ],
      }),
    });

    if (!response.ok) {
      if (response.status === 429) {
        return new Response(
          JSON.stringify({ error: "Rate limits exceeded, please try again later." }),
          { status: 429, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }
      if (response.status === 402) {
        return new Response(
          JSON.stringify({ error: "Payment required, please add funds to your Lovable AI workspace." }),
          { status: 402, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }
      const errorText = await response.text();
      console.error("AI gateway error:", response.status, errorText);
      return new Response(
        JSON.stringify({ error: "AI gateway error" }),
        { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const data = await response.json();
    const aiMessage = data.choices[0].message.content;

    return new Response(JSON.stringify({ message: aiMessage }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (error) {
    console.error("order-chat error:", error);
    return new Response(
      JSON.stringify({ error: error instanceof Error ? error.message : "Unknown error" }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
