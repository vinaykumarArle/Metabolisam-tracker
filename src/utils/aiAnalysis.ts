import type { JournalEntry } from '../store/metabolicStore';

export interface NutritionEstimate {
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
  confidence: number;
}

export interface DailyAnalysis {
  summary: string;
  wellDonePoints: string[];
  improvementAreas: string[];
  patterns: string[];
  moodIndicator: 'positive' | 'neutral' | 'negative';
  confidenceScore: number;
  nutrition: NutritionEstimate;
}

/**
 * Privacy-first local AI analysis using heuristics
 * All processing happens on device - no data sent to servers
 */

// Common food items with estimated nutritional values (per serving)
const FOOD_DATABASE: Record<string, { calories: number; protein: number; carbs: number; fat: number }> = {
  // Proteins
  'chicken': { calories: 165, protein: 31, carbs: 0, fat: 3.6 },
  'fish': { calories: 100, protein: 20, carbs: 0, fat: 1 },
  'beef': { calories: 250, protein: 26, carbs: 0, fat: 15 },
  'eggs': { calories: 155, protein: 13, carbs: 1.1, fat: 11 },
  'tofu': { calories: 76, protein: 8, carbs: 2, fat: 5 },
  'protein': { calories: 120, protein: 25, carbs: 2, fat: 1 },

  // Grains
  'rice': { calories: 206, protein: 4.3, carbs: 45, fat: 0.3 },
  'bread': { calories: 79, protein: 2.7, carbs: 14, fat: 0.9 },
  'pasta': { calories: 131, protein: 5, carbs: 25, fat: 0.3 },
  'oats': { calories: 389, protein: 17, carbs: 66, fat: 7 },
  'cereal': { calories: 150, protein: 3, carbs: 30, fat: 2 },

  // Vegetables
  'broccoli': { calories: 34, protein: 2.8, carbs: 7, fat: 0.4 },
  'salad': { calories: 15, protein: 0.9, carbs: 3, fat: 0.2 },
  'spinach': { calories: 23, protein: 2.9, carbs: 3.6, fat: 0.4 },
  'carrot': { calories: 41, protein: 0.9, carbs: 10, fat: 0.2 },
  'potato': { calories: 77, protein: 2, carbs: 17, fat: 0.1 },

  // Fruits
  'banana': { calories: 89, protein: 1.1, carbs: 23, fat: 0.3 },
  'apple': { calories: 52, protein: 0.3, carbs: 14, fat: 0.2 },
  'orange': { calories: 47, protein: 0.9, carbs: 12, fat: 0.3 },
  'berry': { calories: 43, protein: 0.7, carbs: 11, fat: 0.3 },

  // Dairy
  'milk': { calories: 61, protein: 3.2, carbs: 4.8, fat: 3.3 },
  'yogurt': { calories: 59, protein: 10, carbs: 3.3, fat: 0.4 },
  'cheese': { calories: 402, protein: 25, carbs: 1.3, fat: 33 },

  // Other
  'nuts': { calories: 607, protein: 21, carbs: 27, fat: 54 },
  'oil': { calories: 884, protein: 0, carbs: 0, fat: 100 },
  'butter': { calories: 717, protein: 0.9, carbs: 0.1, fat: 81 },
  'coffee': { calories: 2, protein: 0.3, carbs: 0.3, fat: 0.1 },
  'tea': { calories: 2, protein: 0, carbs: 0.4, fat: 0 },

  // South Indian Foods
  'dosa': { calories: 200, protein: 4, carbs: 40, fat: 3 },
  'idli': { calories: 90, protein: 3, carbs: 18, fat: 0.3 },
  'poori': { calories: 150, protein: 2, carbs: 18, fat: 8 },
  'bonda': { calories: 120, protein: 2, carbs: 15, fat: 6 },
  'uttapam': { calories: 180, protein: 5, carbs: 35, fat: 2 },
  'roti': { calories: 100, protein: 2.5, carbs: 20, fat: 0.5 },
  'chapati': { calories: 100, protein: 2.5, carbs: 20, fat: 0.5 },
  'sambar': { calories: 80, protein: 3, carbs: 12, fat: 1.5 },
  'rasam': { calories: 30, protein: 1, carbs: 5, fat: 0.5 },
  'chutney': { calories: 45, protein: 0.5, carbs: 8, fat: 1.5 },
  'idiyappam': { calories: 150, protein: 2, carbs: 30, fat: 2 },
  'appam': { calories: 140, protein: 2, carbs: 28, fat: 1.5 },
  'upma': { calories: 180, protein: 5, carbs: 30, fat: 4 },
  'pongal': { calories: 200, protein: 6, carbs: 35, fat: 3 },
  'pesarattu': { calories: 160, protein: 5, carbs: 28, fat: 3 },
  'vada': { calories: 200, protein: 7, carbs: 20, fat: 10 },
  'paniyaram': { calories: 140, protein: 2, carbs: 25, fat: 3 },
  'murukku': { calories: 150, protein: 2, carbs: 18, fat: 8 },
  'chakli': { calories: 140, protein: 2, carbs: 16, fat: 7 },

  // North Indian Foods
  'biryani': { calories: 280, protein: 12, carbs: 40, fat: 8 },
  'naan': { calories: 200, protein: 6, carbs: 35, fat: 4 },
  'paratha': { calories: 250, protein: 5, carbs: 35, fat: 10 },
  'dal': { calories: 120, protein: 9, carbs: 20, fat: 1 },
  'paneer': { calories: 200, protein: 25, carbs: 3, fat: 12 },

  // Asian Foods
  'curry': { calories: 200, protein: 8, carbs: 20, fat: 10 },
  'noodles': { calories: 220, protein: 8, carbs: 35, fat: 5 },
  'sushi': { calories: 150, protein: 12, carbs: 18, fat: 4 },
};

