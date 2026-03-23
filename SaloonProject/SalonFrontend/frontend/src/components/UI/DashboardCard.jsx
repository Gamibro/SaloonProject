const DashboardCard = ({ icon, title, value, change, color }) => {
  const colorClasses = {
    purple: 'bg-purple-900 bg-opacity-30 text-purple-400',
    blue: 'bg-blue-900 bg-opacity-30 text-blue-400',
    green: 'bg-green-900 bg-opacity-30 text-green-400',
    yellow: 'bg-yellow-900 bg-opacity-30 text-yellow-400'
  };

  return (
    <div className="bg-gray-800 rounded-xl p-6 border border-gray-700 hover:border-purple-500 transition">
      <div className={`w-12 h-12 rounded-full ${colorClasses[color]} flex items-center justify-center mb-4`}>
        {icon}
      </div>
      <h3 className="text-gray-400 text-sm mb-1">{title}</h3>
      <p className="text-2xl font-bold mb-2">{value}</p>
      <p className="text-xs text-gray-500">{change}</p>
    </div>
  );
};

export default DashboardCard;