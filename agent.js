import { restaurants } from "./restaurants.js";

// 1. FAKE intent (no AI)
function extractIntent(userMessage) {
  console.log("🧠 Extracting intent (FAKE)");

  return {
    mood: userMessage.includes("romantic") ? "romantic" : "casual",
    food: userMessage.includes("pizza") ? "pizza" : "italian",
    intent: "manual-test"
  };
}

// 2. ranking logic
function rankRestaurants(intent) {
  console.log("📊 Ranking restaurants...");

  return restaurants
    .map(r => {
      let score = r.rating;

      if (r.vibe.includes(intent.mood)) score += 1.5;
      if (r.cuisine.includes(intent.food)) score += 1;

      return { ...r, score };
    })
    .sort((a, b) => b.score - a.score);
}

// 3. simple response (NO AI)
function generateFinalAnswer(userMessage, ranked) {
  console.log("💬 Generating response (FAKE)");

  const top = ranked.slice(0, 3);

  return `
Top picks for: ${userMessage}

1. ${top[0].name} - ${top[0].cuisine} (${top[0].vibe})
2. ${top[1].name} - ${top[1].cuisine} (${top[1].vibe})
3. ${top[2].name} - ${top[2].cuisine} (${top[2].vibe})

These are ranked based on rating + vibe + cuisine match.
  `;
}

// // MAIN LOOP
// export async function runAgent(userMessage) {
//   console.log("🚀 Running barebones agent...");

//   const intent = extractIntent(userMessage);
//   console.log("🎯 Intent:", intent);

//   const ranked = rankRestaurants(intent);
//   console.log("🏆 Top result:", ranked[0]);

//   const reply = generateFinalAnswer(userMessage, ranked);

//   return reply;
// }