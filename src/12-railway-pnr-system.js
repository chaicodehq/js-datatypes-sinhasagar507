/**
 * 🚂 Indian Railway PNR Status System
 *
 * IRCTC ka PNR status system bana! PNR data milega with train info,
 * passengers, aur current statuses. Tujhe ek complete status report
 * generate karna hai with formatted output aur analytics.
 *
 * pnrData object:
 *   {
 *     pnr: "1234567890",
 *     train: { number: "12301", name: "Rajdhani Express", from: "NDLS", to: "HWH" },
 *     classBooked: "3A",
 *     passengers: [
 *       { name: "Rahul Kumar", age: 28, gender: "M", booking: "B1", current: "B1" },
 *       { name: "Priya Sharma", age: 25, gender: "F", booking: "WL5", current: "B3" },
 *       { name: "Amit Singh", age: 60, gender: "M", booking: "WL12", current: "WL8" }
 *     ]
 *   }
 *
 * Status rules (based on current field):
 *   - Starts with "B" or "S" (berth/seat) => status = "CONFIRMED"
 *   - Starts with "WL" => status = "WAITING"
 *   - Equals "CAN" => status = "CANCELLED"
 *   - Starts with "RAC" => status = "RAC"
 *
 * For each passenger generate:
 *   - formattedName: name.padEnd(20) + "(" + age + "/" + gender + ")"
 *   - bookingStatus: booking field value
 *   - currentStatus: current field value
 *   - statusLabel: one of "CONFIRMED", "WAITING", "CANCELLED", "RAC"
 *   - isConfirmed: boolean (true only if statusLabel === "CONFIRMED")
 *
 * Summary (use array methods on processed passengers):
 *   - totalPassengers: count of passengers
 *   - confirmed: count of CONFIRMED
 *   - waiting: count of WAITING
 *   - cancelled: count of CANCELLED
 *   - rac: count of RAC
 *   - allConfirmed: boolean - every passenger confirmed? (use every)
 *   - anyWaiting: boolean - some passenger waiting? (use some)
 *
 * Other fields:
 *   - chartPrepared: true if every NON-CANCELLED passenger is confirmed
 *   - pnrFormatted: "123-456-7890" (3-3-4 dash pattern, use slice + join or concatenation)
 *   - trainInfo: template literal =>
 *     "Train: {number} - {name} | {from} → {to} | Class: {classBooked}"
 *
 * Hint: Use padEnd(), slice(), join(), map(), filter(), every(), some(),
 *   startsWith(), template literals, typeof, Array.isArray()
 *
 * Validation:
 *   - Agar pnrData object nahi hai ya null hai, return null
 *   - Agar pnr string nahi hai ya exactly 10 digits nahi hai, return null
 *   - Agar train object missing hai, return null
 *   - Agar passengers array nahi hai ya empty hai, return null
 *
 * @param {object} pnrData - PNR data object
 * @returns {{ pnrFormatted: string, trainInfo: string, passengers: Array<{ formattedName: string, bookingStatus: string, currentStatus: string, statusLabel: string, isConfirmed: boolean }>, summary: { totalPassengers: number, confirmed: number, waiting: number, cancelled: number, rac: number, allConfirmed: boolean, anyWaiting: boolean }, chartPrepared: boolean } | null}
 *
 * @example
 *   processRailwayPNR({
 *     pnr: "1234567890",
 *     train: { number: "12301", name: "Rajdhani Express", from: "NDLS", to: "HWH" },
 *     classBooked: "3A",
 *     passengers: [
 *       { name: "Rahul", age: 28, gender: "M", booking: "B1", current: "B1" }
 *     ]
 *   })
 *   // => { pnrFormatted: "123-456-7890",
 *   //      trainInfo: "Train: 12301 - Rajdhani Express | NDLS → HWH | Class: 3A",
 *   //      passengers: [...], summary: { ..., allConfirmed: true }, chartPrepared: true }
 */
export function processRailwayPNR(pnrData) {
// 1. Strict Validation: Chcking if the data is valid IRCTC material
  if (!pnrData || typeof pnrData !== 'object') return null;
  
  const { pnr, train, passengers: rawPassengers, classBooked } = pnrData;
  
  // PNR must be exactly 10 digits
  if (typeof pnr !== 'string' || pnr.length !== 10 || isNaN(pnr)) return null;
  if (!train || typeof train !== 'object') return null;
  if (!Array.isArray(rawPassengers) || rawPassengers.length === 0) return null;

  // 2. PNR Formatting: Creating the 3-3-4 dash pattern
  // Example: 1234567890 -> 123-456-7890
  const pnrFormatted = `${pnr.slice(0, 3)}-${pnr.slice(3, 6)}-${pnr.slice(6)}`;

  // 3. Train Info Header
  const trainInfo = `Train: ${train.number} - ${train.name} | ${train.from} → ${train.to} | Class: ${classBooked ?? "N/A"}`;

  // 4. Passenger Processing (The heart of the system)
  const processedPassengers = rawPassengers.map(p => {
    let statusLabel = "WAITING"; // Default
    const current = p.current?.toUpperCase() ?? "";

    if (current === "CAN") {
      statusLabel = "CANCELLED";
    } else if (current.startsWith("RAC")) {
      statusLabel = "RAC";
    } else if (current.startsWith("WL")) {
      statusLabel = "WAITING";
    } else if (current.startsWith("B") || current.startsWith("S") || current.startsWith("A") || current.startsWith("M")) {
      // B (3A), S (SL), A (2A), M (3E) - all are confirmed berths
      statusLabel = "CONFIRMED";
    } else {
      // Catch-all for other confirmed patterns (like CNF)
      statusLabel = "CONFIRMED";
    }

    return {
      formattedName: p.name.padEnd(20) + `(${p.age}/${p.gender})`,
      bookingStatus: p.booking,
      currentStatus: p.current,
      statusLabel,
      isConfirmed: statusLabel === "CONFIRMED"
    };
  });

  // 5. Analytics & Summary (Using reduce to be efficient)
  const summary = processedPassengers.reduce((acc, p) => {
    acc.totalPassengers++;
    if (p.statusLabel === "CONFIRMED") acc.confirmed++;
    else if (p.statusLabel === "WAITING") acc.waiting++;
    else if (p.statusLabel === "CANCELLED") acc.cancelled++;
    else if (p.statusLabel === "RAC") acc.rac++;
    return acc;
  }, { 
    totalPassengers: 0, confirmed: 0, waiting: 0, cancelled: 0, rac: 0 
  });

  // Boolean logic for the group
  summary.allConfirmed = processedPassengers.every(p => p.isConfirmed);
  summary.anyWaiting = processedPassengers.some(p => p.statusLabel === "WAITING");

  // 6. Chart Preparation Logic:
  // Every passenger who hasn't cancelled must have a confirmed seat.
  const chartPrepared = processedPassengers
    .filter(p => p.statusLabel !== "CANCELLED")
    .every(p => p.isConfirmed);

  return {
    pnrFormatted,
    trainInfo,
    passengers: processedPassengers,
    summary,
    chartPrepared
  };
}
