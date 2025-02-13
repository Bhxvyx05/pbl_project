import React, { createContext, useContext, useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import { useAuth } from './AuthContext';

interface CartItem {
  id: number;
  name: string;
  price: number;
  quantity: number;
  chef: string;
}

interface CartContextType {
  items: CartItem[];
  addToCart: (item: CartItem) => void;
  removeFromCart: (itemId: number) => void;
  updateQuantity: (itemId: number, quantity: number) => void;
  clearCart: () => void;
  total: number;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([]);
  const { user } = useAuth();

  // Calculate total
  const total = items.reduce((sum, item) => sum + item.price * item.quantity, 0);

  // Load cart from database when user logs in
  useEffect(() => {
    if (user) {
      loadCart();
    }
  }, [user]);

  async function loadCart() {
    if (!user) return;

    const { data, error } = await supabase
      .from('cart_items')
      .select('*')
      .eq('user_id', user.id);

    if (error) {
      console.error('Error loading cart:', error);
      return;
    }

    if (data) {
      setItems(data.map(item => ({
        id: item.food_item_id,
        name: item.name,
        price: item.price,
        quantity: item.quantity,
        chef: item.chef
      })));
    }
  }

  async function addToCart(item: CartItem) {
    const existingItem = items.find(i => i.id === item.id);

    if (existingItem) {
      await updateQuantity(item.id, existingItem.quantity + 1);
    } else {
      setItems([...items, { ...item, quantity: 1 }]);

      if (user) {
        const { error } = await supabase
          .from('cart_items')
          .insert({
            user_id: user.id,
            food_item_id: item.id,
            name: item.name,
            price: item.price,
            quantity: 1,
            chef: item.chef
          });

        if (error) {
          console.error('Error adding to cart:', error);
        }
      }
    }
  }

  async function removeFromCart(itemId: number) {
    setItems(items.filter(item => item.id !== itemId));

    if (user) {
      const { error } = await supabase
        .from('cart_items')
        .delete()
        .eq('user_id', user.id)
        .eq('food_item_id', itemId);

      if (error) {
        console.error('Error removing from cart:', error);
      }
    }
  }

  async function updateQuantity(itemId: number, quantity: number) {
    if (quantity < 1) {
      await removeFromCart(itemId);
      return;
    }

    setItems(items.map(item =>
      item.id === itemId ? { ...item, quantity } : item
    ));

    if (user) {
      const { error } = await supabase
        .from('cart_items')
        .update({ quantity })
        .eq('user_id', user.id)
        .eq('food_item_id', itemId);

      if (error) {
        console.error('Error updating quantity:', error);
      }
    }
  }

  async function clearCart() {
    setItems([]);

    if (user) {
      const { error } = await supabase
        .from('cart_items')
        .delete()
        .eq('user_id', user.id);

      if (error) {
        console.error('Error clearing cart:', error);
      }
    }
  }

  return (
    <CartContext.Provider value={{ items, addToCart, removeFromCart, updateQuantity, clearCart, total }}>
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const context = useContext(CartContext);
  if (context === undefined) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
}