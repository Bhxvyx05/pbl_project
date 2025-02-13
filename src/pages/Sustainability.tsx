import React, { useState } from 'react';
import { Leaf, Heart, Users, MapPin, Clock, ChefHat } from 'lucide-react';

interface DonationCenter {
  id: number;
  name: string;
  location: string;
  acceptingHours: string;
  contactNumber: string;
  image: string;
}

interface FoodDonation {
  id: number;
  type: string;
  quantity: string;
  expiryDate: string;
  pickupAddress: string;
}

export default function Sustainability() {
  const [activeTab, setActiveTab] = useState('info');
  const [donationForm, setDonationForm] = useState<FoodDonation>({
    id: 0,
    type: '',
    quantity: '',
    expiryDate: '',
    pickupAddress: ''
  });

  const donationCenters: DonationCenter[] = [
    {
      id: 1,
      name: "Food Bank Network",
      location: "123 Hope Street",
      acceptingHours: "9 AM - 5 PM",
      contactNumber: "+1 234-567-8900",
      image: "https://images.unsplash.com/photo-1488521787991-ed7bbaae773c?auto=format&fit=crop&q=80"
    },
    // Add more centers...
  ];

  return (
    <div className="pt-16 min-h-screen bg-gray-50">
      {/* Hero Section */}
      <div className="relative overflow-hidden bg-gradient-to-r from-green-600 to-green-800 text-white">
        <div className="absolute inset-0 z-0">
          <img
            src="https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?auto=format&fit=crop&q=80"
            alt="Sustainability"
            className="w-full h-full object-cover opacity-20"
          />
        </div>
        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 text-center">
          <h1 className="text-4xl md:text-5xl font-bold mb-6">
            Sustainable Food Future
          </h1>
          <p className="text-xl max-w-3xl mx-auto">
            Join our mission to reduce food waste and help those in need through our network of food donation centers and sustainability initiatives.
          </p>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Navigation Tabs */}
        <div className="flex flex-wrap justify-center gap-4 mb-12">
          {['info', 'donate', 'centers', 'impact'].map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`flex items-center px-6 py-3 rounded-full ${
                activeTab === tab
                  ? 'bg-green-600 text-white'
                  : 'bg-white text-gray-600 hover:bg-gray-50'
              } shadow-sm transition-colors`}
            >
              {tab === 'info' && <Leaf className="h-5 w-5 mr-2" />}
              {tab === 'donate' && <Heart className="h-5 w-5 mr-2" />}
              {tab === 'centers' && <MapPin className="h-5 w-5 mr-2" />}
              {tab === 'impact' && <Users className="h-5 w-5 mr-2" />}
              {tab.charAt(0).toUpperCase() + tab.slice(1)}
            </button>
          ))}
        </div>

        {/* Tab Content */}
        <div className="bg-white rounded-lg shadow-lg p-8">
          {activeTab === 'info' && (
            <div className="space-y-8">
              <h2 className="text-3xl font-bold text-gray-900 mb-8">Our Sustainability Mission</h2>
              
              <div className="grid md:grid-cols-3 gap-8">
                <div className="text-center p-6">
                  <div className="bg-green-100 rounded-full p-4 inline-block mb-4">
                    <Leaf className="h-8 w-8 text-green-600" />
                  </div>
                  <h3 className="text-xl font-semibold mb-4">Environmental Impact</h3>
                  <p className="text-gray-600">Reducing food waste to minimize environmental impact and greenhouse gas emissions.</p>
                </div>
                
                <div className="text-center p-6">
                  <div className="bg-green-100 rounded-full p-4 inline-block mb-4">
                    <Users className="h-8 w-8 text-green-600" />
                  </div>
                  <h3 className="text-xl font-semibold mb-4">Community Support</h3>
                  <p className="text-gray-600">Connecting excess food with those in need through our network of partners.</p>
                </div>
                
                <div className="text-center p-6">
                  <div className="bg-green-100 rounded-full p-4 inline-block mb-4">
                    <ChefHat className="h-8 w-8 text-green-600" />
                  </div>
                  <h3 className="text-xl font-semibold mb-4">Sustainable Practices</h3>
                  <p className="text-gray-600">Promoting sustainable cooking and food storage practices.</p>
                </div>
              </div>

              <div className="mt-12 bg-gray-50 p-8 rounded-lg">
                <h3 className="text-2xl font-bold mb-6">Our Impact</h3>
                <div className="grid md:grid-cols-3 gap-8">
                  <div className="text-center">
                    <div className="text-4xl font-bold text-green-600 mb-2">50,000+</div>
                    <div className="text-gray-600">Meals Donated</div>
                  </div>
                  <div className="text-center">
                    <div className="text-4xl font-bold text-green-600 mb-2">100+</div>
                    <div className="text-gray-600">Partner Organizations</div>
                  </div>
                  <div className="text-center">
                    <div className="text-4xl font-bold text-green-600 mb-2">25 tons</div>
                    <div className="text-gray-600">Food Waste Reduced</div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'donate' && (
            <div className="max-w-2xl mx-auto">
              <h2 className="text-3xl font-bold text-gray-900 mb-8">Donate Food</h2>
              
              <form className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Type of Food
                  </label>
                  <input
                    type="text"
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500"
                    placeholder="e.g., Packaged Meals, Fresh Produce"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Quantity
                  </label>
                  <input
                    type="text"
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500"
                    placeholder="e.g., 5 kg, 10 meals"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Expiry Date
                  </label>
                  <input
                    type="date"
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Pickup Address
                  </label>
                  <textarea
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500"
                    rows={3}
                    placeholder="Enter your address for pickup"
                  />
                </div>

                <button
                  type="submit"
                  className="w-full bg-green-600 text-white px-6 py-3 rounded-lg hover:bg-green-700 transition-colors"
                >
                  Submit Donation
                </button>
              </form>
            </div>
          )}

          {activeTab === 'centers' && (
            <div>
              <h2 className="text-3xl font-bold text-gray-900 mb-8">Donation Centers</h2>
              
              <div className="grid md:grid-cols-2 gap-8">
                {donationCenters.map((center) => (
                  <div key={center.id} className="bg-white rounded-lg shadow-md overflow-hidden">
                    <img
                      src={center.image}
                      alt={center.name}
                      className="w-full h-48 object-cover"
                    />
                    <div className="p-6">
                      <h3 className="text-xl font-semibold mb-4">{center.name}</h3>
                      <div className="space-y-2">
                        <div className="flex items-center text-gray-600">
                          <MapPin className="h-5 w-5 mr-2" />
                          {center.location}
                        </div>
                        <div className="flex items-center text-gray-600">
                          <Clock className="h-5 w-5 mr-2" />
                          {center.acceptingHours}
                        </div>
                      </div>
                      <button className="mt-4 w-full bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors">
                        Contact Center
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeTab === 'impact' && (
            <div>
              <h2 className="text-3xl font-bold text-gray-900 mb-8">Our Impact Stories</h2>
              
              <div className="space-y-8">
                {/* Impact stories and statistics */}
                <div className="bg-gray-50 p-6 rounded-lg">
                  <h3 className="text-xl font-semibold mb-4">Monthly Impact</h3>
                  <div className="grid md:grid-cols-3 gap-6">
                    <div className="bg-white p-4 rounded-lg text-center">
                      <div className="text-3xl font-bold text-green-600">5,000+</div>
                      <div className="text-gray-600">Meals Distributed</div>
                    </div>
                    <div className="bg-white p-4 rounded-lg text-center">
                      <div className="text-3xl font-bold text-green-600">2.5 tons</div>
                      <div className="text-gray-600">Food Saved</div>
                    </div>
                    <div className="bg-white p-4 rounded-lg text-center">
                      <div className="text-3xl font-bold text-green-600">20+</div>
                      <div className="text-gray-600">Active Partners</div>
                    </div>
                  </div>
                </div>

                {/* Success Stories */}
                <div className="space-y-6">
                  <h3 className="text-2xl font-semibold">Success Stories</h3>
                  <div className="grid md:grid-cols-2 gap-6">
                    <div className="bg-white p-6 rounded-lg shadow-md">
                      <h4 className="font-semibold mb-2">Local Restaurant Partnership</h4>
                      <p className="text-gray-600">
                        Partnered with 15 local restaurants to donate excess food, providing over 1,000 meals weekly to those in need.
                      </p>
                    </div>
                    <div className="bg-white p-6 rounded-lg shadow-md">
                      <h4 className="font-semibold mb-2">Community Food Drive</h4>
                      <p className="text-gray-600">
                        Organized monthly food drives collecting over 500kg of non-perishable items for local food banks.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}