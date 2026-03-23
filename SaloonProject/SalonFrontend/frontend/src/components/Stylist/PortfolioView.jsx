import { useState } from 'react';
import { FiChevronLeft, FiChevronRight, FiX } from 'react-icons/fi';

const PortfolioView = ({ stylist, onClose }) => {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  // Sample portfolio images - in a real app, these would come from props or API
  const portfolioImages = [
    { id: 1, url: 'https://images.unsplash.com/photo-1522337360788-8b13dee7a37e', title: 'Creative Coloring' },
    { id: 2, url: 'https://images.unsplash.com/photo-1519699047748-de8e457a634e', title: 'Elegant Updo' },
    { id: 3, url: 'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f', title: 'Modern Cut' },
    { id: 4, url: 'https://images.unsplash.com/photo-1492106087820-71f1a00d2b11', title: 'Bridal Style' },
  ];

  const nextImage = () => {
    setCurrentImageIndex((prevIndex) => 
      prevIndex === portfolioImages.length - 1 ? 0 : prevIndex + 1
    );
  };

  const prevImage = () => {
    setCurrentImageIndex((prevIndex) => 
      prevIndex === 0 ? portfolioImages.length - 1 : prevIndex - 1
    );
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-90 z-50 flex items-center justify-center p-4">
      <div className="relative max-w-4xl w-full">
        <button 
          onClick={onClose}
          className="absolute -top-10 right-0 text-white hover:text-purple-400 transition"
        >
          <FiX size={28} />
        </button>
        
        <div className="bg-gray-800 rounded-lg overflow-hidden">
          <div className="relative h-96">
            <img
              src={portfolioImages[currentImageIndex].url}
              alt={portfolioImages[currentImageIndex].title}
              className="w-full h-full object-cover"
            />
            
            <button
              onClick={prevImage}
              className="absolute left-4 top-1/2 transform -translate-y-1/2 bg-black bg-opacity-50 text-white p-2 rounded-full hover:bg-opacity-70 transition"
            >
              <FiChevronLeft size={24} />
            </button>
            
            <button
              onClick={nextImage}
              className="absolute right-4 top-1/2 transform -translate-y-1/2 bg-black bg-opacity-50 text-white p-2 rounded-full hover:bg-opacity-70 transition"
            >
              <FiChevronRight size={24} />
            </button>
          </div>
          
          <div className="p-6">
            <h3 className="text-xl font-bold mb-2">{stylist.name}'s Portfolio</h3>
            <p className="text-gray-400 mb-4">{portfolioImages[currentImageIndex].title}</p>
            
            <div className="flex space-x-2 justify-center mt-4">
              {portfolioImages.map((img, index) => (
                <button
                  key={img.id}
                  onClick={() => setCurrentImageIndex(index)}
                  className={`w-3 h-3 rounded-full ${currentImageIndex === index ? 'bg-purple-500' : 'bg-gray-600'}`}
                />
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PortfolioView;