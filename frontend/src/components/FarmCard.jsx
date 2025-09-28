export default function FarmCard({ farm, onInvest }) {
  return (
    <div className="rounded-2xl shadow-md bg-white dark:bg-gray-800 p-4 hover:shadow-lg transition-all transform hover:scale-105">
      <img 
        src={farm.image} 
        alt={farm.metaCID} 
        className="w-full h-48 object-cover rounded-xl mb-4" 
      />
      <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">{farm.name}</h2>
      <div className="space-y-2 mb-4">
        <p className="text-sm text-gray-600 dark:text-gray-300">
          <span className="font-medium">Goal:</span> {farm.fundingGoal} HBAR
        </p>
        <p className="text-sm text-gray-600 dark:text-gray-300">
          <span className="font-medium">Raised:</span> {farm.raised} HBAR
        </p>
        <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
          <div 
            className="bg-blue-600 h-2 rounded-full" 
            style={{ width: `${Math.min((farm.raised / farm.fundingGoal) * 100, 100)}%` }}
          ></div>
        </div>
      </div>
      <button
        onClick={() => onInvest(farm)}
        className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg px-4 py-2 transition-all"
      >
        Invest Now
      </button>
    </div>
  );
}