// Time-based meal identifiers
const MEAL_TIME_PATTERNS = ['breakfast', 'lunch', 'dinner', 'brunch', 'snack', 'meal', 'ate', 'had', 'morning', 'afternoon', 'evening', 'am', 'pm'];

// Exercise intensity multipliers
const EXERCISE_INTENSITY: Record<string, { caloriesBurned: number; mention: string }> = {
  'walking': { caloriesBurned: 200, mention: 'walking' },
  'walk': { caloriesBurned: 200, mention: 'walk' },
  'ran': { caloriesBurned: 400, mention: 'ran' },
  'run': { caloriesBurned: 400, mention: 'run' },
  'workout': { caloriesBurned: 350, mention: 'workout' },
  'gym': { caloriesBurned: 300, mention: 'gym' },
  'yoga': { caloriesBurned: 150, mention: 'yoga' },
  'swimming': { caloriesBurned: 450, mention: 'swimming' },
  'cycling': { caloriesBurned: 400, mention: 'cycling' },
  'training': { caloriesBurned: 350, mention: 'training' },
  'cardio': { caloriesBurned: 350, mention: 'cardio' },
  'strength': { caloriesBurned: 250, mention: 'strength' },
  'stretching': { caloriesBurned: 50, mention: 'stretching' },
};

const POSITIVE_KEYWORDS = [
  'great',
  'good',
  'excellent',
  'amazing',
  'wonderful',
  'fantastic',
  'loved',
  'healthy',
  'productive',
  'energetic',
  'felt good',
  'accomplished',
  'successful',
  'positive',
  'better',
  'improvement',
  'achieved',
  'completed',
  'easy',
  'smooth',
  'efficient',
  'hydrated',
  'motivated',
  'focused',
  'clear-headed',
];

// Negative keywords and phrases
const NEGATIVE_KEYWORDS = [
  'bad',
  'terrible',
  'awful',
  'horrible',
  'poor',
  'struggled',
  'difficult',
  'tired',
  'exhausted',
  'stressed',
  'anxious',
  'depressed',
  'sad',
  'angry',
  'frustrated',
  'unmotivated',
  'sluggish',
  'bloated',
  'sick',
  'ill',
  'terrible',
  'worst',
  'failed',
  'struggled',
  'dizzy',
  'foggy',
  'unfocused',
];

// Meal-related keywords
const MEAL_KEYWORDS = [
  'breakfast',
  'brunch',
  'lunch',
  'dinner',
  'snack',
  'ate',
  'meal',
  'food',
  'drank',
  'coffee',
  'tea',
  'water',
  'protein',
  'carbs',
  'fat',
  'vegetables',
  'fruit',
  'salad',
  'rice',
  'bread',
  'pasta',
  'chicken',
  'fish',
  'beef',
  'eggs',
  'dosa',
  'idli',
  'poori',
  'bonda',
  'uttapam',
  'roti',
  'chapati',
  'sambar',
  'rasam',
  'chutney',
  'idiyappam',
  'appam',
  'upma',
  'pongal',
  'pesarattu',
  'vada',
  'paniyaram',
  'murukku',
  'chakli',
];

