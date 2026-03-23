// import { useState } from 'react';
// import { FiCalendar, FiClock, FiScissors, FiUser, FiMapPin, FiPhone } from 'react-icons/fi';
// import QuickBooking from '../../components/Appointment/QuickBooking';

// const HomePage = () => {
//   const [activeService, setActiveService] = useState('Haircut');

//   const services = [
//     { name: 'Haircut', duration: '30 min', price: 'Rs.3500' },
//     { name: 'Coloring', duration: '2 hours', price: 'Rs.9000+' },
//     { name: 'Styling', duration: '45 min', price: 'Rs.5000' },
//     { name: 'Manicure', duration: '1 hour', price: 'Rs.4000' },
//     { name: 'Pedicure', duration: '1 hour', price: 'Rs.4500' },
//     { name: 'Facial', duration: '1.5 hours', price: 'Rs.7500' },
//   ];

//   const testimonials = [
//     { name: 'Sarah J.', comment: 'Best salon experience ever! The stylists are true artists.', rating: 5 },
//     { name: 'Michael T.', comment: 'Always leave looking and feeling amazing. Highly recommend!', rating: 5 },
//     { name: 'Emily R.', comment: 'Love the atmosphere and the results. Worth every penny.', rating: 4 },
//   ];

//   return (
//     <div className="min-h-screen bg-gray-900 text-gray-100">
//       {/* Hero Section */}
//       <section className="relative bg-gradient-to-b from-gray-800 to-gray-900 py-20 px-6">
//         <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center">
//           <div className="md:w-1/2 mb-10 md:mb-0">
//             <h1 className="text-4xl md:text-5xl font-bold mb-6 leading-tight">
//               Transform Your Look <br />
//               <span className="bg-gradient-to-r from-purple-500 to-pink-500 bg-clip-text text-transparent">
//                 With Our Experts
//               </span>
//             </h1>
//             <p className="text-gray-300 mb-8 text-lg">
//               Book your perfect salon experience with our easy online system.
//               Our professional stylists are ready to make you look your best.
//             </p>
//             <div className="flex space-x-4">
//               <button className="bg-purple-600 hover:bg-purple-700 text-white px-6 py-3 rounded-lg font-medium transition transform hover:scale-105">
//                 Book Now
//               </button>
//               <button className="border border-purple-500 text-purple-400 hover:bg-purple-900 hover:bg-opacity-30 px-6 py-3 rounded-lg font-medium transition">
//                 Our Services
//               </button>
//             </div>
//           </div>
//           <div className="md:w-1/2 flex justify-center">
//             <QuickBooking onBook={(booking) => console.log('Booking:', booking)} />
//           </div>
//         </div>
//       </section>

//       {/* Services Section */}
//       <section className="py-16 px-6 bg-gray-800">
//         <div className="max-w-7xl mx-auto">
//           <div className="text-center mb-12">
//             <h2 className="text-3xl font-bold mb-4">Our Services</h2>
//             <p className="text-gray-400 max-w-2xl mx-auto">
//               We offer a wide range of professional beauty services to help you look and feel your best.
//             </p>
//           </div>

//           <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
//             {services.map(service => (
//               <div
//                 key={service.name}
//                 className={`bg-gray-700 rounded-xl p-6 cursor-pointer transition-all ${activeService === service.name ? 'border-l-4 border-purple-500 transform scale-105' : 'hover:bg-gray-600'}`}
//                 onClick={() => setActiveService(service.name)}
//               >
//                 <div className="flex justify-between items-start mb-4">
//                   <h3 className="text-xl font-semibold">{service.name}</h3>
//                   <span className="bg-purple-900 text-purple-300 text-sm px-3 py-1 rounded-full">
//                     {service.price}
//                   </span>
//                 </div>
//                 <p className="text-gray-400 mb-3">Duration: {service.duration}</p>
//                 <p className="text-gray-300">
//                   {service.name === 'Haircut' && 'Professional haircut with styling and finishing.'}
//                   {service.name === 'Coloring' && 'Custom hair coloring with premium products.'}
//                   {service.name === 'Styling' && 'Special occasion styling and updos.'}
//                   {service.name === 'Manicure' && 'Luxurious hand care and nail treatment.'}
//                   {service.name === 'Pedicure' && 'Revitalizing foot care and nail treatment.'}
//                   {service.name === 'Facial' && 'Rejuvenating skin treatment and relaxation.'}
//                 </p>
//               </div>
//             ))}
//           </div>
//         </div>
//       </section>

//       {/* Testimonials */}
//       <section className="py-16 px-6 bg-gray-900">
//         <div className="max-w-7xl mx-auto">
//           <div className="text-center mb-12">
//             <h2 className="text-3xl font-bold mb-4">Client Testimonials</h2>
//             <p className="text-gray-400 max-w-2xl mx-auto">
//               Don't just take our word for it. Here's what our clients say:
//             </p>
//                   </div>

//       <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
//         {testimonials.map((testimonial, index) => (
//           <div key={index} className="bg-gray-800 rounded-xl p-6">
//             <div className="flex mb-4">
//               {[...Array(5)].map((_, i) => (
//                 <svg
//                   key={i}
//                   className={`w-5 h-5 ${i < testimonial.rating ? 'text-yellow-400' : 'text-gray-600'}`}
//                   fill="currentColor"
//                   viewBox="0 0 20 20"
//                 >
//                   <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
//                 </svg>
//               ))}
//             </div>
//             <p className="text-gray-300 italic mb-4">"{testimonial.comment}"</p>
//             <p className="text-purple-400 font-medium">— {testimonial.name}</p>
//           </div>
//         ))}
//       </div>
//     </div>
//   </section>

