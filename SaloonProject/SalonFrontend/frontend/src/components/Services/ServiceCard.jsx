const ServiceCard = ({ service, isActive, onClick }) => {
  return (
    <div 
      className={`bg-gray-700 rounded-xl p-6 cursor-pointer transition-all ${isActive ? 'border-l-4 border-purple-500 transform scale-105' : 'hover:bg-gray-600'}`}
      onClick={onClick}
    >
      <div className="flex justify-between items-start mb-4">
        <h3 className="text-xl font-semibold">{service.name}</h3>
        <span className="bg-purple-900 text-purple-300 text-sm px-3 py-1 rounded-full">
          {service.price}
        </span>
      </div>
      <p className="text-gray-400 mb-3">Duration: {service.duration}</p>
      <p className="text-gray-300">
        {service.name === 'Haircut' && 'Professional haircut with styling and finishing.'}
        {service.name === 'Coloring' && 'Custom hair coloring with premium products.'}
        {service.name === 'Styling' && 'Special occasion styling and updos.'}
        {service.name === 'Manicure' && 'Luxurious hand care and nail treatment.'}
        {service.name === 'Pedicure' && 'Revitalizing foot care and nail treatment.'}
        {service.name === 'Facial' && 'Rejuvenating skin treatment and relaxation.'}
      </p>
    </div>
  );
};

export default ServiceCard;