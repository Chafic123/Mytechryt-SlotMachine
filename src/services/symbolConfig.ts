export type SymbolType = {
  id: string;
  name: string;
  emoji?: string;
  icon?: string;
  multiplier: number;
};

export const SYMBOLS: SymbolType[] = [
  { id: "cherry", name: "Cherry", emoji: "🍒", multiplier: 2 },
  { id: "lemon", name: "Lemon", emoji: "🍋", multiplier: 2 },
  { id: "orange", name: "Orange", emoji: "🍊", multiplier: 3 },
  { id: "grape",  name: "Grapes", emoji: "🍇", multiplier: 4 },
  { id: "bell",   name: "Bell",   emoji: "🔔", multiplier: 5 },
  { id: "star",   name: "Star",   emoji: "⭐", multiplier: 10 },
];
