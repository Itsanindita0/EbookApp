import React from 'react';
import { BookOpen, Globe, Users, Coffee } from 'lucide-react';
import { BACKGROUND_IMAGE } from '../constants';

export const About: React.FC = () => {
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-slate-900 text-white py-20 relative overflow-hidden">
        <div 
            className="absolute inset-0 bg-cover bg-center z-0 opacity-20"
            style={{ backgroundImage: `url(${BACKGROUND_IMAGE})` }}
        />
        <div className="relative z-10 max-w-4xl mx-auto px-4 text-center">
          <h1 className="text-4xl md:text-5xl font-serif font-bold mb-6">About EBookVerse</h1>
          <p className="text-xl text-slate-300">Democratizing knowledge through accessible digital reading.</p>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-4 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center mb-20">
          <div>
             <h2 className="text-3xl font-bold text-gray-800 mb-4 font-serif">Our Mission</h2>
             <p className="text-gray-600 leading-relaxed text-lg">
               EBookVerse was founded with a simple yet powerful mission: to make literature accessible to everyone, everywhere. 
               We believe that knowledge should have no boundaries. By leveraging modern technology and public domain resources, 
               we bring the world's libraries to your fingertips.
             </p>
          </div>
          <div className="grid grid-cols-2 gap-4">
             <div className="bg-white p-6 rounded-xl shadow-lg text-center transform translate-y-4">
                <BookOpen className="w-10 h-10 text-primary mx-auto mb-3" />
                <h3 className="font-bold text-gray-800">10k+ Books</h3>
             </div>
             <div className="bg-white p-6 rounded-xl shadow-lg text-center">
                <Users className="w-10 h-10 text-secondary mx-auto mb-3" />
                <h3 className="font-bold text-gray-800">5k+ Users</h3>
             </div>
             <div className="bg-white p-6 rounded-xl shadow-lg text-center transform translate-y-4">
                <Globe className="w-10 h-10 text-blue-500 mx-auto mb-3" />
                <h3 className="font-bold text-gray-800">Global</h3>
             </div>
             <div className="bg-white p-6 rounded-xl shadow-lg text-center">
                <Coffee className="w-10 h-10 text-amber-800 mx-auto mb-3" />
                <h3 className="font-bold text-gray-800">Free</h3>
             </div>
          </div>
        </div>
      </div>
    </div>
  );
};