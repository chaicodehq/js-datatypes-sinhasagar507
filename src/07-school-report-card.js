/**
 * 📝 School Report Card Generator
 *
 * Sharma ji ke bete ka report card generate karna hai! Student ka naam aur
 * subjects ke marks milenge, tujhe pura analysis karke report card banana hai.
 *
 * Rules:
 *   - student object: { name: "Rahul", marks: { maths: 85, science: 92, ... } }
 *   - Calculate using Object.values() and array methods:
 *     - totalMarks: sum of all marks (use reduce)
 *     - percentage: (totalMarks / (numSubjects * 100)) * 100,
 *       rounded to 2 decimal places using parseFloat(val.toFixed(2))
 *     - grade based on percentage:
 *       "A+" (>= 90), "A" (>= 80), "B" (>= 70), "C" (>= 60), "D" (>= 40), "F" (< 40)
 *     - highestSubject: subject name with highest marks (use Object.entries)
 *     - lowestSubject: subject name with lowest marks
 *     - passedSubjects: array of subject names where marks >= 40 (use filter)
 *     - failedSubjects: array of subject names where marks < 40
 *     - subjectCount: total number of subjects (Object.keys().length)
 *   - Hint: Use Object.keys(), Object.values(), Object.entries(),
 *     reduce(), filter(), map(), Math.max(), Math.min(), toFixed()
 *
 * Validation:
 *   - Agar student object nahi hai ya null hai, return null
 *   - Agar student.name string nahi hai ya empty hai, return null
 *   - Agar student.marks object nahi hai ya empty hai (no keys), return null
 *   - Agar koi mark valid number nahi hai (not between 0 and 100 inclusive),
 *     return null
 *
 * @param {{ name: string, marks: Object<string, number> }} student
 * @returns {{ name: string, totalMarks: number, percentage: number, grade: string, highestSubject: string, lowestSubject: string, passedSubjects: string[], failedSubjects: string[], subjectCount: number } | null}
 *
 * @example
 *   generateReportCard({ name: "Rahul", marks: { maths: 85, science: 92, english: 78 } })
 *   // => { name: "Rahul", totalMarks: 255, percentage: 85, grade: "A",
 *   //      highestSubject: "science", lowestSubject: "english",
 *   //      passedSubjects: ["maths", "science", "english"], failedSubjects: [],
 *   //      subjectCount: 3 }
 *
 *   generateReportCard({ name: "Priya", marks: { maths: 35, science: 28 } })
 *   // => { name: "Priya", totalMarks: 63, percentage: 31.5, grade: "F", ... }
 */
export function generateReportCard(student) {
  // Your code here
  // 1. Basic Validation
  if (!student || typeof student !== 'object') return null;
  if (typeof student.name !== 'string' || student.name.trim() === "") return null;
  
  const marks = student.marks;
  if (!marks || typeof marks !== 'object' || Object.keys(marks).length === 0) return null;

  // 2. Validate Marks (Must be numbers between 0-100)
  const entries = Object.entries(marks);
  for (const [subject, score] of entries) {
    if (typeof score !== 'number' || score < 0 || score > 100 || isNaN(score)) {
      return null;
    }
  }

  // 3. Core Calculations
  const subjectCount = entries.length;
  const markValues = Object.values(marks);
  
  const totalMarks = markValues.reduce((sum, val) => sum + val, 0);
  const percentage = parseFloat(((totalMarks / (subjectCount * 100)) * 100).toFixed(2));

  // 4. Determine Grade
  let grade;
  if (percentage >= 90) grade = "A+";
  else if (percentage >= 80) grade = "A";
  else if (percentage >= 70) grade = "B";
  else if (percentage >= 60) grade = "C";
  else if (percentage >= 40) grade = "D";
  else grade = "F";

  // 5. Subject Analysis (Highest, Lowest, Passed, Failed)
  // Using reduce to find keys based on values
  const highestSubject = entries.reduce((max, curr) => curr[1] > max[1] ? curr : max)[0];
  const lowestSubject = entries.reduce((min, curr) => curr[1] < min[1] ? curr : min)[0];

  const passedSubjects = entries
    .filter(([_, score]) => score >= 40)
    .map(([subject]) => subject);

  const failedSubjects = entries
    .filter(([_, score]) => score < 40)
    .map(([subject]) => subject);

  // 6. Return the full analysis
  return {
    name: student.name,
    totalMarks,
    percentage,
    grade,
    highestSubject,
    lowestSubject,
    passedSubjects,
    failedSubjects,
    subjectCount
  };
}
