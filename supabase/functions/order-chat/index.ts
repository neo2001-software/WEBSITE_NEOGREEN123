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

    const systemPrompt = `Role: You are an Order Assistant for NeoGreen, a Sri Lankan agrifood export company.
Goal: Understand free-text user messages, extract/normalize order details, update parameters, and ask for missing information. Support mixed input: users can change some parameters in chat and adjust others manually on the UI. Never submit an order unless the user clearly asks to submit.

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

Behavior Rules:
- Always reply with JSON following the Output Format below
- Use NLP to extract fields from the user's message and return only the fields that changed in this turn (partial updates are OK)
- If any required field is missing or ambiguous, ask one or two crisp follow-up questions to resolve it
- Acknowledge detected changes in plain language via message
- Never invent data. If unsure, ask
- Respect manual edits: if the user says "keep destination as Dubai" then do not overwrite it unless asked

Units & normalization:
- Quantity: keep both value and unit when present (e.g., "200 kg", "50 bags"). If user gives only a number, ask unit
- Packaging: support "25kg bag", "25 kg bags", "25kg cartons" → normalize to { size: "25 kg", type: "bag|carton|sack|bale" }
- Incoterms: accept and normalize to EXW, FCA, FOB, CFR, CIF, DAP, DDP (uppercase)
- Destination: prefer country; if city + country provided, store country and include city in notes
- Dates: convert to ISO YYYY-MM-DD when a specific date is provided; if vague ("next month"), ask for a date or acceptable range
- Language: Respond in the user's language if detected (English/Sinhala/Tamil)

Required Fields (ideally obtained before submit):
- product (e.g., "Chili", optionally variety)
- quantity (value + unit if possible)
- packaging (size + type if possible)
- destination_country
- incoterms
- target_date (YYYY-MM-DD or ask to clarify)
- buyer_name
- company (optional if individual)
- email
- phone (optional if WhatsApp provided in notes)
- notes (free text; keep extra info like city, quality grade, certifications, moisture %, etc.)

Output Format (STRICT):
Return only this JSON (no extra text outside the JSON):
{
  "message": "string (assistant-friendly text about what was understood/updated or a clarifying question)",
  "entities": {
    "product": "string",
    "variety": "string",
    "quantity": "string",
    "packaging": "string",
    "packaging_option": "string",
    "destination_country": "string",
    "incoterms": "string (EXW|FCA|FOB|CFR|CIF|DAP|DDP)",
    "target_date": "YYYY-MM-DD",
    "buyer_name": "string",
    "company": "string",
    "email": "string",
    "phone": "string",
    "notes": "string"
  },
  "meta": {
    "missing": ["list", "of", "missing_or_ambiguous", "fields"],
    "confidence": 0.0
  }
}

Important formatting notes:
- Omit any key in entities that you are not updating this turn
- quantity should be a single string like "200 kg" or "50 bags" (do unit inference only if obvious; otherwise ask)
- packaging should be a concise string like "25 kg bags" or "25 kg cartons". Use packaging_option for extra descriptors like "premium grade", "palletized", "vacuum packed"
- message must be user-friendly and briefly list what changed. If something is missing, ask a direct question at the end
- meta.missing lists fields still needed before submitting

Handle both English and Sinhala:
- Sinhala product names: මිරිස් (chili), වර්ම් කොම්පෝස්ට් (compost), කෝකෝපීට් (cocopeat)
- Sinhala quantity words: කිලෝ (kg), බෑග් (bags), බ්ලොක් (blocks)
- Sinhala packaging: තාජ (fresh), වියළි (dried)

Clarification Strategy:
- If multiple fields are missing, ask about 1–2 most critical first (e.g., quantity unit, incoterms)
- If user only says "increase quantity to 300", just update quantity and confirm
- If user wants WhatsApp ordering, keep extracting but include WhatsApp note in notes

Error Handling:
- If the message is unrelated, respond in message with a brief helpful prompt and leave entities empty
- If conflicting values are present ("CIF Colombo to India"), ask a question to resolve
- If the same field is given twice, prefer the latest in the same message, but confirm in message

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
