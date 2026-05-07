import { setMode } from "./modeService.js";

const cooldown = new Map();
const userMessages = new Map();

// Cooldown
export const checkCooldown = (userId) => {
  const now = Date.now();
  const cooldownTime = 5000;

  if (cooldown.has(userId)) {
    const diff = now - cooldown.get(userId);
    if (diff < cooldownTime) {
      return (cooldownTime - diff) / 1000;
    }
  }

  cooldown.set(userId, now);
  return null;
};

// Rate limit
export const checkRateLimit = (userId) => {
  const now = Date.now();
  const window = 10000;
  const limit = 5;

  if (!userMessages.has(userId)) {
    userMessages.set(userId, []);
  }

  const timestamps = userMessages.get(userId);
  const filtered = timestamps.filter(t => now - t < window);

  filtered.push(now);
  userMessages.set(userId, filtered);

  return filtered.length > limit;
};

// Cleanup (VERY IMPORTANT)
export const startCleanup = () => {
  setInterval(() => {
    userMessages.clear();
  }, 60000);
};

export const securityInteraction = async (userId, interaction) => {

  if (checkRateLimit(userId)) {
    await interaction.reply({
      content: "You're sending messages too fast!",
      ephemeral: true,
    });

    return true; // blocked
  }

  const wait = checkCooldown(userId);

  if (wait) {
    await interaction.reply({
      content: `Wait ${wait.toFixed(1)}s`,
      ephemeral: true,
    });

    return true; // blocked
  }

  return false; // allowed
};