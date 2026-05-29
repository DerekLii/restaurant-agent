import { loadRestaurants } from "./restaurantStore.js";

const OLLAMA_URL = "http://localhost:11434/api/chat";

function normalize(str = "") {
  return str.toLowerCase().trim();
}

let restaurants = loadRestaurants();

let messages = [
  {
    role: "system",
    content: "You are a restaurant assistant that remembers conversation context."
  }
];


/*
====================================================
1. CALL LLAMA (single safe wrapper)
====================================================
*/
async function callLlama(messages) {
  console.log("➡️ Calling Llama...");

  const res = await fetch(OLLAMA_URL, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      model: "llama3",
      messages,
      stream: false,
      options: {
        num_predict: 120 // prevents long freezing outputs
      }
    })
  });

  const data = await res.json();
  return data.message.content;
}

/*
====================================================
2. INTENT EXTRACTION (LLAMA → JSON SAFE PARSE)
====================================================
*/
async function extractIntent(userMessage) {
  const prompt = `
Return ONLY valid JSON.

User message: "${userMessage}"

Format:
{
  "cuisine": "romantic | casual | fancy | fastfood",
  "vibes": "italian | pizza | sushi | burger",
  "intent": "restaurant_search"
}
`;

  const response = await callLlama([
    { role: "user", content: prompt }
  ]);

  console.log("Response:",response)

  // extract JSON safely (no crash if model adds text)
  const match = response.match(/\{[\s\S]*\}/);
  if (!match) {
    return { mood: "casual", food: "italian", intent: "fallback" };
  }

  try {
    return JSON.parse(match[0]);
  } catch {
    return { mood: "casual", food: "italian", intent: "fallback" };
  }
}
/*
====================================================
3. PURE JS RANKING (NO AI HERE)
====================================================
*/
function rankRestaurants(intent) {
    console.log("ranking restaurants...")
  return restaurants
    .map(r => {
      let score = r.rating;

      if (r.cuisine.includes(intent.cuisine)) score += 1.5;
      if (r.vibes.includes(intent.vibes)) score += 1;

      return { ...r, score };
    })
    .sort((a, b) => b.score - a.score);
}

/*
====================================================
4. FINAL RESPONSE (LLAMA WRITING LAYER)
====================================================
*/
async function generateFinalAnswer(userMessage, ranked) {
  const top3 = ranked.slice(0, 3);

  const prompt = `
User asked: "${userMessage}"

Top restaurants:
${top3.map(r => `- ${r.name} (${r.cuisine}, ${r.vibe})`).join("\n")}

Give a short friendly recommendation in 2-3 sentences.
`;

  return await callLlama([
    { role: "user", content: prompt }
  ]);
}

/*
====================================================
5. MAIN PIPELINE
====================================================
*/
export async function runAgent(userMessage) {
  console.log("🚀 Running Llama agent pipeline...");

  // 1. store user message in memory
  messages.push({
    role: "user",
    content: userMessage
  });

  // 2. intent extraction still works normally
  const intent = await extractIntent(userMessage);
  console.log("🎯 Intent:", intent);

  const ranked = rankRestaurants(intent);
  console.log("🏆 Top:", ranked[0]);

  // 3. generate reply (you can still use ranked results)
  const reply = await generateFinalAnswer(userMessage, ranked);

  // 4. store assistant response in memory
  messages.push({
    role: "assistant",
    content: reply
  });

  return reply;
}