import React, { useState, useEffect } from 'react';
import { Search, Filter, Star, Clock, MapPin, ChefHat, Heart, ShoppingBag, AlertCircle } from 'lucide-react';
import { useCart } from '../contexts/CartContext';
import Cart from '../components/Cart';
import Notification from '../components/Notification';
import { motion } from 'framer-motion';
import { supabase } from '../lib/supabase';

interface FoodItem {
  id: string;
  name: string;
  description: string;
  price: number;
  image_url: string;
  calories: number;
  preparation_time: string;
  is_vegetarian: boolean;
  is_vegan: boolean;
  is_gluten_free: boolean;
  spice_level: string;
  rating: number;
  category_id: string;
}

interface Category {
  id: string;
  name: string;
  description: string;
  image_url: string;
}

interface Notification {
  message: string;
  type: 'success' | 'error' | 'info';
}

export default function CloudKitchen() {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [notification, setNotification] = useState<Notification | null>(null);
  const [foodItems, setFoodItems] = useState<FoodItem[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { addToCart } = useCart();

  useEffect(() => {
    fetchCategories();
    fetchFoodItems();
  }, []);

  const fetchCategories = async () => {
    const { data, error } = await supabase
      .from('food_categories')
      .select('*');

    if (error) {
      console.error('Error fetching categories:', error);
      setError('Failed to load categories');
      return;
    }

    setCategories(data);
  };

  const fetchFoodItems = async () => {
    const { data, error } = await supabase
      .from('food_items')
      .select('*')
      .eq('available', true);

    if (error) {
      console.error('Error fetching food items:', error);
      setError('Failed to load food items');
      return;
    }

    setFoodItems(data);
    setLoading(false);
  };

  const filteredItems = foodItems.filter(item => {
    const matchesSearch = item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         item.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = !selectedCategory || item.category_id === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const handleAddToCart = (item: FoodItem) => {
    addToCart({
      id: parseInt(item.id),
      name: item.name,
      price: item.price,
      quantity: 1,
      chef: 'Chef'  // You might want to add chef information to the food_items table
    });
    setNotification({
      message: `${item.name} added to cart!`,
      type: 'success'
    });
  };

  if (loading) {
    return (
      <div className="min-h-screen pt-16 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-green-500"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen pt-16 flex items-center justify-center">
        <div className="text-red-500 flex items-center">
          <AlertCircle className="mr-2" />
          {error}
        </div>
      </div>
    );
  }

  return (
    <div className="pt-16 min-h-screen bg-gray-50">
      {/* Hero Section */}
      <div className="relative overflow-hidden bg-gradient-to-r from-green-600 to-green-800 text-white">
        <div className="absolute inset-0 z-0">
          <img
            src="https://images.unsplash.com/photo-1505253758473-96b7015fcd40?auto=format&fit=crop&q=80"
            alt="Indian Food"
            className="w-full h-full object-cover opacity-20"
          />
        </div>
        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
          <h1 className="text-4xl md:text-5xl font-bold mb-6 text-center">
            Healthy Indian Cloud Kitchen
          </h1>
          <p className="text-xl max-w-3xl mx-auto text-center">
            Discover authentic Indian flavors with a healthy twist. All our dishes are prepared with premium ingredients and balanced nutrition.
          </p>
        </div>
      </div>

      {/* Search Section */}
      <div className="bg-white shadow-sm sticky top-16 z-30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex flex-col md:flex-row md:items-center md:space-x-4">
            <div className="flex-1 relative">
              <input
                type="text"
                placeholder="Search for healthy Indian food..."
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
              <Search className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
            </div>
            
            <div className="mt-4 md:mt-0 flex items-center space-x-4">
              <select
                value={selectedCategory || ''}
                onChange={(e) => setSelectedCategory(e.target.value || null)}
                className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
              >
                <option value="">All Categories</option>
                {categories.map(category => (
                  <option key={category.id} value={category.id}>
                    {category.name}
                  </option>
                ))}
              </select>
              <button
                onClick={() => setIsCartOpen(true)}
                className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 flex items-center"
              >
                <ShoppingBag className="h-5 w-5 mr-2" />
                View Cart
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Categories Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {categories.map((category) => (
            <motion.div
              key={category.id}
              whileHover={{ scale: 1.02 }}
              className="relative rounded-lg overflow-hidden cursor-pointer"
              onClick={() => setSelectedCategory(category.id)}
            >
              <img
                src={category.image_url}
                alt={category.name}
                className="w-full h-48 object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent flex items-end">
                <div className="p-4 text-white">
                  <h3 className="text-xl font-semibold">{category.name}</h3>
                  <p className="text-sm opacity-90">{category.description}</p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Food Items Grid */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredItems.map((item) => (
            <motion.div
              key={item.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow"
            >
              <div className="relative">
                <img
                  src={item.image_url}
                  alt={item.name}
                  className="w-full h-48 object-cover"
                />
                <div className="absolute top-4 right-4">
                  <button className="p-2 bg-white rounded-full shadow-md hover:bg-gray-100">
                    <Heart className="h-5 w-5 text-red-500" />
                  </button>
                </div>
                {item.is_vegetarian && (
                  <div className="absolute top-4 left-4 bg-green-500 text-white px-2 py-1 rounded-full text-xs">
                    Veg
                  </div>
                )}
              </div>
              
              <div className="p-6">
                <div className="flex justify-between items-start mb-2">
                  <h3 className="text-xl font-semibold text-gray-900">{item.name}</h3>
                  <div className="flex items-center">
                    <Star className="h-5 w-5 text-yellow-400 fill-current" />
                    <span className="ml-1 text-sm text-gray-600">{item.rating}</span>
                  </div>
                </div>
                
                <p className="text-gray-600 text-sm mb-4">{item.description}</p>
                
                <div className="flex items-center space-x-4 mb-4">
                  <div className="flex items-center text-gray-500">
                    <Clock className="h-4 w-4 mr-1" />
                    <span className="text-sm">{item.preparation_time}</span>
                  </div>
                  <div className="flex items-center text-gray-500">
                    <ChefHat className="h-4 w-4 mr-1" />
                    <span className="text-sm">{item.calories} cal</span>
                  </div>
                </div>

                <div className="flex flex-wrap gap-2 mb-4">
                  {item.spice_level && (
                    <span className="px-2 py-1 bg-red-100 text-red-600 rounded-full text-xs">
                      {item.spice_level} Spicy
                    </span>
                  )}
                  {item.is_gluten_free && (
                    <span className="px-2 py-1 bg-purple-100 text-purple-600 rounded-full text-xs">
                      Gluten Free
                    </span>
                  )}
                  {item.is_vegan && (
                    <span className="px-2 py-1 bg-green-100 text-green-600 rounded-full text-xs">
                      Vegan
                    </span>
                  )}
                </div>

                <div className="flex justify-between items-center">
                  <p className="text-green-600 font-semibold">${item.price}</p>
                  <button
                    onClick={() => handleAddToCart(item)}
                    className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors flex items-center"
                  >
                    <ShoppingBag className="h-4 w-4 mr-2" />
                    Add to Cart
                  </button>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Cart Modal */}
      <Cart isOpen={isCartOpen} onClose={() => setIsCartOpen(false)} />

      {/* Notification */}
      {notification && (
        <Notification
          message={notification.message}
          type={notification.type}
          isVisible={!!notification}
          onClose={() => setNotification(null)}
        />
      )}
    </div>
  );
}