//   {/* Call to Action */}
//   <section className="py-20 px-6 bg-gradient-to-r from-purple-900 to-pink-800">
//     <div className="max-w-4xl mx-auto text-center">
//       <h2 className="text-3xl md:text-4xl font-bold mb-6">Ready for Your Transformation?</h2>
//       <p className="text-gray-200 mb-8 text-lg">
//         Book your appointment today and experience the difference of professional salon care.
//       </p>
//       <button className="bg-white text-purple-800 hover:bg-gray-100 px-8 py-4 rounded-lg font-bold text-lg transition transform hover:scale-105 shadow-lg">
//         Book Your Appointment Now
//       </button>
//     </div>
//   </section>
// </div>
// );
// };

// export default HomePage;

// import { useState, useEffect } from 'react';
// import { Link } from 'react-router-dom';
// import QuickBooking from '../../components/Appointment/QuickBooking';

// const HomePage = () => {
//   const [activeService, setActiveService] = useState('Haircut');
//   const [isMobile, setIsMobile] = useState(false);
//   const [showMobileBooking, setShowMobileBooking] = useState(false);

//   useEffect(() => {
//     const handleResize = () => {
//       setIsMobile(window.innerWidth < 768);
//     };
//     handleResize();
//     window.addEventListener('resize', handleResize);
//     return () => window.removeEventListener('resize', handleResize);
//   }, []);

//   const services = [
//     { name: 'Haircut', duration: '30 min', price: 'Rs.3500' },
//     { name: 'Coloring', duration: '2 hours', price: 'Rs.9000+' },
//     { name: 'Styling', duration: '45 min', price: 'Rs.5000' },
//     { name: 'Manicure', duration: '1 hour', price: 'Rs.4000' },
//     { name: 'Pedicure', duration: '1 hour', price: 'Rs.4500' },
//     { name: 'Facial', duration: '1.5 hours', price: 'Rs.7500' },
//   ];

//   const testimonials = [
//     { name: 'Sarah J.', comment: 'Best salon experience ever! The stylists are true artists.', rating: 5 },
//     { name: 'Michael T.', comment: 'Always leave looking and feeling amazing. Highly recommend!', rating: 5 },
//     { name: 'Emily R.', comment: 'Love the atmosphere and the results. Worth every penny.', rating: 4 },
//   ];

//   const handleBookingSubmit = (booking) => {
//     console.log('Booking:', booking);
//     if (isMobile) {
//       setShowMobileBooking(false);
//     }
//     // Here you would typically send the booking to your backend
//   };

//   return (
//     <div className="min-h-screen bg-gray-900 text-gray-100">
//       {/* Hero Section with Video Background */}
//       <section className="relative h-[600px] max-h-[800px] overflow-hidden">
//         {/* Video Background */}
//         <div className="absolute inset-0 z-0">
//           <picture>
//             <source srcSet="/images/hero-background-fallback.webp" media="(max-width: 640px)" />
//             <video
//               autoPlay
//               loop
//               muted
//               playsInline
//               className="w-full h-full object-cover"
//               poster="/images/hero-poster.jpg"
//             >
//               <source src="/videos/hero-background.mp4" type="video/mp4" />
//               <source src="/videos/hero-background.webm" type="video/webm" />
//               Your browser does not support the video tag.
//             </video>
//           </picture>

//           <div className="absolute inset-0 bg-gradient-to-b from-black/70 via-black/50 to-black/70"></div>
//         </div>

//         {/* Hero Content */}
//         <div className="relative z-10 h-full flex items-center">
//           <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 flex flex-col md:flex-row items-center w-full">
//             <div className="md:w-1/2 mb-10 md:mb-0 px-4">
//               <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold mb-4 sm:mb-6 leading-tight">
//                 Transform Your Look <br className="hidden sm:block" />
//                 <span className="bg-gradient-to-r from-purple-500 to-pink-500 bg-clip-text text-transparent">
//                   With Our Experts
//                 </span>
//               </h1>
//               <p className="text-gray-300 mb-6 sm:mb-8 text-base sm:text-lg lg:text-xl">
//                 Book your perfect salon experience with our easy online system.
//                 Our professional stylists are ready to make you look your best.
//               </p>
//               <div className="flex flex-col sm:flex-row space-y-3 sm:space-y-0 sm:space-x-4">
//                 {isMobile && (
//                   <button
//                     onClick={() => setShowMobileBooking(true)}
//                     className="bg-pink-600 hover:bg-pink-700 text-white px-5 py-2 sm:px-6 sm:py-3 rounded-lg font-medium transition transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-pink-500 focus:ring-offset-2 focus:ring-offset-gray-900 text-center text-sm sm:text-base"
//                   >
//                     Quick Book
//                   </button>
//                 )}
//                 <Link
//                   to="/book-now"
//                   className="bg-purple-600 hover:bg-purple-700 text-white px-5 py-2 sm:px-6 sm:py-3 rounded-lg font-medium transition transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2 focus:ring-offset-gray-900 text-center text-sm sm:text-base"
//                 >
//                   Book Now
//                 </Link>
//                 <Link
//                   to="/services"
//                   className="border border-purple-500 text-purple-400 hover:bg-purple-900 hover:bg-opacity-30 px-5 py-2 sm:px-6 sm:py-3 rounded-lg font-medium transition focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2 focus:ring-offset-gray-900 text-center text-sm sm:text-base"
//                 >
//                   Our Services
//                 </Link>
//               </div>
//             </div>

