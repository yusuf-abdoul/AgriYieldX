export default function ListCard({ listing, onBuy }) {
  return (
    <div className="rounded-2xl shadow-md bg-white dark:bg-gray-800 p-4 hover:shadow-lg transition-all transform hover:scale-105">
      <img 
        src={listing.image} 
        alt={listing.name} 
        className="w-full h-48 object-cover rounded-xl mb-4" 
      />
      <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">{listing.name}</h3>
      <div className="mb-4">
        <p className="text-sm text-gray-600 dark:text-gray-300">
          <span className="font-medium">Price:</span> 
          <span className="text-lg font-semibold text-green-600 dark:text-green-400 ml-1">
            {listing.price} hUSDT
          </span>
        </p>
        {listing.seller && (
          <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
            Seller: {listing.seller}
          </p>
        )}
      </div>
      <button
        onClick={() => onBuy(listing)}
        className="w-full bg-green-600 hover:bg-green-700 text-white font-medium rounded-lg px-4 py-2 transition-all"
      >
        Buy Now
      </button>
    </div>
  );
}
