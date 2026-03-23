import { FiUser, FiInstagram } from 'react-icons/fi';

// const StylistCard = ({ stylist, onViewPortfolio }) => {
//   return (
//     <div className="bg-gray-800 rounded-xl overflow-hidden hover:shadow-lg transition">
//       <div className="h-64 bg-gradient-to-r from-purple-900 to-pink-800 flex items-center justify-center">
//         <FiUser className="text-white text-6xl opacity-50" />
//       </div>
//       <div className="p-6">
//         <h3 className="text-xl font-semibold mb-1">{stylist.name}</h3>
//         <p className="text-purple-400 mb-4">{stylist.specialty}</p>
//         <p className="text-gray-400 text-sm mb-4">{stylist.bio}</p>
        
//         <div className="flex justify-between items-center">
//           <span className="text-gray-500 text-sm">{stylist.experience} experience</span>
          
//           <div className="flex space-x-3">
//             <a 
//               href={`https://instagram.com/${stylist.instagram}`} 
//               target="_blank" 
//               rel="noopener noreferrer"
//               className="text-gray-400 hover:text-pink-500 transition"
//             >
//               <FiInstagram size={18} />
//             </a>
//             <button 
//               onClick={() => onViewPortfolio(stylist)}
//               className="text-purple-400 hover:text-purple-300 text-sm font-medium"
//             >
//               Portfolio
//             </button>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// };



// const StylistCard = ({ stylist, onViewPortfolio }) => {
//   return (
//     <div className="bg-gray-800 rounded-lg  overflow-hidden shadow-lg  w-full ">
//       <div className="relative w-full aspect-[5/5]">
//         {stylist.image ? (
//           <img 
//             src={stylist.image} 
//             alt={stylist.name}
//             className="w-full h-full object-cover object-top "
//           />
//         ) : (
//           <div className="w-full h-full bg-gray-700 flex items-center justify-center">
//             <FiUser className="text-4xl text-gray-400" />
//           </div>
//         )}
//       </div>
//       <div className="p-4">
//         <h3 className="text-xl font-bold">{stylist.name}</h3>
//         <p className="text-purple-300">{stylist.phone}</p>
//         <p className="text-gray-400 text-sm mt-2">{stylist.specialty}</p>
//         <p className="text-gray-400 text-sm mt-2">{stylist.email}</p>
//         <p className="text-gray-300 mt-3 line-clamp-2">{stylist.bio}</p>
//         <div className="mt-4 flex items-center">
//           <FiInstagram className="mr-2" />
//           <span className="text-sm">{stylist.instagram}</span>
//         </div>
//         <button 
//           onClick={onViewPortfolio}
//           className="mt-4 w-full bg-purple-600 hover:bg-purple-700 text-white py-2 rounded"
//         >
//           View Portfolio
//         </button>
//       </div>
//     </div>
//   );
// };
const StylistCard = ({ stylist, onViewPortfolio }) => {
  return (
    <div className="group bg-gradient-to-br from-purple-700/60 via-indigo-700/40 to-pink-600/60 rounded-2xl p-[1px] shadow-lg shadow-black/40 hover:shadow-purple-500/40 transition-transform duration-300 hover:-translate-y-1 w-full">
      <div className="bg-gray-900 rounded-2xl overflow-hidden flex flex-col h-full">
        {/* Image */}
        <div className="relative w-full aspect-[4/5] overflow-hidden">
          {stylist.image ? (
            <img
              src={stylist.image}
              alt={stylist.name}
              className="w-full h-full object-cover object-top transform transition-transform duration-500 group-hover:scale-105"
            />
          ) : (
            <div className="w-full h-full bg-gray-800 flex items-center justify-center">
              <FiUser className="text-5xl text-gray-500" />
            </div>
          )}

          {/* Soft gradient overlay at bottom */}
          <div className="pointer-events-none absolute inset-x-0 bottom-0 h-20 bg-gradient-to-t from-gray-900/90 via-gray-900/40 to-transparent" />
        </div>

        {/* Content */}
        <div className="p-4 sm:p-5 flex flex-col flex-1">
          {/* Name + role */}
          <div className="flex items-start justify-between gap-3">
            <div>
              <h3 className="text-lg sm:text-xl font-semibold text-white leading-tight">
                {stylist.name}
              </h3>
              <p className="mt-1 inline-flex items-center rounded-full bg-purple-500/10 px-3 py-1 text-xs font-medium text-purple-300 border border-purple-500/30">
                {stylist.specialty}
              </p>
            </div>
          </div>

          {/* Contact */}
          <div className="mt-3 space-y-1.5 text-xs sm:text-sm">
            <p className="text-gray-400">
              <span className="text-gray-500">Phone:</span>{" "}
              <span className="text-gray-200">{stylist.phone}</span>
            </p>
            <p className="text-gray-400 break-all">
              <span className="text-gray-500">Email:</span>{" "}
              <span className="text-gray-200">{stylist.email}</span>
            </p>
          </div>

          {/* Bio */}
          <p className="mt-3 text-sm text-gray-300 line-clamp-3">
            {stylist.bio}
          </p>

          {/* Instagram + button */}
          <div className="mt-4 flex items-center justify-between gap-3">
            <div className="flex items-center gap-2 rounded-full bg-gray-800/70 px-3 py-1.5 text-xs text-gray-300">
              <FiInstagram className="text-pink-400" />
              <span className="truncate">{stylist.instagram}</span>
            </div>

            <button
              onClick={onViewPortfolio}
              className="text-xs sm:text-sm whitespace-nowrap font-medium rounded-full px-4 py-1.5 bg-purple-600/90 hover:bg-purple-500 text-white transition-colors duration-200 shadow-sm shadow-purple-500/30"
            >
              View Portfolio
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StylistCard;