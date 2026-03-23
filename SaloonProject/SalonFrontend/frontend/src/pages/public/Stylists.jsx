// import { useState } from 'react';
// import { FiUser, FiInstagram, FiFacebook } from 'react-icons/fi';
// import PortfolioView from '../../components/Stylist/PortfolioView';
// import StylistCard from '../../components/Stylist/StylistCard';

// const StylistsPage = () => {
//   const [viewingPortfolio, setViewingPortfolio] = useState(null);

//   const stylists = [
//     {
//       id: 1,
//       name: 'Emma Johnson',
//       specialty: 'Hair Coloring',
//       experience: '8 years',
//       bio: 'Specializes in balayage and creative color techniques. Certified in Olaplex treatments.',
//       instagram: '@Emma_Johnson',
//       image: '/images/stylist5.jpg'
//     },
//     {
//       id: 2,
//       name: 'Michael Smith',
//       specialty: 'Cutting & Styling',
//       experience: '12 years',
//       bio: 'Master barber with expertise in modern and classic cuts for all hair types.',
//       instagram: '@Michael_Smith',
//       image: '/images/stylist4.jpg' // or 'https://randomuser.me/api/portraits/men/32.jpg'
//     },
//     {
//       id: 3,
//       name: 'Sophia Williams',
//       specialty: 'Bridal & Special Occasion',
//       experience: '6 years',
//       bio: 'Creates elegant updos and styles for weddings and special events.',
//       instagram: '@Sophia_Williams',
//       image: '/images/stylist3.jpg' // or 'https://randomuser.me/api/portraits/women/68.jpg'
//     },
//     {
//       id: 4,
//       name: 'James Brown',
//       specialty: 'Men\'s Grooming',
//       experience: '10 years',
//       bio: 'Expert in traditional wet shaves and modern beard grooming techniques.',
//       instagram: '@James_Brown',
//       image: '/images/stylist1.jpg' // or 'https://randomuser.me/api/portraits/men/75.jpg'
//     }
//   ];

//   return (
//     <div className="min-h-screen bg-gray-900 text-gray-100">
//       <div className="max-w-7xl mx-auto px-4 py-8">
//         <h2 className="text-2xl font-bold mb-8">Our Stylists</h2>

//         <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
//           {stylists.map(stylist => (
//             <StylistCard 
//               key={stylist.id} 
//               stylist={stylist} 
//               onViewPortfolio={() => setViewingPortfolio(stylist)}
//             />
//           ))}
//         </div>

//         {viewingPortfolio && (
//           <PortfolioView 
//             stylist={viewingPortfolio} 
//             onClose={() => setViewingPortfolio(null)} 
//           />
//         )}
//       </div>
//     </div>
//   );
// };

// export default StylistsPage;

import { useEffect, useState } from 'react';
import PortfolioView from '../../components/Stylist/PortfolioView';
import StylistCard from '../../components/Stylist/StylistCard';

const StylistsPage = () => {
  const [stylists, setStylists] = useState([]);
  const [viewingPortfolio, setViewingPortfolio] = useState(null);
  const [loading, setLoading] = useState(true);

  // https://nvsalonbackend.dockyardsoftware.com/api/AdminAuth/staffview
  const STAFF_API_URL = 'https://nvsalonbackend.dockyardsoftware.com/api/AdminAuth/staffview';

  useEffect(() => {

    const fetchStylists = async () => {
      try {
        const response = await fetch(STAFF_API_URL);
        if (!response.ok) throw new Error('Failed to fetch staff data');

        const data = await response.json();

        console.log('Fetched stylists:', data);

        if (!Array.isArray(data.staff)) {
          throw new Error('Unexpected API response');
        }

      // const allowedRoles = ['barber', 'stylist', 'senior stylist'];

      // const filteredStaff = data.staff.filter((staff) =>
      //   allowedRoles.includes(String(staff.Role).toLowerCase())
      // );

        const formattedStylists = data.staff.map((staff) => ({
          name: staff.Name,
          specialty: staff.Role || 'Stylist',
          email: staff.Email || '',
          phone: staff.Phone || '',
          bio: staff.Description || '',
          instagram: '',
          image: `https://nvsalonbackend.dockyardsoftware.com${staff.ImageUrl}`
          // image: staff.ImageUrl
          //   ? `https://saloonbackend.dockyardsoftware.com${staff.ImageUrl}`
          //   : `https://localhost:7014${staff.ImageUrl}`,
          // https://nvsalonbackend.dockyardsoftware.com${staff.ImageUrl}`
        }));

        setStylists(formattedStylists);
      } catch (err) {
        console.error('Error loading stylists:', err.message);
        setStylists([]);
      } finally {
        setLoading(false);
      }
    };

    fetchStylists();
  }, []);

  if (loading) {
    return <div className="p-6 text-white">Loading stylists...</div>;
  }

  return (
    <div className="min-h-screen bg-gray-900 text-gray-100">
      <div className="max-w-7xl mx-auto px-4 py-8">
        <h2 className="text-2xl font-bold mb-8">Our Stylists</h2>

        <div className="grid grid-cols-1 p-8 md:p-0 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {stylists.map((stylist, index) => (
            <StylistCard
              key={index}
              stylist={stylist}
              onViewPortfolio={() => setViewingPortfolio(stylist)}
            />
          ))}
        </div>

        {viewingPortfolio && (
          <PortfolioView
            stylist={viewingPortfolio}
            onClose={() => setViewingPortfolio(null)}
          />
        )}
      </div>
    </div>
  );
};

export default StylistsPage;
