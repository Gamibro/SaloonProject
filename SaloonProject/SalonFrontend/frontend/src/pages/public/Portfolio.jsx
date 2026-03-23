
import { useState } from 'react';
import PortfolioView from '../../components/Stylist/PortfolioView';

const PortfolioPage = () => {
  const [viewingPortfolio, setViewingPortfolio] = useState(null);

  // Sample gallery images
  const gallery = [
    { id: 1, category: 'Hair', url: 'https://images.unsplash.com/photo-1760220006440-4b98ad942c53?q=80&w=386&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D', title: 'Elegant Updo' },
    { id: 2, category: 'Hair', url: 'https://plus.unsplash.com/premium_photo-1661290481306-4841edd49719?q=80&w=1032&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D', title: 'Modern Cut' },
    { id: 3, category: 'Makeup', url: 'https://plus.unsplash.com/premium_photo-1661326352695-6cbe1ff74ee9?q=80&w=870&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D', title: 'Bridal Makeup' },
    { id: 4, category: 'Nails', url: 'https://plus.unsplash.com/premium_photo-1661306650860-9be94420d227?q=80&w=869&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D', title: 'French Manicure' },
    { id: 5, category: 'Hair', url: 'https://images.unsplash.com/photo-1585556282289-d4d5a7967936?q=80&w=387&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D', title: 'Bridal Style' },
    { id: 6, category: 'Makeup', url: 'https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9', title: 'Evening Glam' },
  ];

  const [activeCategory, setActiveCategory] = useState('All');

  const categories = ['All', 'Hair', 'Makeup', 'Nails'];

  const filteredGallery = activeCategory === 'All' 
    ? gallery 
    : gallery.filter(item => item.category === activeCategory);

  return (
    <div className="min-h-screen bg-gray-900 text-gray-100">
      <div className="max-w-7xl mx-auto px-4 py-8">
        <h2 className="text-2xl font-bold mb-8">Our Portfolio</h2>
        
        <div className="flex flex-wrap gap-2 mb-8">
          {categories.map(category => (
            <button
              key={category}
              onClick={() => setActiveCategory(category)}
              className={`px-4 py-2 rounded-full text-sm font-medium transition ${
                activeCategory === category 
                  ? 'bg-purple-600 text-white' 
                  : 'bg-gray-800 text-gray-300 hover:bg-gray-700'
              }`}
            >
              {category}
            </button>
          ))}
        </div>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredGallery.map(item => (
            <div 
              key={item.id} 
              className="bg-gray-800 rounded-xl overflow-hidden hover:shadow-lg transition cursor-pointer"
              onClick={() => setViewingPortfolio({ name: 'Salon Portfolio', ...item })}
            >
              <div className="h-64 overflow-hidden">
                <img
                  src={item.url}
                  alt={item.title}
                  className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                />
              </div>
              <div className="p-4">
                <h3 className="font-semibold">{item.title}</h3>
                <p className="text-sm text-gray-400">{item.category}</p>
              </div>
            </div>
          ))}
        </div>
        
        {/* {viewingPortfolio && (
          <PortfolioView 
            stylist={viewingPortfolio} 
            onClose={() => setViewingPortfolio(null)} 
          />
        )} */}
      </div>
    </div>
  );
};

export default PortfolioPage;