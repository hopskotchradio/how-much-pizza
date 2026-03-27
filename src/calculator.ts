import { type FoodType, FOOD_CONFIGS, type OrderResult } from './types';

interface CalcInput {
  foodType: FoodType;
  adults: number;
  kids: number;
  hungerLevel: number; // 0-5
  hasSides: boolean;
  wantLeftovers: boolean;
}

export function calculate(input: CalcInput): OrderResult {
  const config = FOOD_CONFIGS[input.foodType];
  const { adults, kids, hungerLevel, hasSides, wantLeftovers } = input;
  const totalPeople = adults + kids;

  if (totalPeople === 0) {
    return {
      units: 0,
      totalServings: 0,
      servingsPerPerson: 0,
      leftoverServings: 0,
      summary: "No people, no food needed! 🤷",
      tip: "",
    };
  }

  // Hunger multiplier: 0.4x to 1.6x
  const hungerMultiplier = 0.4 + (hungerLevel / 5) * 1.2;

  // Calculate raw servings needed
  let servingsNeeded =
    (adults * config.avgServingsPerAdult + kids * config.avgServingsPerKid) *
    hungerMultiplier;

  // Sides reduce main food by ~20%
  if (hasSides) {
    servingsNeeded *= 0.8;
  }

  // Leftovers add ~15%
  if (wantLeftovers) {
    servingsNeeded *= 1.15;
  }

  // Convert to units and round up
  const rawUnits = servingsNeeded / config.servingsPerUnit;
  const units = Math.ceil(rawUnits);
  const totalServings = units * config.servingsPerUnit;
  const leftoverServings = Math.round(totalServings - servingsNeeded);
  const servingsPerPerson = parseFloat((totalServings / totalPeople).toFixed(1));

  // Build summary
  const unitLabel = units === 1 ? config.unit : config.unitPlural;
  let summary = `Order **${units} ${unitLabel}** (${totalServings} ${config.description})`;
  if (leftoverServings > 0) {
    summary += ` — ~${leftoverServings} ${config.description} leftover`;
  }

  // Fun tips
  const tip = getTip(input, units, servingsPerPerson);

  return {
    units,
    totalServings,
    servingsPerPerson,
    leftoverServings,
    summary,
    tip,
  };
}

function getTip(input: CalcInput, units: number, perPerson: number): string {
  const { foodType, hungerLevel, adults, kids, hasSides } = input;
  const totalPeople = adults + kids;

  if (hungerLevel >= 4 && !hasSides) {
    return "💡 At this hunger level, definitely consider adding sides. Breadsticks are cheaper than another pizza.";
  }

  if (hungerLevel === 0) {
    return "💡 If nobody's hungry, maybe just get drinks? 😄";
  }

  if (kids > adults && foodType === 'pizza') {
    return "💡 More kids than adults? Consider getting a cheese pizza — it's the universal kid consensus.";
  }

  if (totalPeople >= 10 && foodType === 'pizza') {
    return "💡 For big groups, variety helps. Mix up sizes and toppings — not everyone wants pepperoni.";
  }

  if (foodType === 'wings' && units >= 50) {
    return "💡 That's a LOT of wings. Check if the restaurant has a party platter deal.";
  }

  if (foodType === 'chinese' && totalPeople >= 6) {
    return "💡 For Chinese with big groups, order family-style and get one extra dish. Everyone shares, everyone's happy.";
  }

  if (foodType === 'tacos' && hungerLevel >= 3) {
    return "💡 Hungry taco crowd? Get extra shells/tortillas — they're cheap and people always want 'just one more.'";
  }

  if (perPerson > 4 && foodType === 'pizza') {
    return "💡 That's 4+ slices per person. Are you sure about this? No judgment, just checking. 🍕";
  }

  return "";
}
