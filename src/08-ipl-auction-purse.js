/**
 * 🏏 IPL Auction Purse Manager
 *
 * IPL mega auction chal rahi hai! Team ka total purse (budget) diya hai
 * aur players ki list di hai jinhe khareedna hai. Tujhe calculate karna
 * hai ki team ne kitna spend kiya, kitna bacha, aur kuch stats banana hai.
 *
 * Rules:
 *   - team object: { name: "CSK", purse: 9000 } (purse in lakhs)
 *   - players array: [{ name: "Dhoni", role: "wk", price: 1200 }, ...]
 *   - role can be: "bat", "bowl", "ar" (all-rounder), "wk" (wicketkeeper)
 *   - Calculate:
 *     - totalSpent: sum of all player prices (use reduce)
 *     - remaining: purse - totalSpent
 *     - playerCount: total players bought
 *     - costliestPlayer: player object with highest price
 *     - cheapestPlayer: player object with lowest price
 *     - averagePrice: Math.round(totalSpent / playerCount)
 *     - byRole: object counting players per role using reduce
 *       e.g., { bat: 3, bowl: 4, ar: 2, wk: 1 }
 *     - isOverBudget: boolean, true agar totalSpent > purse
 *   - Hint: Use reduce(), filter(), sort(), find(), every(), some(),
 *     Array.isArray(), Math.round(), spread operator
 *
 * Validation:
 *   - Agar team object nahi hai ya team.purse positive number nahi hai, return null
 *   - Agar players array nahi hai ya empty hai, return null
 *
 * @param {{ name: string, purse: number }} team - Team info with budget
 * @param {Array<{ name: string, role: string, price: number }>} players
 * @returns {{ teamName: string, totalSpent: number, remaining: number, playerCount: number, costliestPlayer: object, cheapestPlayer: object, averagePrice: number, byRole: object, isOverBudget: boolean } | null}
 *
 * @example
 *   iplAuctionSummary(
 *     { name: "CSK", purse: 9000 },
 *     [{ name: "Dhoni", role: "wk", price: 1200 }, { name: "Jadeja", role: "ar", price: 1600 }]
 *   )
 *   // => { teamName: "CSK", totalSpent: 2800, remaining: 6200, playerCount: 2,
 *   //      costliestPlayer: { name: "Jadeja", role: "ar", price: 1600 },
 *   //      cheapestPlayer: { name: "Dhoni", role: "wk", price: 1200 },
 *   //      averagePrice: 1400, byRole: { wk: 1, ar: 1 }, isOverBudget: false }
 *
 *   iplAuctionSummary({ name: "RCB", purse: 500 }, [{ name: "Kohli", role: "bat", price: 1700 }])
 *   // => { ..., remaining: -1200, isOverBudget: true }
 */
export function iplAuctionSummary(team, players) {
  // Your code here
  // 1. Validation: Team checks
  if (!team || typeof team.purse !== 'number' || team.purse <= 0) {
    return null;
  }

  // 2. Validation: Players checks
  if (!Array.isArray(players) || players.length === 0) {
    return null;
  }

  // 3. Calculate Total Spent using reduce
  const totalSpent = players.reduce((sum, player) => sum + player.price, 0);

  // 4. Find Costliest and Cheapest Players
  // We use reduce to compare prices one by one
  const costliestPlayer = players.reduce((max, p) => (p.price > max.price ? p : max), players[0]);
  const cheapestPlayer = players.reduce((min, p) => (p.price < min.price ? p : min), players[0]);

  // 5. Calculate Average Price (Rounded)
  const playerCount = players.length;
  const averagePrice = Math.round(totalSpent / playerCount);

  // 6. Calculate byRole distribution using reduce
  const byRole = players.reduce((acc, player) => {
    const role = player.role;
    acc[role] = (acc[role] || 0) + 1;
    return acc;
  }, {});

  // 7. Budget Analysis
  const remaining = team.purse - totalSpent;
  const isOverBudget = totalSpent > team.purse;

  // 8. Return the full Summary Object
  return {
    teamName: team.name,
    totalSpent,
    remaining,
    playerCount,
    costliestPlayer: { ...costliestPlayer },
    cheapestPlayer: { ...cheapestPlayer },
    averagePrice,
    byRole,
    isOverBudget
  };
}
