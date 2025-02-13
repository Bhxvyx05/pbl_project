import OpenAI from 'openai';

// Create OpenAI client without API key if not available
const openai = new OpenAI({
  apiKey: import.meta.env.VITE_OPENAI_API_KEY || 'dummy-key',
  dangerouslyAllowBrowser: true
});

// Mock responses for when API key is not available
const mockDietPlan = `# 7-Day Healthy Diet Plan

## Daily Meal Plan
1. Breakfast (300 calories)
   - Oatmeal with fruits
   - Greek yogurt
2. Lunch (400 calories)
   - Quinoa bowl
   - Grilled vegetables
3. Dinner (500 calories)
   - Lean protein
   - Complex carbs
   - Green vegetables

## Macronutrient Breakdown
- Protein: 25%
- Carbs: 45%
- Fats: 30%

## Shopping List
- Oats
- Greek yogurt
- Quinoa
- Vegetables
- Lean meats
- Fish
- Fruits

## Weekly Progress Tracking
- Track weight weekly
- Monitor energy levels
- Take progress photos
- Record measurements`;

export async function generateDietPlan(preferences: {
  goal: string;
  restrictions: string[];
  currentWeight?: number;
  targetWeight?: number;
  activityLevel: string;
}) {
  if (!import.meta.env.VITE_OPENAI_API_KEY || import.meta.env.VITE_OPENAI_API_KEY === 'sk-your-openai-api-key') {
    // Return mock data if no API key is available
    return mockDietPlan;
  }

  const prompt = `Create a detailed weekly diet plan for someone with the following preferences:
    Goal: ${preferences.goal}
    Dietary Restrictions: ${preferences.restrictions.join(', ')}
    Current Weight: ${preferences.currentWeight}kg
    Target Weight: ${preferences.targetWeight}kg
    Activity Level: ${preferences.activityLevel}

    Please provide:
    1. Daily meal plans with calories
    2. Macronutrient breakdown
    3. Shopping list
    4. Cooking instructions
    5. Weekly progress tracking suggestions`;

  try {
    const completion = await openai.chat.completions.create({
      messages: [{ role: "user", content: prompt }],
      model: "gpt-4",
      temperature: 0.7,
    });

    return completion.choices[0].message.content;
  } catch (error) {
    console.error('Error generating diet plan:', error);
    return mockDietPlan;
  }
}

export async function analyzeDietChart(dietPlan: string) {
  if (!import.meta.env.VITE_OPENAI_API_KEY || import.meta.env.VITE_OPENAI_API_KEY === 'sk-your-openai-api-key') {
    return {
      calories: 1800,
      protein: 25,
      carbs: 45,
      fats: 30,
      recommendations: [
        "Increase protein intake",
        "Add more vegetables",
        "Stay hydrated"
      ]
    };
  }

  try {
    const completion = await openai.chat.completions.create({
      messages: [{ 
        role: "user", 
        content: `Analyze this diet plan and provide nutritional breakdown:\n${dietPlan}` 
      }],
      model: "gpt-4",
      temperature: 0.7,
    });

    return completion.choices[0].message.content;
  } catch (error) {
    console.error('Error analyzing diet chart:', error);
    return {
      calories: 1800,
      protein: 25,
      carbs: 45,
      fats: 30,
      recommendations: [
        "Increase protein intake",
        "Add more vegetables",
        "Stay hydrated"
      ]
    };
  }
}

export async function generateMealImage(description: string) {
  // Return a default food image URL since we're not using the API
  return 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&q=80';
}