// Exercise keywords
const EXERCISE_KEYWORDS = [
  'exercise',
  'workout',
  'ran',
  'walked',
  'walking',
  'walk',
  'gym',
  'yoga',
  'stretching',
  'cycling',
  'swimming',
  'training',
  'fitness',
  'active',
  'movement',
  'cardio',
  'strength',
  'sport',
];

// Sleep-related keywords
const SLEEP_KEYWORDS = [
  'sleep',
  'slept',
  'rest',
  'nap',
  'tired',
  'awake',
  'insomnia',
  'dream',
  'bed',
  'hours',
  'deep sleep',
  'light sleep',
];

/**
 * Count keyword occurrences (case-insensitive)
 */
const countKeywordMatches = (text: string, keywords: string[]): number => {
  const lowerText = text.toLowerCase();
  return keywords.reduce((count, keyword) => {
    const regex = new RegExp(`\\b${keyword}\\b`, 'gi');
    const matches = lowerText.match(regex);
    return count + (matches ? matches.length : 0);
  }, 0);
};

/**
 * Detect meal tracking
 */
const detectMealTracking = (entries: JournalEntry[]): string[] => {
  const findings: string[] = [];
  const allText = entries.map((e) => e.content).join(' ').toLowerCase();
  
  // Count meals using traditional MEAL_KEYWORDS
  const traditionalMealEntries = entries.filter(
    (e) => countKeywordMatches(e.content, MEAL_KEYWORDS) > 0
  );
  
  // Count meals by looking for food items in FOOD_DATABASE (including South Indian foods)
  let foodItemCount = 0;
  Object.keys(FOOD_DATABASE).forEach((food) => {
    const regex = new RegExp(`\\b${food}s?\\b`, 'gi');
    const matches = allText.match(regex);
    if (matches) {
      foodItemCount += matches.length;
    }
  });
  
  // Count time-based meal entries (e.g., "brunch at 11:00 AM")
  const timeBasedMeals = MEAL_TIME_PATTERNS.filter(pattern => 
    new RegExp(`\\b${pattern}\\b`, 'i').test(allText)
  ).length;
  
  // Total meal count from all detection methods
  const totalMealCount = Math.max(
    traditionalMealEntries.length,
    foodItemCount > 0 ? Math.ceil(foodItemCount / 3) : 0,
    timeBasedMeals
  );

  if (totalMealCount === 0) {
    findings.push('No meal entries logged - consider tracking nutrition');
  } else if (totalMealCount === 1) {
    findings.push('Only one meal logged - try to log all meals for complete tracking');
  } else if (totalMealCount >= 3) {
    findings.push('Good meal tracking consistency');
  }

  return findings;
};

/**
 * Detect exercise activity (including duration-based like "10 min walk")
 */
const detectExercise = (entries: JournalEntry[]): string[] => {
  const findings: string[] = [];
  const allText = entries.map((e) => e.content).join(' ').toLowerCase();
  
  // Check for explicit exercise keywords
  const exerciseEntries = entries.filter(
    (e) => countKeywordMatches(e.content, EXERCISE_KEYWORDS) > 0
  );
  
  // Check for duration-based exercise mentions (e.g., "10 min walk", "30 min workout")
  const durationPattern = /(\d+)\s*(min|minute|hour|hr|hours)\s+(walk|run|exercise|workout|yoga|gym|cycling|swimming|cardio|training)/gi;
  const durationMatches = allText.match(durationPattern);
  const hasDurationExercise = durationMatches && durationMatches.length > 0;

  if (exerciseEntries.length === 0 && !hasDurationExercise) {
    findings.push('No exercise logged - physical activity helps metabolism');
  } else if (hasDurationExercise || exerciseEntries.length > 0) {
    findings.push('Exercise activity detected - keep up the movement');
  }

  return findings;
};

/**
 * Detect sleep patterns
 */
const detectSleep = (entries: JournalEntry[]): string[] => {
  const findings: string[] = [];
  const sleepEntries = entries.filter(
    (e) => countKeywordMatches(e.content, SLEEP_KEYWORDS) > 0
  );

  if (sleepEntries.length > 0) {
    findings.push('Sleep tracking noted - consistent sleep is key');
  }

  return findings;
};

