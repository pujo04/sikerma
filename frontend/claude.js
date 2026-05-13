import Anthropic from "@anthropic-ai/sdk";

console.log("API KEY:", process.env.ANTHROPIC_API_KEY); // DEBUG

const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY,
});

const msg = await anthropic.messages.create({
  model: "claude-3-5-sonnet-20240620",
  max_tokens: 100,
  messages: [{ role: "user", content: "Halo Claude, tes koneksi" }],
});

console.log(msg.content[0].text);
