// SuperMemo SM-2 Spaced Repetition Engine
// Rating:
// 1 = Again (forgot completely)
// 2 = Hard (recalled with significant effort)
// 3 = Good (correct with standard recall)
// 4 = Easy (instant recall, effortless)

function calculateSM2({ repetition = 0, intervalDays = 0, easeFactor = 2.5, rating = 3 }) {
  // Convert 1-4 scale to SM-2 quality 0-5
  // 1 -> 1 (Fail)
  // 2 -> 3 (Pass with difficulty)
  // 3 -> 4 (Pass with hesitation)
  // 4 -> 5 (Perfect recall)
  const qualityMap = { 1: 1, 2: 3, 3: 4, 4: 5 };
  const q = qualityMap[rating] || 3;

  let newRepetition = repetition;
  let newIntervalDays = intervalDays;
  let newEaseFactor = easeFactor;

  // Calculate new Ease Factor: EF' = EF + (0.1 - (5 - q) * (0.08 + (5 - q) * 0.02))
  newEaseFactor = easeFactor + (0.1 - (5 - q) * (0.08 + (5 - q) * 0.02));
  if (newEaseFactor < 1.3) {
    newEaseFactor = 1.3;
  }

  if (q < 3) {
    // Failure (Again)
    newRepetition = 0;
    newIntervalDays = 1; // resurface next day or same day
  } else {
    // Success
    if (newRepetition === 0) {
      newIntervalDays = 1;
    } else if (newRepetition === 1) {
      newIntervalDays = 6;
    } else {
      newIntervalDays = Math.round(intervalDays * newEaseFactor);
      if (rating === 4) {
        // Boost easy items slightly
        newIntervalDays = Math.round(newIntervalDays * 1.3);
      } else if (rating === 2) {
        // Temper hard items
        newIntervalDays = Math.max(1, Math.round(intervalDays * 1.2));
      }
    }
    newRepetition += 1;
  }

  // Calculate next due date
  const nextDueDate = new Date();
  nextDueDate.setDate(nextDueDate.getDate() + newIntervalDays);

  return {
    repetition: newRepetition,
    intervalDays: newIntervalDays,
    easeFactor: parseFloat(newEaseFactor.toFixed(2)),
    dueDate: nextDueDate.toISOString(),
  };
}

module.exports = { calculateSM2 };