/**
 * Calculate mood based on sentiment keywords
 */
const calculateMood = (entries: JournalEntry[]): 'positive' | 'neutral' | 'negative' => {
  let positiveScore = 0;
  let negativeScore = 0;

  entries.forEach((entry) => {
    positiveScore += countKeywordMatches(entry.content, POSITIVE_KEYWORDS);
    negativeScore += countKeywordMatches(entry.content, NEGATIVE_KEYWORDS);
  });

  if (positiveScore > negativeScore) {
    return 'positive';
  } else if (negativeScore > positiveScore) {
    return 'negative';
  }
  return 'neutral';
};

/**
 * Estimate nutritional values from meal entries
 */
const estimateNutrition = (entries: JournalEntry[]): NutritionEstimate => {
  let totalCalories = 0;
  let totalProtein = 0;
  let totalCarbs = 0;
  let totalFat = 0;
  let matchCount = 0;

  const allText = entries.map((e) => e.content).join(' ').toLowerCase();

  // Search for food items in entries
  Object.entries(FOOD_DATABASE).forEach(([food, nutrition]) => {
    const regex = new RegExp(`\\b${food}s?\\b`, 'g');
    const matches = allText.match(regex);
    if (matches) {
      const count = matches.length;
      totalCalories += nutrition.calories * count;
      totalProtein += nutrition.protein * count;
      totalCarbs += nutrition.carbs * count;
      totalFat += nutrition.fat * count;
      matchCount += count;
    }
  });

  // Estimate calories burned from exercise (both explicit and duration-based)
  let caloriesBurned = 0;
  
  // Method 1: Explicit exercise mentions
  Object.entries(EXERCISE_INTENSITY).forEach(([exercise, data]) => {
    const regex = new RegExp(`\\b${exercise}\\b`, 'gi');
    const matches = allText.match(regex);
    if (matches) {
      caloriesBurned += data.caloriesBurned * matches.length;
    }
  });
  
  // Method 2: Duration-based exercises like "10 min walk", "30 min workout"
  const durationPattern = /(\d+)\s*(min|minute|hour|hr|hours)\s+(walk|run|exercise|workout|yoga|gym|cycling|swimming|cardio|training|stretching)/gi;
  let durationMatch;
  while ((durationMatch = durationPattern.exec(allText)) !== null) {
    const duration = parseInt(durationMatch[1]);
    const exercise = durationMatch[3].toLowerCase();
    
    // Base calories per minute for each exercise
    const caloriesPerMin: Record<string, number> = {
      'walk': 3, 'walking': 3,
      'run': 7, 'running': 7,
      'exercise': 6, 'workout': 6,
      'yoga': 2, 'gym': 5,
      'cycling': 7, 'swimming': 8,
      'cardio': 6, 'training': 5, 'stretching': 1,
    };
    
    const perMin = caloriesPerMin[exercise] || 5;
    caloriesBurned += duration * perMin;
  }

  // Net calories
  const netCalories = Math.max(0, totalCalories - caloriesBurned);

  // Confidence based on matches found
  const confidence = Math.min(matchCount / 5, 1);

  return {
    calories: Math.round(netCalories),
    protein: Math.round(totalProtein * 10) / 10,
    carbs: Math.round(totalCarbs * 10) / 10,
    fat: Math.round(totalFat * 10) / 10,
    confidence,
  };
};

/**
 * Generate personalized improvement suggestions based on actual data
 */
