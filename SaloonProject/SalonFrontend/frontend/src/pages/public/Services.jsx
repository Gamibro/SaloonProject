// import { useState } from 'react';
// import ServiceCard from '../../components/Services/ServiceCard';

// const ServicesPage = () => {
//   const [activeService, setActiveService] = useState('Haircut');

//   const services = [
//     { name: 'Haircut', duration: '30 min', price: 'Rs.3500', description: 'Professional haircut with styling and finishing. Our stylists will work with you to create the perfect look for your face shape and lifestyle.' },
//     { name: 'Coloring', duration: '2 hours', price: 'Rs.9000', description: 'Custom hair coloring with premium products. Whether you want highlights, balayage, or full color, we use the highest quality dyes to protect your hair.' },
//     { name: 'Styling', duration: '45 min', price: 'Rs.5000', description: 'Special occasion styling and updos. Perfect for weddings, proms, or any event where you want to look your absolute best.' },
//     { name: 'Manicure', duration: '1 hour', price: 'Rs.4000', description: 'Luxurious hand care and nail treatment. Includes shaping, cuticle care, massage, and polish application with premium products.' },
//     { name: 'Pedicure', duration: '1 hour', price: 'Rs.4500', description: 'Revitalizing foot care and nail treatment. Soak, exfoliation, massage, and polish application to leave your feet feeling refreshed.' },
//     { name: 'Facial', duration: '1.5 hours', price: 'Rs.7500', description: 'Rejuvenating skin treatment and relaxation. Customized for your skin type to cleanse, exfoliate, and nourish your skin.' },
//     { name: 'Waxing', duration: '15-30 min', price: 'Rs.2000', description: 'Professional hair removal services. We use high-quality waxes and techniques to minimize discomfort.' },
//     { name: 'Makeup', duration: '1 hour', price: 'Rs.6000', description: 'Professional makeup application for any occasion. Our makeup artists will enhance your natural beauty with premium products.' },
//   ];

//   const activeServiceData = services.find(service => service.name === activeService);

//   return (
//     <div className="min-h-screen bg-gray-900 text-gray-100">
//       <div className="max-w-7xl mx-auto px-4 py-8">
//         <h2 className="text-2xl font-bold mb-8">Our Services</h2>

//         <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
//           <div className="lg:col-span-1">
//             <div className="bg-gray-800 rounded-xl p-6 sticky top-4">
//               <h3 className="text-lg font-semibold mb-4">Service Menu</h3>
//               <div className="space-y-2">
//                 {services.map(service => (
//                   <button
//                     key={service.name}
//                     onClick={() => setActiveService(service.name)}
//                     className={`w-full text-left px-4 py-2 rounded-lg transition ${
//                       activeService === service.name 
//                         ? 'bg-purple-600 text-white' 
//                         : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
//                     }`}
//                   >
//                     {service.name}
//                   </button>
//                 ))}
//               </div>
//             </div>
//           </div>

//           <div className="lg:col-span-3">
//             <div className="bg-gray-800 rounded-xl p-6">
//               <div className="flex justify-between items-start mb-6">
//                 <h3 className="text-2xl font-bold">{activeServiceData.name}</h3>
//                 <div className="flex items-center space-x-4">
//                   <span className="bg-purple-900 text-purple-300 px-3 py-1 rounded-full">
//                     {activeServiceData.price}
//                   </span>
//                   <span className="text-gray-400">
//                     {activeServiceData.duration}
//                   </span>
//                 </div>
//               </div>

//               <p className="text-gray-300 mb-6">{activeServiceData.description}</p>

//               <div className="bg-gray-700 rounded-lg p-4 mb-6">
//                 <h4 className="font-semibold mb-2">What to expect:</h4>
//                 <ul className="list-disc list-inside space-y-1 text-gray-300">
//                   {activeServiceData.name === 'Haircut' && (
//                     <>
//                       <li>Consultation with your stylist</li>
//                       <li>Shampoo and conditioning</li>
//                       <li>Precision cutting</li>
//                       <li>Styling and finishing</li>
//                       <li>Professional advice for at-home care</li>
//                     </>
//                   )}
//                   {activeServiceData.name === 'Coloring' && (
//                     <>
//                       <li>Color consultation</li>
//                       <li>Strand test (if needed)</li>
//                       <li>Application of color</li>
//                       <li>Processing time</li>
//                       <li>Rinse, treatment, and style</li>
//                     </>
//                   )}
//                   {/* Add more service-specific details as needed */}
//                 </ul>
//               </div>

