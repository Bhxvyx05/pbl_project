import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ChefHat, Brain, Leaf } from 'lucide-react';
import AuthModal from '../components/AuthModal';

export default function Home() {
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const navigate = useNavigate();

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <div className="relative pt-16 pb-32 flex content-center items-center justify-center min-h-screen">
        <div className="absolute top-0 w-full h-full bg-center bg-cover" style={{
          backgroundImage: "url('https://images.unsplash.com/photo-1543353071-873f17a7a088?auto=format&fit=crop&q=80')"
        }}>
          <span className="w-full h-full absolute opacity-50 bg-black"></span>
        </div>
        <div className="container relative mx-auto">
          <div className="items-center flex flex-wrap">
            <div className="w-full lg:w-6/12 px-4 ml-auto mr-auto text-center">
              <div className="text-white">
                <h1 className="text-5xl font-semibold leading-tight">
                  Transform Your Passion for Food into Success
                </h1>
                <p className="mt-4 text-lg">
                  Join our platform to start your cloud kitchen, plan healthy meals, and contribute to sustainable food practices.
                </p>
                <button
                  onClick={() => setIsAuthModalOpen(true)}
                  className="mt-8 bg-green-500 text-white font-bold px-8 py-3 rounded-full hover:bg-green-600 transition-colors"
                >
                  Get Started
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Features Section */}
      <section className="pb-20 bg-gray-50 -mt-24">
        <div className="container mx-auto px-4">
          <div className="flex flex-wrap">
            <div className="lg:pt-12 pt-6 w-full md:w-4/12 px-4 text-center">
              <div className="relative flex flex-col min-w-0 break-words bg-white w-full mb-8 shadow-lg rounded-lg">
                <div className="px-4 py-5 flex-auto">
                  <div className="text-white p-3 text-center inline-flex items-center justify-center w-12 h-12 mb-5 shadow-lg rounded-full bg-green-400">
                    <ChefHat />
                  </div>
                  <h6 className="text-xl font-semibold">Cloud Kitchen</h6>
                  <p className="mt-2 mb-4 text-gray-600">
                    Start your food business from home. Reach customers and grow your brand.
                  </p>
                  <button 
                    onClick={() => navigate('/cloud-kitchen')}
                    className="text-green-500 hover:text-green-700"
                  >
                    Learn More →
                  </button>
                </div>
              </div>
            </div>

            <div className="w-full md:w-4/12 px-4 text-center">
              <div className="relative flex flex-col min-w-0 break-words bg-white w-full mb-8 shadow-lg rounded-lg">
                <div className="px-4 py-5 flex-auto">
                  <div className="text-white p-3 text-center inline-flex items-center justify-center w-12 h-12 mb-5 shadow-lg rounded-full bg-blue-400">
                    <Brain />
                  </div>
                  <h6 className="text-xl font-semibold">Diet Planner</h6>
                  <p className="mt-2 mb-4 text-gray-600">
                    Get AI-powered diet recommendations and track your nutrition goals.
                  </p>
                  <button 
                    onClick={() => navigate('/diet-planner')}
                    className="text-green-500 hover:text-green-700"
                  >
                    Learn More →
                  </button>
                </div>
              </div>
            </div>

            <div className="pt-6 w-full md:w-4/12 px-4 text-center">
              <div className="relative flex flex-col min-w-0 break-words bg-white w-full mb-8 shadow-lg rounded-lg">
                <div className="px-4 py-5 flex-auto">
                  <div className="text-white p-3 text-center inline-flex items-center justify-center w-12 h-12 mb-5 shadow-lg rounded-full bg-green-400">
                    <Leaf />
                  </div>
                  <h6 className="text-xl font-semibold">Sustainability</h6>
                  <p className="mt-2 mb-4 text-gray-600">
                    Join our mission for sustainable food practices and reduce waste.
                  </p>
                  <button 
                    onClick={() => navigate('/sustainability')}
                    className="text-green-500 hover:text-green-700"
                  >
                    Learn More →
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <AuthModal isOpen={isAuthModalOpen} onClose={() => setIsAuthModalOpen(false)} />
    </div>
  );
}