const generateImprovements = (entries: JournalEntry[], nutrition: NutritionEstimate): string[] => {
  const improvements: string[] = [];
  const allText = entries.map((e) => e.content).join(' ').toLowerCase();
  
  const mealEntries = entries.filter(
    (e) => countKeywordMatches(e.content, MEAL_KEYWORDS) > 0
  );
  const exerciseEntries = entries.filter(
    (e) => countKeywordMatches(e.content, EXERCISE_KEYWORDS) > 0
  );
  const walkingMentioned = allText.includes('walk');

  // Smart meal suggestions based on content
  if (mealEntries.length === 0) {
    improvements.push('No meals logged - track your nutrition intake');
  } else if (mealEntries.length === 1) {
    improvements.push('Only one meal logged - aim for 3+ meals daily');
  } else if (nutrition.protein < 40) {
    improvements.push('Consider increasing protein intake (current: ~' + Math.round(nutrition.protein) + 'g)');
  } else if (nutrition.carbs < 50) {
    improvements.push('Add more complex carbs for sustained energy');
  }

  // Smart exercise suggestions (don't suggest if already done)
  if (exerciseEntries.length === 0) {
    improvements.push('Add physical activity - any movement counts');
  } else if (exerciseEntries.length > 0) {
    // Any exercise logged is good - suggest variety or strength training
    if (walkingMentioned && exerciseEntries.length === 1) {
      improvements.push('Great activity! Consider adding strength training for balance');
    } else if (exerciseEntries.length > 1) {
      improvements.push('Excellent exercise variety - keep it up');
    } else {
      improvements.push('Good exercise logged - keep moving!');
    }
  }

  // Hydration
  if (!allText.includes('water') && !allText.includes('hydrat')) {
    improvements.push('Log water intake - aim for 2-3L daily');
  }

  // Stress management
  const negativeCount = countKeywordMatches(allText, NEGATIVE_KEYWORDS);
  if (negativeCount > 2) {
    improvements.push('Try mindfulness or deep breathing for stress relief');
  }

  return improvements.slice(0, 3); // Limit to 3 suggestions
};

/**
 * Analyze daily journal entries
 * All processing is local - no data leaves the device
 */
export const analyzeDay = (entries: JournalEntry[], weight?: number): DailyAnalysis => {
  if (entries.length === 0) {
    return {
      summary: 'No entries logged yet. Start tracking to get personalized insights.',
      wellDonePoints: [],
      improvementAreas: ['Log some entries to receive analysis'],
      patterns: [],
      moodIndicator: 'neutral',
      confidenceScore: 0,
      nutrition: { calories: 0, protein: 0, carbs: 0, fat: 0, confidence: 0 },
    };
  }

  const mood = calculateMood(entries);
  const mealPatterns = detectMealTracking(entries);
  const exercisePatterns = detectExercise(entries);
  const sleepPatterns = detectSleep(entries);
  const nutrition = estimateNutrition(entries);
  const improvements = generateImprovements(entries, nutrition);

  // Combine all patterns
  const allPatterns = [...mealPatterns, ...exercisePatterns, ...sleepPatterns].filter(
    (p) => !p.includes('No') && !p.includes('Only')
  );

  // Generate summary based on patterns
  const summaryParts: string[] = [];
  if (mood === 'positive') {
    summaryParts.push('Great day logged with positive energy');
  } else if (mood === 'negative') {
    summaryParts.push('Challenging day - focus on recovery');
  } else {
    summaryParts.push('Day tracked - consistent logging is building good habits');
  }

  if (entries.length >= 5) {
    summaryParts.push('with detailed tracking');
  }
  if (weight) {
    summaryParts.push('and weight recorded');
  }

  const summary = summaryParts.join(' ') + '.';

  // Calculate confidence (higher with more entries)
  const confidenceScore = Math.min(entries.length / 10, 1);

  return {
    summary,
    wellDonePoints: [
      `Logged ${entries.length} entries`,
      ...allPatterns,
      mood === 'positive' ? 'Positive energy detected' : null,
    ].filter(Boolean) as string[],
    improvementAreas: improvements,
    patterns: allPatterns,
    moodIndicator: mood,
    confidenceScore,
    nutrition,
  };
};

/**
 * Generate insights from daily analysis
 */
export const generateInsights = (analysis: DailyAnalysis): string => {
  const lines: string[] = [];

  lines.push(analysis.summary);
  lines.push('');

  // Nutrition section
  if (analysis.nutrition.calories > 0 || analysis.nutrition.confidence > 0) {
    lines.push('🥗 Nutrition Estimate:');
    lines.push(`  • Calories: ${analysis.nutrition.calories} kcal`);
    lines.push(`  • Protein: ${analysis.nutrition.protein}g`);
    lines.push(`  • Carbs: ${analysis.nutrition.carbs}g`);
    lines.push(`  • Fat: ${analysis.nutrition.fat}g`);
    if (analysis.nutrition.confidence < 0.5) {
      lines.push(`  (Confidence: Low - log more specific meals)`);
    }
    lines.push('');
  }

  if (analysis.wellDonePoints.length > 0) {
    lines.push('✅ Well Done:');
    analysis.wellDonePoints.forEach((point) => {
      lines.push(`  • ${point}`);
    });
    lines.push('');
  }

  if (analysis.improvementAreas.length > 0) {
    lines.push('💡 Suggestions:');
    analysis.improvementAreas.forEach((area) => {
      lines.push(`  • ${area}`);
    });
  }

  return lines.join('\n');
};