//               <button className="bg-purple-600 hover:bg-purple-700 text-white px-6 py-3 rounded-lg font-medium transition">
//                 Book This Service
//               </button>
//             </div>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default ServicesPage;

import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import ServiceCard from '../../components/Services/ServiceCard';
import { Link } from 'react-router-dom';

const ServicesPage = () => {
  const [activeService, setActiveService] = useState('Haircut');
  const navigate = useNavigate();

  const services = [
    {
      name: 'Haircut',
      duration: '1 hour',
      price: 'Rs.3500',
      description:
        'Professional haircut with styling and finishing. Our stylists will work with you to create the perfect look for your face shape and lifestyle.',
      image: '/images/haircut.jpg',
      whatToExpect: [
        'Consultation with your stylist',
        'Shampoo and conditioning',
        'Precision cutting',
        'Styling and finishing',
        'Professional advice for at-home care',
      ],
      benefits: [
        'Enhanced facial feature framing',
        'Boosted confidence with a fresh look',
        'Customized styling options',
      ],
    },
    {
      name: 'Coloring',
      duration: '1 hour',
      price: 'Rs.1200',
      description:
        'Custom hair coloring with premium products. Whether you want highlights, balayage, or full color, we use the highest quality dyes to protect your hair.',
      image: '/images/Coloring.jpg',
      whatToExpect: [
        'Color consultation',
        'Strand test (if needed)',
        'Application of color',
        'Processing time',
        'Rinse, treatment, and style',
      ],
      benefits: [
        'Personalized color matching',
        'Hair health preservation with premium dyes',
        'Long-lasting vibrant results',
      ],
    },
    {
      name: 'Styling',
      duration: '1 hour',
      price: 'Rs.5000',
      description:
        'Special occasion styling and updos. Perfect for weddings, proms, or any event where you want to look your absolute best.',
      image: '/images/Styling.jpg',
      whatToExpect: [
        'Style consultation',
        'Hair preparation and setting',
        'Updo or styling application',
        'Finishing touches with hairspray',
        'Photo-ready final look',
      ],
      benefits: [
        'Event-ready glamorous look',
        'Customizable styles for any occasion',
        'Long-lasting hold',
      ],
    },
    {
      name: 'Manicure',
      duration: '1 hour',
      price: 'Inaugural Offer Rs.4000',
      description:
        'Luxurious hand care and nail treatment. Includes shaping, cuticle care, massage, and polish application with premium products.',
      image: '/images/Manicure.jpg',
      whatToExpect: [
        'Hand soak and exfoliation',
        'Cuticle care and nail shaping',
        'Moisturizing hand massage',
        'Polish application',
        'Final buff and shine',
      ],
      benefits: [
        'Soft, smooth hands',
        'Healthy nail growth',
        'Relaxed and pampered feel',
      ],
    },
    {
      name: 'Pedicure',
      duration: '1 hour',
      price: 'Rs.4500',
      description:
        'Revitalizing foot care and nail treatment. Soak, exfoliation, massage, and polish application to leave your feet feeling refreshed.',
      image: '/images/pedicure.jpg',
      whatToExpect: [
        'Foot soak and scrub',
        'Callus removal and shaping',
        'Relaxing foot massage',
        'Nail polish application',
        'Moisturizing finish',
      ],
      benefits: [
        'Refreshed and soft feet',
        'Improved circulation from massage',
        'Beautifully polished nails',
      ],
    },
    {
      name: 'Facial',
      duration: '1 hour',
      price: 'Rs.15500',
      description:
        'Rejuvenating skin treatment and relaxation. Customized for your skin type to cleanse, exfoliate, and nourish your skin.',
      image: '/images/Facial.jpg',
      whatToExpect: [
        'Skin type consultation',
        'Cleansing and steaming',
        'Exfoliation and mask application',
        'Moisturizing treatment',
        'Final skin analysis',
      ],
      benefits: [
        'Radiant and hydrated skin',
        'Reduced appearance of imperfections',
        'Deep relaxation',
      ],
    },
    {
      name: 'Waxing',
      duration: '1 hour',
      price: 'Rs.10800',
      description:
        'Professional hair removal services. We use high-quality waxes and techniques to minimize discomfort.',
      image: '/images/Waxing.jpg',
      whatToExpect: [
        'Area consultation',
        'Pre-wax cleansing',
        'Wax application and removal',
        'Post-wax soothing',
        'Aftercare advice',
      ],
      benefits: [
        'Smooth skin for weeks',
        'Reduced hair regrowth over time',
        'Minimal discomfort with expert technique',
      ],
    },
    {
      name: 'Makeup',
      duration: '1 hour',
      price: 'Rs.8000',
      description:
        'Professional makeup application for any occasion. Our makeup artists will enhance your natural beauty with premium products.',
      image: '/images/Makeup.jpg',
      whatToExpect: [
        'Makeup consultation',
        'Skin prep and primer',
        'Application of foundation and contour',
        'Eye and lip makeup',
        'Setting spray finish',
      ],
      benefits: [
        'Flawless event-ready look',
        'Enhanced natural features',
        'Long-lasting makeup',
      ],
    },
  ];

  const activeServiceData = services.find((service) => service.name === activeService);

  const handleBookService = () => {
    navigate('/add-booking', {
      state: {
        service: activeServiceData.name,
        duration: activeServiceData.duration,
        price: activeServiceData.price,
      },
    });
  };

  return (
    <div className="min-h-screen bg-gray-900 text-gray-100">
      <div className="max-w-7xl mx-auto px-4 py-8">
        <h2 className="text-2xl font-bold mb-8">Our Services</h2>

        <div className="flex flex-col lg:flex-row gap-6">
          {/* Service Menu */}
          <div className="lg:w-1/4">
            <div className="bg-gray-800 rounded-xl p-6 lg:sticky lg:top-4">
              <h3 className="text-lg font-semibold mb-4">Service Menu</h3>
              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-1 gap-3">
                {services.map((service) => (
                  <button
                    key={service.name}
                    onClick={() => setActiveService(service.name)}
                    className={`p-3 rounded-lg transition-all text-center lg:text-left lg:p-2 lg:w-full ${activeService === service.name
                        ? 'bg-purple-600 text-white'
                        : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                      }`}
                  >
                    <span className="text-sm font-medium">{service.name}</span>
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Service Details */}
          <div className="lg:w-3/4">
            <div className="bg-gray-800 rounded-xl p-6">
              <div className="flex flex-col sm:flex-row justify-between items-start mb-6">
                <h3 className="text-2xl font-bold mb-4 sm:mb-0">{activeServiceData.name}</h3>
                <div className="flex items-center space-x-4">
                  <span className="bg-purple-900 text-purple-300 px-3 py-1 rounded-full text-sm">
                    {activeServiceData.price}
                  </span>
                  <span className="text-gray-400 text-sm">
                    {activeServiceData.duration}
                  </span>
                </div>
              </div>

              {activeServiceData.image && (
                <img
                  src={activeServiceData.image}
                  alt={`${activeServiceData.name} service`}
                  className="w-full h-48 object-cover rounded-lg mb-6"
                />
              )}

              <p className="text-gray-300 mb-6">{activeServiceData.description}</p>

              <div className="bg-gray-700 rounded-lg p-4 mb-6">
                <h4 className="font-semibold mb-2">What to expect:</h4>
                <ul className="list-disc list-inside space-y-1 text-gray-300">
                  {activeServiceData.whatToExpect.map((item, index) => (
                    <li key={index}>{item}</li>
                  ))}
                </ul>
              </div>

              <div className="bg-gray-700 rounded-lg p-4 mb-6">
                <h4 className="font-semibold mb-2">Benefits:</h4>
                <ul className="list-disc list-inside space-y-1 text-gray-300">
                  {activeServiceData.benefits.map((item, index) => (
                    <li key={index}>{item}</li>
                  ))}
                </ul>
              </div>

              <Link
                to="/book-now"
                className="bg-purple-600 hover:bg-purple-700 text-white px-6 py-3 rounded-lg font-medium transition w-6 sm:w-auto text-center "
              >
                Book This Service
              </Link>

            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ServicesPage;