//             {/* Desktop Quick Booking */}
//             {!isMobile && (
//               <div className="md:w-1/2 flex justify-center px-4">
//                 <QuickBooking onBook={handleBookingSubmit} />
//               </div>
//             )}
//           </div>
//         </div>
//       </section>

//       {/* Mobile Quick Booking Modal */}
//       {isMobile && showMobileBooking && (
//         <div className="fixed inset-0 z-50 bg-black bg-opacity-70 flex items-center justify-center p-4">
//           <div className="bg-gray-800 rounded-xl w-full max-w-md max-h-[90vh] overflow-y-auto">
//             <div className="p-6">
//               <div className="flex justify-between items-center mb-4">
//                 <h3 className="text-xl font-bold">Quick Booking</h3>
//                 <button
//                   onClick={() => setShowMobileBooking(false)}
//                   className="text-gray-400 hover:text-white p-1"
//                   aria-label="Close booking modal"
//                 >
//                   <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//                     <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
//                   </svg>
//                 </button>
//               </div>
//               <QuickBooking
//                 onBook={handleBookingSubmit}
//                 compact={true}
//               />
//             </div>
//           </div>
//         </div>
//       )}

//       {/* Services Section */}
//       <section className="py-12 sm:py-16 px-4 sm:px-6 bg-gray-800">
//         <div className="max-w-7xl mx-auto">
//           <div className="text-center mb-8 sm:mb-12">
//             <h2 className="text-2xl sm:text-3xl font-bold mb-3 sm:mb-4">Our Services</h2>
//             <p className="text-gray-400 max-w-2xl mx-auto text-sm sm:text-base">
//               We offer a wide range of professional beauty services to help you look and feel your best.
//             </p>
//           </div>

//           <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
//             {services.map(service => (
//               <div
//                 key={service.name}
//                 className={`bg-gray-700 rounded-lg sm:rounded-xl p-4 sm:p-6 cursor-pointer transition-all ${activeService === service.name ? 'border-l-4 border-purple-500 sm:transform sm:scale-105' : 'hover:bg-gray-600'}`}
//                 onClick={() => setActiveService(service.name)}
//               >
//                 <div className="flex justify-between items-start mb-3 sm:mb-4">
//                   <h3 className="text-lg sm:text-xl font-semibold">{service.name}</h3>
//                   <span className="bg-purple-900 text-purple-300 text-xs sm:text-sm px-2 sm:px-3 py-1 rounded-full">
//                     {service.price}
//                   </span>
//                 </div>
//                 <p className="text-gray-400 mb-2 sm:mb-3 text-sm sm:text-base">Duration: {service.duration}</p>
//                 <p className="text-gray-300 text-sm sm:text-base">
//                   {service.name === 'Haircut' && 'Professional haircut with styling and finishing.'}
//                   {service.name === 'Coloring' && 'Custom hair coloring with premium products.'}
//                   {service.name === 'Styling' && 'Special occasion styling and updos.'}
//                   {service.name === 'Manicure' && 'Luxurious hand care and nail treatment.'}
//                   {service.name === 'Pedicure' && 'Revitalizing foot care and nail treatment.'}
//                   {service.name === 'Facial' && 'Rejuvenating skin treatment and relaxation.'}
//                 </p>
//               </div>
//             ))}
//           </div>
//         </div>
//       </section>

//       {/* Testimonials Section */}
//       <section className="py-12 sm:py-16 px-4 sm:px-6 bg-gray-900">
//         <div className="max-w-7xl mx-auto">
//           <div className="text-center mb-8 sm:mb-12">
//             <h2 className="text-2xl sm:text-3xl font-bold mb-3 sm:mb-4">Client Testimonials</h2>
//             <p className="text-gray-400 max-w-2xl mx-auto text-sm sm:text-base">
//               Don't just take our word for it. Here's what our clients say:
//             </p>
//           </div>

//           <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
//             {testimonials.map((testimonial, index) => (
//               <div key={index} className="bg-gray-800 rounded-lg sm:rounded-xl p-4 sm:p-6">
//                 <div className="flex mb-3 sm:mb-4">
//                   {[...Array(5)].map((_, i) => (
//                     <svg
//                       key={i}
//                       className={`w-4 h-4 sm:w-5 sm:h-5 ${i < testimonial.rating ? 'text-yellow-400' : 'text-gray-600'}`}
//                       fill="currentColor"
//                       viewBox="0 0 20 20"
//                     >
//                       <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
//                     </svg>
//                   ))}
//                 </div>
//                 <p className="text-gray-300 italic mb-3 sm:mb-4 text-sm sm:text-base">"{testimonial.comment}"</p>
//                 <p className="text-purple-400 font-medium text-sm sm:text-base">— {testimonial.name}</p>
//               </div>
//             ))}
//           </div>
//         </div>
//       </section>

//       {/* Call to Action Section */}
//       <section className="py-12 sm:py-16 px-4 sm:px-6 bg-gradient-to-r from-purple-900 to-pink-800">
//         <div className="max-w-4xl mx-auto text-center">
//           <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-4 sm:mb-6">Ready for Your Transformation?</h2>
//           <p className="text-gray-200 mb-6 sm:mb-8 text-sm sm:text-base lg:text-lg">
//             Book your appointment today and experience the difference of professional salon care.
//           </p>
//           <div className="flex flex-col sm:flex-row justify-center gap-4">
//             <Link
//               to="/book-now"
//               className="bg-white text-purple-800 hover:bg-gray-100 px-6 py-3 sm:px-8 sm:py-4 rounded-lg font-bold text-base sm:text-lg transition transform hover:scale-105 shadow-lg"
//             >
//               Book Appointment
//             </Link>
//             {isMobile && (
//               <button
//                 onClick={() => setShowMobileBooking(true)}
//                 className="bg-pink-600 hover:bg-pink-700 text-white px-6 py-3 sm:px-8 sm:py-4 rounded-lg font-bold text-base sm:text-lg transition transform hover:scale-105 shadow-lg"
//               >
//                 Quick Book
//               </button>
//             )}
//           </div>
//         </div>
//       </section>
//     </div>
//   );
// };