/**
 * AI-powered emoji detection for journal entries
 * Analyzes entry content and returns appropriate emoji based on type
 */
export const detectEntryEmoji = (content: string): string => {
  const lower = content.toLowerCase();

  // Meal/food detection patterns
  const breakfastItems = ['breakfast', 'brunch', 'cereal', 'toast', 'eggs', 'pancakes', 'bacon', 'oatmeal', 'granola', 'smoothie', 'coffee', 'tea'];
  const lunchDinnerItems = ['lunch', 'dinner', 'chicken', 'fish', 'beef', 'pasta', 'rice', 'salad', 'steak', 'burger', 'sandwich', 'pizza', 'tacos'];
  const snackItems = ['snack', 'chips', 'chocolate', 'candy', 'cookie', 'donut', 'cake', 'bar', 'granola', 'nuts', 'fruit', 'apple', 'banana', 'orange', 'yogurt', 'ice cream', 'popcorn'];
  const drinkItems = ['water', 'juice', 'soda', 'coffee', 'tea', 'milk', 'smoothie', 'drink', 'beer', 'wine', 'alcohol', 'coke', 'sprite'];
  
  // South Indian foods
  const southIndianItems = ['dosa', 'idli', 'poori', 'sambar', 'rasam', 'upma', 'uttapam', 'vada', 'appam', 'puttu', 'chakli', 'murukku'];

  // Exercise detection patterns
  const walkingItems = ['walk', 'walking', 'stroll', 'ran', 'run', 'jogging', 'jog'];
  const gymItems = ['gym', 'workout', 'training', 'weight', 'lifting', 'squat', 'bench', 'deadlift', 'cardio', 'treadmill'];
  const yogaItems = ['yoga', 'stretch', 'pilates', 'meditation', 'breathwork'];
  const sportsItems = ['cycling', 'bike', 'swimming', 'swim', 'tennis', 'basketball', 'football', 'soccer', 'badminton', 'cricket'];
  const runningItems = ['run', 'running', 'sprint', 'marathon', 'race'];

  // Check for exercise/activity first
  if (runningItems.some(item => lower.includes(item))) {
    return '🏃';
  }
  if (walkingItems.some(item => lower.includes(item))) {
    return '🚶';
  }
  if (gymItems.some(item => lower.includes(item))) {
    return '💪';
  }
  if (yogaItems.some(item => lower.includes(item))) {
    return '🧘';
  }
  if (sportsItems.some(item => lower.includes(item))) {
    return '⚽';
  }

  // Check for meal times
  if (breakfastItems.some(item => lower.includes(item))) {
    return '🌅';
  }
  if (lunchDinnerItems.some(item => lower.includes(item))) {
    if (lower.includes('dinner') || lower.includes('evening')) {
      return '🍽️';
    }
    return '🥗';
  }

  // Check for specific drink items
  if (drinkItems.some(item => lower.includes(item))) {
    if (lower.includes('water')) return '💧';
    if (lower.includes('coffee') || lower.includes('tea')) return '☕';
    if (lower.includes('juice')) return '🧃';
    if (lower.includes('alcohol') || lower.includes('beer') || lower.includes('wine')) return '🍷';
    return '🥤';
  }

  // Check for snacks
  if (snackItems.some(item => lower.includes(item))) {
    if (lower.includes('chocolate') || lower.includes('candy')) return '🍫';
    if (lower.includes('fruit') || lower.includes('apple') || lower.includes('banana') || lower.includes('orange')) return '🍎';
    if (lower.includes('nuts')) return '🥜';
    if (lower.includes('ice cream')) return '🍦';
    return '🍿';
  }

  // Check for South Indian foods
  if (southIndianItems.some(item => lower.includes(item))) {
    return '🍛';
  }

  // Default food emoji
  if (lower.includes('food') || lower.includes('eat') || lower.includes('eating') || lower.includes('ate')) {
    return '🍴';
  }

  // Default activity emoji
  if (lower.includes('exercise') || lower.includes('activity') || lower.includes('movement')) {
    return '🏋️';
  }

  // Generic entry
  return '📝';
};

