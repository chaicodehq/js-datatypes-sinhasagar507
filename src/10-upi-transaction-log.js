/**
 * 💸 UPI Transaction Log Analyzer
 *
 * Aaj kal sab UPI pe chalta hai! Tujhe ek month ke transactions ka log
 * milega, aur tujhe pura analysis karna hai - kitna aaya, kitna gaya,
 * kiski saath zyada transactions hue, etc.
 *
 * Rules:
 *   - transactions is array of objects:
 *     [{ id: "TXN001", type: "credit"/"debit", amount: 500,
 *        to: "Rahul", category: "food", date: "2025-01-15" }, ...]
 *   - Skip transactions where amount is not a positive number
 *   - Skip transactions where type is not "credit" or "debit"
 *   - Calculate (on valid transactions only):
 *     - totalCredit: sum of all "credit" type amounts
 *     - totalDebit: sum of all "debit" type amounts
 *     - netBalance: totalCredit - totalDebit
 *     - transactionCount: total number of valid transactions
 *     - avgTransaction: Math.round(sum of all valid amounts / transactionCount)
 *     - highestTransaction: the full transaction object with highest amount
 *     - categoryBreakdown: object with category as key and total amount as value
 *       e.g., { food: 1500, travel: 800 } (include both credit and debit)
 *     - frequentContact: the "to" field value that appears most often
 *       (if tie, return whichever appears first)
 *     - allAbove100: boolean, true if every valid transaction amount > 100 (use every)
 *     - hasLargeTransaction: boolean, true if some valid amount >= 5000 (use some)
 *   - Hint: Use filter(), reduce(), sort(), find(), every(), some(),
 *     Object.entries(), Math.round(), typeof
 *
 * Validation:
 *   - Agar transactions array nahi hai ya empty hai, return null
 *   - Agar after filtering invalid transactions, koi valid nahi bacha, return null
 *
 * @param {Array<{ id: string, type: string, amount: number, to: string, category: string, date: string }>} transactions
 * @returns {{ totalCredit: number, totalDebit: number, netBalance: number, transactionCount: number, avgTransaction: number, highestTransaction: object, categoryBreakdown: object, frequentContact: string, allAbove100: boolean, hasLargeTransaction: boolean } | null}
 *
 * @example
 *   analyzeUPITransactions([
 *     { id: "T1", type: "credit", amount: 5000, to: "Salary", category: "income", date: "2025-01-01" },
 *     { id: "T2", type: "debit", amount: 200, to: "Swiggy", category: "food", date: "2025-01-02" },
 *     { id: "T3", type: "debit", amount: 100, to: "Swiggy", category: "food", date: "2025-01-03" }
 *   ])
 *   // => { totalCredit: 5000, totalDebit: 300, netBalance: 4700,
 *   //      transactionCount: 3, avgTransaction: 1767,
 *   //      highestTransaction: { id: "T1", ... },
 *   //      categoryBreakdown: { income: 5000, food: 300 },
 *   //      frequentContact: "Swiggy", allAbove100: false, hasLargeTransaction: true }
 */
export function analyzeUPITransactions(transactions) {
  // Your code here
  // 1. Check if transactions is a valid non-empty array 
  if (!Array.isArray(transactions) || transactions.length === 0){
    return null; 
  }

  // 2. Filter: Keep only valid transactions (positive amount and correct type)
  const validTxns = transactions.filter(txn => 
    typeof txn.amount === 'number' && 
    txn.amount > 0 && 
    (txn.type === 'credit' || txn.type === 'debit')
  ); 

  // 3. Validation: If no valid transaction left, return null 
  if (validTxns.length === 0) {
    return null; 
  }

  // 4. Calculating using reduce 
  const initialAnalysis = {
    totalCredit: 0,
    totalDebit: 0,
    categoryBreakdown: {},
    contactFrequency: {},
    totalAmountSum: 0
  }

const totals = validTxns.reduce((acc, txn) => {
    // Credit/Debit Sums
    if (txn.type === 'credit') acc.totalCredit += txn.amount;
    if (txn.type === 'debit') acc.totalDebit += txn.amount;

    // Category Breakdown
    acc.categoryBreakdown[txn.category] = (acc.categoryBreakdown[txn.category] || 0) + txn.amount;

    // Contact Frequency Map
    acc.contactFrequency[txn.to] = (acc.contactFrequency[txn.to] || 0) + 1;

    // Running sum for average calculation
    acc.totalAmountSum += txn.amount;

    return acc;
  }, initialAnalysis);

  // 5. Frequent Contact Logic
  let frequentContact = "";
  let maxCount = 0;
  // Using entries to respect order: if tie, first one encountered stays
  for (const [name, count] of Object.entries(totals.contactFrequency)) {
    if (count > maxCount) {
      maxCount = count;
      frequentContact = name;
    }
}

// 6. Final Formatting and Boolean checks
  return {
    totalCredit: totals.totalCredit,
    totalDebit: totals.totalDebit,
    netBalance: totals.totalCredit - totals.totalDebit,
    transactionCount: validTxns.length,
    avgTransaction: Math.round(totals.totalAmountSum / validTxns.length),
    
    // Sort by amount descending and pick the first
    highestTransaction: [...validTxns].sort((a, b) => b.amount - a.amount)[0],
    
    categoryBreakdown: totals.categoryBreakdown,
    frequentContact: frequentContact,
    
    allAbove100: validTxns.every(txn => txn.amount > 100),
    hasLargeTransaction: validTxns.some(txn => txn.amount >= 5000)
  };
}
