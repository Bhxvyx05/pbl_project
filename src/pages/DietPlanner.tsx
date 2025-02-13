import React, { useState, useEffect } from 'react';
import { Brain, Calculator, Upload, Dumbbell, Send, FileText, Calendar, TrendingUp, ChefHat, Apple, Scale, Target } from 'lucide-react';
import { motion } from 'framer-motion';
import { supabase } from '../lib/supabase';
import { useAuth } from '../contexts/AuthContext';
import { generateDietPlan } from '../lib/openai';
import { Line } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
} from 'chart.js';

// Register ChartJS components
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

interface DietPlan {
  meal: string;
  foods: string[];
  calories: number;
}

interface DietAnalysis {
  totalCalories: number;
  protein: number;
  carbs: number;
  fats: number;
  recommendations: string[];
}

interface WeightProgress {
  date: string;
  weight: number;
}

interface CalorieProgress {
  date: string;
  calories: number;
}

export default function DietPlanner() {
  const [selectedTab, setSelectedTab] = useState('ai');
  const [dietGoal, setDietGoal] = useState('weight_loss');
  const [restrictions, setRestrictions] = useState<string[]>([]);
  const [currentWeight, setCurrentWeight] = useState<number>(0);
  const [targetWeight, setTargetWeight] = useState<number>(0);
  const [activityLevel, setActivityLevel] = useState('moderate');
  const [generatedPlan, setGeneratedPlan] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [weightProgress, setWeightProgress] = useState<WeightProgress[]>([]);
  const [calorieProgress, setCalorieProgress] = useState<CalorieProgress[]>([]);
  const { user } = useAuth();

  useEffect(() => {
    if (user) {
      loadProgress();
    }
  }, [user]);

  const loadProgress = async () => {
    if (!user) return;

    // Load weight progress
    const { data: weightData } = await supabase
      .from('weight_progress')
      .select('date, weight')
      .eq('user_id', user.id)
      .order('date', { ascending: true });

    if (weightData) {
      setWeightProgress(weightData);
    }

    // Load calorie progress
    const { data: calorieData } = await supabase
      .from('calorie_progress')
      .select('date, calories')
      .eq('user_id', user.id)
      .order('date', { ascending: true });

    if (calorieData) {
      setCalorieProgress(calorieData);
    }
  };

  const handleGeneratePlan = async () => {
    setIsLoading(true);
    try {
      const plan = await generateDietPlan({
        goal: dietGoal,
        restrictions,
        currentWeight,
        targetWeight,
        activityLevel
      });
      
      setGeneratedPlan(plan || '');
      setSelectedTab('planner'); // Automatically switch to planner tab
      
      // Save the plan to the database
      if (user) {
        await supabase.from('diet_plans').insert({
          user_id: user.id,
          plan_data: plan,
          goal: dietGoal,
          start_date: new Date().toISOString(),
          end_date: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString() // 7 days from now
        });
      }
    } catch (error) {
      console.error('Error generating diet plan:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const updateProgress = async (weight: number, calories: number) => {
    if (!user) return;

    const today = new Date().toISOString().split('T')[0];

    // Update weight progress
    await supabase.from('weight_progress').upsert({
      user_id: user.id,
      date: today,
      weight
    });

    // Update calorie progress
    await supabase.from('calorie_progress').upsert({
      user_id: user.id,
      date: today,
      calories
    });

    // Reload progress
    await loadProgress();
  };

  const weightChartData = {
    labels: weightProgress.map(p => new Date(p.date).toLocaleDateString()),
    datasets: [{
      label: 'Weight Progress',
      data: weightProgress.map(p => p.weight),
      borderColor: 'rgb(34, 197, 94)',
      tension: 0.1
    }]
  };

  const calorieChartData = {
    labels: calorieProgress.map(p => new Date(p.date).toLocaleDateString()),
    datasets: [{
      label: 'Calorie Intake',
      data: calorieProgress.map(p => p.calories),
      borderColor: 'rgb(59, 130, 246)',
      tension: 0.1
    }]
  };

  const chartOptions = {
    responsive: true,
    plugins: {
      legend: {
        position: 'top' as const,
      }
    },
    scales: {
      y: {
        beginAtZero: false
      }
    }
  };

  return (
    <div className="pt-16 min-h-screen bg-gray-50">
      {/* Hero Section */}
      <div className="relative overflow-hidden bg-gradient-to-r from-green-600 to-green-800 text-white">
        <div className="absolute inset-0 z-0">
          <img
            src="https://images.unsplash.com/photo-1517836357463-d25dfeac3438?auto=format&fit=crop&q=80"
            alt="Fitness motivation"
            className="w-full h-full object-cover opacity-20"
          />
        </div>
        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 text-center">
          <h1 className="text-4xl md:text-5xl font-bold mb-6">
            Your Personal AI Diet Planner
          </h1>
          <p className="text-xl max-w-3xl mx-auto">
            Get personalized diet plans, track your calories, and achieve your fitness goals with AI-powered recommendations
          </p>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Quick Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-12">
          <div className="bg-white p-6 rounded-lg shadow-md">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Daily Calories</p>
                <p className="text-2xl font-bold text-green-600">
                  {calorieProgress[calorieProgress.length - 1]?.calories || 'N/A'}
                </p>
              </div>
              <Apple className="h-8 w-8 text-green-500" />
            </div>
          </div>
          <div className="bg-white p-6 rounded-lg shadow-md">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Current Weight</p>
                <p className="text-2xl font-bold text-green-600">
                  {weightProgress[weightProgress.length - 1]?.weight || 'N/A'} kg
                </p>
              </div>
              <Scale className="h-8 w-8 text-green-500" />
            </div>
          </div>
          <div className="bg-white p-6 rounded-lg shadow-md">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Target Weight</p>
                <p className="text-2xl font-bold text-green-600">{targetWeight} kg</p>
              </div>
              <Target className="h-8 w-8 text-green-500" />
            </div>
          </div>
          <div className="bg-white p-6 rounded-lg shadow-md">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Progress</p>
                <p className="text-2xl font-bold text-green-600">
                  {weightProgress.length > 1
                    ? (weightProgress[weightProgress.length - 1].weight - weightProgress[0].weight).toFixed(1)
                    : 'N/A'} kg
                </p>
              </div>
              <TrendingUp className="h-8 w-8 text-green-500" />
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex flex-wrap justify-center gap-4 mb-12">
          <button
            onClick={() => setSelectedTab('ai')}
            className={`flex items-center px-6 py-3 rounded-full ${
              selectedTab === 'ai'
                ? 'bg-green-600 text-white'
                : 'bg-white text-gray-600 hover:bg-gray-50'
            } shadow-sm transition-colors`}
          >
            <Brain className="h-5 w-5 mr-2" />
            Generate Plan
          </button>
          <button
            onClick={() => setSelectedTab('planner')}
            className={`flex items-center px-6 py-3 rounded-full ${
              selectedTab === 'planner'
                ? 'bg-green-600 text-white'
                : 'bg-white text-gray-600 hover:bg-gray-50'
            } shadow-sm transition-colors`}
          >
            <Calendar className="h-5 w-5 mr-2" />
            Meal Planner
          </button>
          <button
            onClick={() => setSelectedTab('progress')}
            className={`flex items-center px-6 py-3 rounded-full ${
              selectedTab === 'progress'
                ? 'bg-green-600 text-white'
                : 'bg-white text-gray-600 hover:bg-gray-50'
            } shadow-sm transition-colors`}
          >
            <TrendingUp className="h-5 w-5 mr-2" />
            Progress
          </button>
        </div>

        {/* Tab Content */}
        <div className="bg-white rounded-lg shadow-lg p-8">
          {selectedTab === 'ai' && (
            <div className="space-y-6">
              <h2 className="text-2xl font-bold text-gray-900">Generate Your Diet Plan</h2>
              
              <div className="grid gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    What are your fitness goals?
                  </label>
                  <select
                    value={dietGoal}
                    onChange={(e) => setDietGoal(e.target.value)}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500"
                  >
                    <option value="weight_loss">Weight Loss</option>
                    <option value="muscle_gain">Muscle Gain</option>
                    <option value="maintenance">Maintenance</option>
                    <option value="athletic_performance">Athletic Performance</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Current Weight (kg)
                  </label>
                  <input
                    type="number"
                    value={currentWeight || ''}
                    onChange={(e) => setCurrentWeight(Number(e.target.value))}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Target Weight (kg)
                  </label>
                  <input
                    type="number"
                    value={targetWeight || ''}
                    onChange={(e) => setTargetWeight(Number(e.target.value))}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Activity Level
                  </label>
                  <select
                    value={activityLevel}
                    onChange={(e) => setActivityLevel(e.target.value)}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500"
                  >
                    <option value="sedentary">Sedentary</option>
                    <option value="light">Lightly Active</option>
                    <option value="moderate">Moderately Active</option>
                    <option value="very">Very Active</option>
                    <option value="extra">Extra Active</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Dietary Restrictions
                  </label>
                  <div className="mt-2 space-y-2">
                    {['vegetarian', 'vegan', 'gluten-free', 'dairy-free', 'keto', 'paleo'].map((restriction) => (
                      <label key={restriction} className="inline-flex items-center mr-4">
                        <input
                          type="checkbox"
                          checked={restrictions.includes(restriction)}
                          onChange={(e) => {
                            if (e.target.checked) {
                              setRestrictions([...restrictions, restriction]);
                            } else {
                              setRestrictions(restrictions.filter(r => r !== restriction));
                            }
                          }}
                          className="rounded border-gray-300 text-green-600 shadow-sm focus:border-green-500 focus:ring-green-500"
                        />
                        <span className="ml-2 capitalize">{restriction}</span>
                      </label>
                    ))}
                  </div>
                </div>

                <button
                  onClick={handleGeneratePlan}
                  disabled={isLoading}
                  className="w-full bg-green-600 text-white px-6 py-3 rounded-lg hover:bg-green-700 transition-colors disabled:opacity-50"
                >
                  {isLoading ? 'Generating...' : 'Generate Diet Plan'}
                </button>
              </div>
            </div>
          )}

          {selectedTab === 'planner' && (
            <div className="space-y-8">
              <h2 className="text-2xl font-bold text-gray-900">Your Meal Plan</h2>
              
              {generatedPlan ? (
                <div className="whitespace-pre-line bg-gray-50 p-6 rounded-lg">
                  {generatedPlan}
                </div>
              ) : (
                <p className="text-center text-gray-500">
                  Generate a diet plan to see your personalized meals here
                </p>
              )}
            </div>
          )}

          {selectedTab === 'progress' && (
            <div className="space-y-8">
              <h2 className="text-2xl font-bold text-gray-900">Track Your Progress</h2>

              {/* Progress Update Form */}
              <div className="bg-gray-50 p-6 rounded-lg">
                <h3 className="text-lg font-semibold mb-4">Update Today's Progress</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700">
                      Current Weight (kg)
                    </label>
                    <input
                      type="number"
                      step="0.1"
                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500"
                      value={currentWeight || ''}
                      onChange={(e) => setCurrentWeight(Number(e.target.value))}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">
                      Today's Calorie Intake
                    </label>
                    <input
                      type="number"
                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500"
                      onChange={(e) => updateProgress(currentWeight, Number(e.target.value))}
                    />
                  </div>
                </div>
              </div>

              {/* Progress Charts */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="bg-white p-6 rounded-lg shadow">
                  <h3 className="text-lg font-semibold mb-4">Weight Progress</h3>
                  {weightProgress.length > 0 ? (
                    <Line data={weightChartData} options={chartOptions} />
                  ) : (
                    <p className="text-center text-gray-500">No weight data available</p>
                  )}
                </div>
                <div className="bg-white p-6 rounded-lg shadow">
                  <h3 className="text-lg font-semibold mb-4">Calorie Intake</h3>
                  {calorieProgress.length > 0 ? (
                    <Line data={calorieChartData} options={chartOptions} />
                  ) : (
                    <p className="text-center text-gray-500">No calorie data available</p>
                  )}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}