// export default HomePage;

import { useState, useEffect, useRef } from "react";
import { Link, useNavigate, useLocation} from "react-router-dom";
import { motion } from "framer-motion";
import { FiChevronLeft, FiChevronRight } from "react-icons/fi";
import QuickBooking from "../../components/Appointment/QuickBooking";

const HomePage = () => {
  const [activeService, setActiveService] = useState("Haircut");

  const [isMobile, setIsMobile] = useState(false);
  const location = useLocation();
  const [showMobileBooking, setShowMobileBooking] = useState(false);
  const [selectedService, setSelectedService] = useState(null);
  const [currentStylistIndex, setCurrentStylistIndex] = useState(0);
  const [autoSlide, setAutoSlide] = useState(true);
  const [stylists, setStylists] = useState([]);
  const [loadingStylists, setLoadingStylists] = useState(true);
  const autoSlideInterval = useRef();
  const navigate = useNavigate();

  // Scroll to section when URL has a hash (#services, #stylist, #gallery)
  useEffect(() => {
    if (!location.hash) return;

    const id = location.hash.replace("#", "");
    const el = document.getElementById(id);

    if (el) {
      // tiny timeout to ensure DOM is ready
      setTimeout(() => {
        el.scrollIntoView({ behavior: "smooth", block: "start" });
      }, 0);
    }
  }, [location]);

  // Fetch stylists from API
  useEffect(() => {
    const fetchStylists = async () => {
      try {
        const response = await fetch(
          "https://nvsalonbackend.dockyardsoftware.com/api/AdminAuth/staffview"
        );
        if (!response.ok) throw new Error("Failed to fetch staff data");

        const data = await response.json();
        console.log("Fetched stylists:", data);

        if (!Array.isArray(data.staff)) {
          throw new Error("Unexpected API response");
        }

        const formattedStylists = data.staff.map((staff) => ({
          id: staff.Id || Math.random().toString(36).substr(2, 9),
          name: staff.Name,
          specialty: staff.Role || "Stylist",
          experience: staff.Experience || "5+ years",
          bio: staff.Description || "",
          instagram: "",
          image:
            `https://nvsalonbackend.dockyardsoftware.com/${staff.ImageUrl}` ||
            "/images/default-stylist.jpg",
          // ? `https://localhost:7014${staff.ImageUrl}`
          // : '/images/default-stylist.jpg',
        }));

        setStylists(formattedStylists);
      } catch (err) {
        console.error("Error loading stylists:", err.message);
        // Fallback to default stylists if API fails
        setStylists([
          {
            id: 1,
            name: "Alex Morgan",
            specialty: "Hair Specialist",
            experience: "8+ years",
            image: "/images/stylist1.jpg",
          },
          {
            id: 2,
            name: "Jamie Lee",
            specialty: "Color Expert",
            experience: "6+ years",
            image: "/images/stylist2.jpg",
          },
          {
            id: 3,
            name: "Taylor Swift",
            specialty: "Nail Artist",
            experience: "5+ years",
            image: "/images/stylist3.jpg",
          },
          {
            id: 4,
            name: "Jordan Smith",
            specialty: "Skin Therapist",
            experience: "7+ years",
            image: "/images/stylist4.jpg",
          },
        ]);
      } finally {
        setLoadingStylists(false);
      }
    };

    fetchStylists();
  }, []);

  // Auto-slide effect
  // useEffect(() => {
  //   if (autoSlide && stylists.length > 0) {
  //     autoSlideInterval.current = setInterval(() => {
  //       setCurrentStylistIndex(prev =>
  //         prev === stylists.length - (isMobile ? 1 : 4) ? 0 : prev + 1
  //       );
  //     }, 5000);
  //   }

  //   return () => clearInterval(autoSlideInterval.current);
  // }, [autoSlide, isMobile, stylists.length]);
  useEffect(() => {
    const maxIndex = Math.max(0, stylists.length - (isMobile ? 1 : 4));
    if (autoSlide && stylists.length > 0) {
      autoSlideInterval.current = setInterval(() => {
        setCurrentStylistIndex((prev) => (prev >= maxIndex ? 0 : prev + 1));
      }, 5000);
    }
    return () => clearInterval(autoSlideInterval.current);
  }, [autoSlide, isMobile, stylists.length]);

  // Handle window resize
  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768);
    };
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // Pause auto-slide when user interacts
  const pauseAutoSlide = () => {
    setAutoSlide(false);
    setTimeout(() => setAutoSlide(true), 10000);
  };

  // const nextStylist = () => {
  //   pauseAutoSlide();
  //   setCurrentStylistIndex(prev =>
  //     prev === stylists.length - (isMobile ? 1 : 4) ? 0 : prev + 1
  //   );
  // };
  const nextStylist = () => {
    pauseAutoSlide();
    const maxIndex = Math.max(0, stylists.length - (isMobile ? 1 : 4));
    setCurrentStylistIndex((prev) => (prev >= maxIndex ? 0 : prev + 1));
  };

  // const prevStylist = () => {
  //   pauseAutoSlide();
  //   setCurrentStylistIndex(prev =>
  //     prev === 0 ? stylists.length - (isMobile ? 1 : 4) : prev - 1
  //   );
  // };

  const prevStylist = () => {
    pauseAutoSlide();
    const maxIndex = Math.max(0, stylists.length - (isMobile ? 1 : 4));
    setCurrentStylistIndex((prev) => (prev <= 0 ? maxIndex : prev - 1));
  };

  const services = [
    {
      name: "Haircut",
      duration: "1 hour",
      price: "Rs.3500",
      description:
        "A professional haircut tailored to your style, including a consultation, precision cut, and finishing touches with premium styling products.",
      image: "/images/haircut.jpg",
    },
    {
      name: "Coloring",
      duration: "1 hour",
      price: "Rs.1200",
      description:
        "Transform your look with custom hair coloring using high-quality, long-lasting products. Includes a color consultation and post-color treatment.",
      image: "/images/Coloring.jpg",
    },
    {
      name: "Styling",
      duration: "1 hour",
      price: "Rs.5000",
      description:
        "Perfect for special occasions, our styling service offers elegant updos, blowouts, or intricate styles to make you stand out.",
      image: "/images/Styling.jpg",
    },
    {
      name: "Manicure",
      duration: "1 hour",
      price: "Rs.4000",
      description:
        "Indulge in a luxurious manicure with nail shaping, cuticle care, a relaxing hand massage, and a polish of your choice.",
      image: "/images/Manicure.jpg",
    },
    {
      name: "Pedicure",
      duration: "1 hour",
      price: "Rs.4500",
      description:
        "Revitalize your feet with a pedicure that includes a soothing soak, exfoliation, nail care, and a hydrating massage.",
      image: "/images/pedicure.jpg",
    },
    {
      name: "Facial",
      duration: "1 hour",
      price: "Rs.15500",
      description:
        "Rejuvenate your skin with a facial tailored to your skin type, featuring cleansing, exfoliation, a mask, and a relaxing massage.",
      image: "/images/Facial.jpg",
    },
  ];

  const testimonials = [
    {
      name: "Sarah J.",
      comment: "Best salon experience ever! The stylists are true artists.",
      rating: 5,
    },
    {
      name: "Michael T.",
      comment: "Always leave looking and feeling amazing. Highly recommend!",
      rating: 5,
    },
    {
      name: "Emily R.",
      comment: "Love the atmosphere and the results. Worth every penny.",
      rating: 4,
    },
  ];

  const popularTreatments = [
    {
      name: "Signature Hair Spa",
      description: "Deep conditioning treatment for damaged hair",
      price: "Rs.6000",
      image: "/images/haircut.jpg",
    },
    {
      name: "Royal Pedicure",
      description: "Luxurious foot treatment with paraffin wax",
      price: "Rs.5500",
      image: "/images/pedicure.jpg",
    },
    {
      name: "Gold Facial",
      description: "Anti-aging treatment with 24K gold",
      price: "Rs.8500",
      image: "/images/Facial.jpg",
    },
  ];

  const handleBookingSubmit = (booking) => {
    console.log("Booking:", booking);
    // if (isMobile) setShowMobileBooking(false);
   
    
  };

  const handleDone = () => {
    if (isMobile) setShowMobileBooking(false);
    navigate("/bookings");
  };

  return (
    <div className="min-h-screen bg-gray-900 text-gray-100">
      {/* Hero Section with Video Background */}
      <section className="relative h-[600px] max-h-[800px] overflow-hidden">
        {/* Video Background */}
        <div className="absolute inset-0 z-0">
          <picture>
            <source
              srcSet="/images/hero-background-fallback.webp"
              media="(max-width: 640px)"
            />
            <video
              autoPlay
              loop
              muted
              playsInline
              className="w-full h-full object-cover"
              poster="/images/hero-poster.jpg"
            >
              <source src="/videos/hero-background.mp4" type="video/mp4" />
              <source src="/videos/hero-background.webm" type="video/webm" />
              Your browser does not support the video tag.
            </video>
          </picture>

          <div className="absolute inset-0 bg-gradient-to-b from-black/70 via-black/50 to-black/70"></div>
        </div>

        {/* Hero Content */}
        <div className="relative z-10 h-full flex items-center">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 flex flex-col md:flex-row items-center w-full">
            <div className="md:w-1/2 mb-10 md:mb-0 px-4">
              <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold mb-4 sm:mb-6 leading-tight">
                Transform Your Look <br className="hidden sm:block" />
                <span className="bg-gradient-to-r from-purple-500 to-pink-500 bg-clip-text text-transparent">
                  With Our Experts
                </span>
              </h1>
              <p className="text-gray-300 mb-6 sm:mb-8 text-base sm:text-lg lg:text-xl">
                Book your perfect salon experience with our easy online system.
                Our professional stylists are ready to make you look your best.
              </p>
              <div className="flex flex-col sm:flex-row space-y-3 sm:space-y-0 sm:space-x-4">
                {isMobile && (
                  <button
                    onClick={() => setShowMobileBooking(true)}
                    className="bg-pink-600 hover:bg-pink-700 text-white px-5 py-2 sm:px-6 sm:py-3 rounded-lg font-medium transition transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-pink-500 focus:ring-offset-2 focus:ring-offset-gray-900 text-center text-sm sm:text-base"
                  >
                    Quick Book
                  </button>
                )}
                <Link
                  to="/book-now"
                  className="bg-purple-600 hover:bg-purple-700 text-white px-5 py-2 sm:px-6 sm:py-3 rounded-lg font-medium transition transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2 focus:ring-offset-gray-900 text-center text-sm sm:text-base"
                  onClick={() => window.scrollTo(0, 0)}
                >
                  Book Now
                </Link>
                <Link
                  to="/services"
                  className="border border-purple-500 text-purple-400 hover:bg-purple-900 hover:bg-opacity-30 px-5 py-2 sm:px-6 sm:py-3 rounded-lg font-medium transition focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2 focus:ring-offset-gray-900 text-center text-sm sm:text-base"
                >
                  Our Services
                </Link>
              </div>
            </div>

            {/* Desktop Quick Booking */}
            {!isMobile && (
              <div className="md:w-1/2 flex justify-center px-4">
                <QuickBooking
                  onBook={handleBookingSubmit}
                  onDone={handleDone}
                />
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Mobile Quick Booking Modal */}
      {isMobile && showMobileBooking && (
        <div className="fixed inset-0 z-50 bg-black bg-opacity-70 flex items-center justify-center p-4">
          <div className="bg-gray-800 rounded-xl w-full max-w-md max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-xl font-bold">Quick Booking</h3>
                <button
                  onClick={() => setShowMobileBooking(false)}
                  className="text-gray-400 hover:text-white p-1"
                  aria-label="Close booking modal"
                >
                  <svg
                    className="w-6 h-6"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M6 18L18 6M6 6l12 12"
                    />
                  </svg>
                </button>
              </div>
              <QuickBooking onBook={handleBookingSubmit} onDone={handleDone} />
            </div>
          </div>
        </div>
      )}

      {/* Service Details Popup */}
      {selectedService && (
        <div
          className="fixed inset-0 z-50 bg-black bg-opacity-70 flex items-center justify-center p-4"
          onClick={() => setSelectedService(null)}
        >
          <div
            className="bg-gray-800 rounded-xl w-full max-w-lg max-h-[90vh] overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="p-6">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-xl font-bold">{selectedService.name}</h3>
                <button
                  onClick={() => setSelectedService(null)}
                  className="text-gray-400 hover:text-white p-1"
                  aria-label="Close service details"
                >
                  <svg
                    className="w-6 h-6"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M6 18L18 6M6 6l12 12"
                    />
                  </svg>
                </button>
              </div>
              <div className="mb-4">
                <img
                  src={selectedService.image}
                  alt={selectedService.name}
                  className="w-full h-48 object-cover rounded-lg"
                  loading="lazy"
                />
              </div>
              <div className="space-y-3">
                <p className="text-gray-300 text-sm">
                  <span className="font-semibold text-purple-400">
                    Duration:
                  </span>{" "}
                  {selectedService.duration}
                </p>
                <p className="text-gray-300 text-sm">
                  <span className="font-semibold text-purple-400">Price:</span>{" "}
                  {selectedService.price}
                </p>
                <p className="text-gray-300 text-sm">
                  {selectedService.description}
                </p>
              </div>
              <div className="mt-6 text-center">
                <Link
                  to="/book-now"
                  className="bg-purple-600 hover:bg-purple-700 text-white px-6 py-2 rounded-lg font-medium transition transform hover:scale-105"
                  onClick={() => setSelectedService(null)}
                >
                  Book This Service
                </Link>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Services Section */}
      <section
        id="services"
        className="py-12 sm:py-16 px-4 sm:px-6 bg-gray-800"
      >
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-8 sm:mb-12">
            <h2 className="text-2xl sm:text-3xl font-bold mb-3 sm:mb-4">
              Our Services
            </h2>
            <p className="text-gray-400 max-w-2xl mx-auto text-sm sm:text-base">
              We offer a wide range of professional beauty services to help you
              look and feel your best.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
            {services.map((service) => (
              <div
                key={service.name}
                className={`bg-gray-700 rounded-lg sm:rounded-xl p-4 sm:p-6 cursor-pointer transition-all ${
                  activeService === service.name
                    ? "border-l-4 border-purple-500 sm:transform sm:scale-105"
                    : "hover:bg-gray-600"
                }`}
                onClick={() => {
                  setActiveService(service.name);
                  setSelectedService(service);
                }}
              >
                <div className="flex justify-between items-start mb-3 sm:mb-4">
                  <h3 className="text-lg sm:text-xl font-semibold">
                    {service.name}
                  </h3>
                  <span className="bg-purple-900 text-purple-300 text-xs sm:text-sm px-2 sm:px-3 py-1 rounded-full">
                    {service.price}
                  </span>
                </div>
                <p className="text-gray-400 mb-2 sm:mb-3 text-sm sm:text-base">
                  Duration: {service.duration}
                </p>
                <p className="text-gray-300 text-sm sm:text-base">
                  {service.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Popular Treatments Section */}
      <section className="py-12 sm:py-16 px-4 sm:px-6 bg-gray-900">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-8 sm:mb-12">
            <h2 className="text-2xl sm:text-3xl font-bold mb-3 sm:mb-4">
              Signature Treatments
            </h2>
            <p className="text-gray-400 max-w-2xl mx-auto text-sm sm:text-base">
              Experience our most luxurious and popular treatments
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-8">
            {popularTreatments.map((treatment, index) => (
              <div
                key={index}
                className="bg-gray-800 rounded-lg sm:rounded-xl overflow-hidden hover:shadow-lg transition"
              >
                <div className="h-48 overflow-hidden">
                  <img
                    src={treatment.image}
                    alt={treatment.name}
                    className="w-full h-full object-cover hover:scale-105 transition-transform duration-500"
                    loading="lazy"
                  />
                </div>
                <div className="p-4 sm:p-6">
                  <h3 className="text-lg sm:text-xl font-bold mb-2">
                    {treatment.name}
                  </h3>
                  <p className="text-gray-400 mb-3 text-sm sm:text-base">
                    {treatment.description}
                  </p>
                  <div className="flex justify-between items-center">
                    <span className="text-purple-400 font-medium">
                      {treatment.price}
                    </span>
                    <Link
                      to="/book-now"
                      className="text-sm bg-purple-600 hover:bg-purple-700 text-white px-3 py-1 sm:px-4 sm:py-2 rounded transition"
                      onClick={() => window.scrollTo(0, 0)}
                    >
                      Book Now
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Video Section */}
      <section className="py-12 sm:py-16 px-4 sm:px-6 bg-gray-900">
        <div className="max-w-screen-3xl mx-auto">
          <div className="text-center mb-8 sm:mb-12">
            <h2 className="text-2xl sm:text-3xl font-bold mb-3 sm:mb-4">
              Discover Our Salon
            </h2>
            <p className="text-gray-400 max-w-2xl mx-auto text-sm sm:text-base">
              Take a virtual tour of our luxurious space and services
            </p>
          </div>

          <div className="relative rounded-lg sm:rounded-xl overflow-hidden h-64 sm:h-[600px]">
            <picture>
              <source
                srcSet="/images/salon-tour-fallback.webp"
                media="(max-width: 640px)"
              />
              <video
                autoPlay
                loop
                muted
                playsInline
                className="w-full h-full object-cover"
                poster="/images/salon-tour-poster.jpg"
              >
                <source src="/videos/hero-background.mp4" type="video/mp4" />
                Your browser does not support the video tag.
              </video>
            </picture>
            <div className="absolute inset-0 bg-gradient-to-b from-transparent to-black/80"></div>
          </div>
        </div>
      </section>

      {/* Stylist Showcase Section */}
      <section
        id="stylist"
        className="py-12 sm:py-16 px-4 sm:px-6 bg-gray-800 overflow-hidden"
      >
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-8 sm:mb-12">
            <motion.h2
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              viewport={{ once: true }}
              className="text-2xl sm:text-3xl font-bold mb-3 sm:mb-4"
            >
              Meet Our Master Stylists
            </motion.h2>
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
              viewport={{ once: true }}
              className="text-gray-400 max-w-2xl mx-auto text-sm sm:text-base"
            >
              Our talented team of professionals is ready to create your perfect
              look
            </motion.p>
          </div>

          {loadingStylists ? (
            <div className="text-center py-12">
              <p className="text-gray-400">Loading stylists...</p>
            </div>
          ) : stylists.length > 0 ? (
            <div
              className="relative"
              onMouseEnter={() => setAutoSlide(false)}
              onMouseLeave={() => setAutoSlide(true)}
            >
              <button
                onClick={prevStylist}
                className="absolute left-0 top-1/2 -translate-y-1/2 z-10 bg-gray-900 bg-opacity-70 p-2 rounded-full text-white hover:bg-purple-600 transition"
                aria-label="Previous stylists"
              >
                <FiChevronLeft className="text-xl" />
              </button>

              <div className="overflow-hidden">
                <motion.div
                  animate={{
                    x: -currentStylistIndex * (100 / (isMobile ? 1 : 4)) + "%",
                  }}
                  transition={{ type: "spring", stiffness: 300, damping: 30 }}
                  className="flex w-full"
                >
                  {stylists.map((stylist) => (
                    <motion.div
                      key={stylist.id}
                      initial={{ opacity: 0, scale: 0.9 }}
                      whileInView={{ opacity: 1, scale: 1 }}
                      transition={{ duration: 0.5 }}
                      viewport={{ once: true, margin: "0px 0px -50px 0px" }}
                      className={`w-full ${
                        isMobile ? "min-w-full" : "min-w-[calc(25%-16px)]"
                      } px-2`}
                    >
                      <div className="bg-gray-700 rounded-lg sm:rounded-xl overflow-hidden text-center hover:shadow-lg hover:shadow-purple-500/20 transition-all duration-300">
                        <div className="h-40 sm:h-48 relative overflow-hidden">
                          <img
                            src={stylist.image}
                            alt={stylist.name}
                            className="w-full h-full object-cover"
                            loading="lazy"
                            onError={(e) => {
                              e.target.src = "/images/default-stylist.jpg";
                            }}
                          />
                          <div className="absolute inset-0 bg-gradient-to-t from-gray-900/80 to-transparent" />
                          <div className="absolute bottom-4 left-0 right-0">
                            <div className="w-16 h-16 mx-auto rounded-full bg-gray-800 border-2 border-purple-500 flex items-center justify-center overflow-hidden">
                              <img
                                src={stylist.image}
                                alt={stylist.name}
                                className="w-full h-full object-cover"
                                onError={(e) => {
                                  e.target.src = "/images/default-stylist.jpg";
                                }}
                              />
                            </div>
                          </div>
                        </div>
                        <div className="p-4">
                          <h3 className="font-bold mb-1">{stylist.name}</h3>
                          <p className="text-purple-400 text-sm mb-2">
                            {stylist.specialty}
                          </p>
                          <p className="text-gray-400 text-xs">
                            {stylist.experience}
                          </p>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </motion.div>
              </div>

              <button
                onClick={nextStylist}
                className="absolute right-0 top-1/2 -translate-y-1/2 z-10 bg-gray-900 bg-opacity-70 p-2 rounded-full text-white hover:bg-purple-600 transition"
                aria-label="Next stylists"
              >
                <FiChevronRight className="text-xl" />
              </button>
            </div>
          ) : (
            <div className="text-center py-12">
              <p className="text-gray-400">
                No stylists available at the moment.
              </p>
            </div>
          )}

          {/* Dots indicator */}
          {stylists.length > 0 && (
            <div className="flex justify-center mt-6 space-x-2">
              {Array.from({
                length: isMobile
                  ? stylists.length
                  : Math.max(1, stylists.length - 3),
              }).map((_, index) => (
                <button
                  key={index}
                  onClick={() => {
                    pauseAutoSlide();
                    setCurrentStylistIndex(index);
                  }}
                  className={`w-2 h-2 rounded-full transition-all ${
                    currentStylistIndex === index
                      ? "bg-purple-500 w-4"
                      : "bg-gray-600"
                  }`}
                  aria-label={`Go to stylist ${index + 1}`}
                />
              ))}
            </div>
          )}

          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
            viewport={{ once: true }}
            className="text-center mt-8"
          >
            <Link
              to="/stylists"
              className="inline-block border border-purple-500 text-purple-400 hover:bg-purple-900 hover:bg-opacity-30 px-6 py-2 rounded-lg font-medium transition hover:scale-105"
            >
              View All Stylists
            </Link>
          </motion.div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="py-12 sm:py-16 px-4 sm:px-6 bg-gray-900">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-8 sm:mb-12">
            <h2 className="text-2xl sm:text-3xl font-bold mb-3 sm:mb-4">
              Client Testimonials
            </h2>
            <p className="text-gray-400 max-w-2xl mx-auto text-sm sm:text-base">
              Don't just take our word for it. Here's what our clients say:
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
            {testimonials.map((testimonial, index) => (
              <div
                key={index}
                className="bg-gray-800 rounded-lg sm:rounded-xl p-4 sm:p-6"
              >
                <div className="flex mb-3 sm:mb-4">
                  {[...Array(5)].map((_, i) => (
                    <svg
                      key={i}
                      className={`w-4 h-4 sm:w-5 sm:h-5 ${
                        i < testimonial.rating
                          ? "text-yellow-400"
                          : "text-gray-600"
                      }`}
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                    </svg>
                  ))}
                </div>
                <p className="text-gray-300 italic mb-3 sm:mb-4 text-sm sm:text-base">
                  "{testimonial.comment}"
                </p>
                <p className="text-purple-400 font-medium text-sm sm:text-base">
                  — {testimonial.name}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Before & After Gallery */}
      <section id="gallery" className="py-12 sm:py-16 px-4 sm:px-6 bg-gray-800">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-8 sm:mb-12">
            <h2 className="text-2xl sm:text-3xl font-bold mb-3 sm:mb-4">
              Transformations
            </h2>
            <p className="text-gray-400 max-w-2xl mx-auto text-sm sm:text-base">
              See the amazing results our clients have achieved
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
            {[1, 2, 3].map((item) => (
              <div
                key={item}
                className="bg-gray-700 rounded-lg sm:rounded-xl overflow-hidden"
              >
                <div className="relative h-48 sm:h-56">
                  <div className="absolute inset-0 bg-gradient-to-b from-transparent to-black/70 flex items-end p-4">
                    <div>
                      <h3 className="font-bold text-white">
                        {
                          ["Hair Makeover", "Bridal Styling", "Skin Treatment"][
                            item - 1
                          ]
                        }
                      </h3>
                      <p className="text-purple-300 text-sm">Client #{item}</p>
                    </div>
                  </div>
                  <img
                    src={`/images/hair-${item}.jpg`}
                    alt={`Transformation ${item}`}
                    className="w-full h-full object-cover"
                    loading="lazy"
                  />
                </div>
              </div>
            ))}
          </div>

          <div className="text-center mt-8">
            <Link
              to="/portfolio"
              className="inline-block border border-purple-500 text-purple-400 hover:bg-purple-900 hover:bg-opacity-30 px-6 py-2 rounded-lg font-medium transition"
              onClick={() => window.scrollTo(0, 0)}
            >
              View Full Gallery
            </Link>
          </div>
        </div>
      </section>

      {/* Call to Action Section */}
      <section className="py-12 sm:py-16 px-4 sm:px-6 bg-gradient-to-r from-purple-900 to-pink-800">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-4 sm:mb-6">
            Ready for Your Transformation?
          </h2>
          <p className="text-gray-200 mb-6 sm:mb-8 text-sm sm:text-base lg:text-lg">
            Book your appointment today and experience the difference of
            professional salon care.
          </p>
          <div className="flex flex-col sm:flex-row justify-center gap-4">
            <Link
              to="/book-now"
              className="bg-white text-purple-800 hover:bg-gray-100 px-6 py-3 sm:px-8 sm:py-4 rounded-lg font-bold text-base sm:text-lg transition transform hover:scale-105 shadow-lg"
              onClick={() => window.scrollTo(0, 0)}
            >
              Book Appointment
            </Link>
            {isMobile && (
              <button
                onClick={() => setShowMobileBooking(true)}
                className="bg-pink-600 hover:bg-pink-700 text-white px-6 py-3 sm:px-8 sm:py-4 rounded-lg font-bold text-base sm:text-lg transition transform hover:scale-105 shadow-lg"
              >
                Quick Book
              </button>
            )}
          </div>
        </div>
      </section>
    </div>
  );
};

export default HomePage;
