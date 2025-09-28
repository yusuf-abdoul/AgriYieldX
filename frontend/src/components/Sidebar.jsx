import { Link, useLocation } from "react-router-dom";

export default function Sidebar({ userType = "farmer" }) {
  const location = useLocation();

  const menuItems = {
    farmer: [
      { path: "/farmer", label: "Dashboard", icon: "🏠" },
      { path: "/farmer/farms", label: "My Farms", icon: "🌾" },
      { path: "/farmer/create", label: "Create Farm", icon: "➕" },
      { path: "/farmer/analytics", label: "Analytics", icon: "📊" }
    ],
    investor: [
      { path: "/investor", label: "Dashboard", icon: "🏠" },
      { path: "/investor/investments", label: "My Investments", icon: "💰" },
      { path: "/investor/browse", label: "Browse Farms", icon: "🔍" },
      { path: "/investor/portfolio", label: "Portfolio", icon: "📈" }
    ],
    buyer: [
      { path: "/buyer", label: "Dashboard", icon: "🏠" },
      { path: "/buyer/orders", label: "My Orders", icon: "📦" },
      { path: "/marketplace", label: "Marketplace", icon: "🛒" },
      { path: "/buyer/favorites", label: "Favorites", icon: "❤️" }
    ]
  };

  const currentItems = menuItems[userType] || menuItems.farmer;

  return (
    <div className="bg-gray-100 dark:bg-gray-900 p-4 w-64 hidden md:block h-full">
      <div className="space-y-2">
        {currentItems.map((item) => {
          const isActive = location.pathname === item.path;
          return (
            <Link
              key={item.path}
              to={item.path}
              className={`flex items-center space-x-3 px-3 py-2 rounded-lg transition-colors ${
                isActive
                  ? "text-blue-600 font-semibold border-l-4 border-blue-600 pl-2 bg-blue-50 dark:bg-blue-900/20"
                  : "text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 hover:bg-gray-200 dark:hover:bg-gray-800"
              }`}
            >
              <span className="text-lg">{item.icon}</span>
              <span className="text-sm font-medium">{item.label}</span>
            </Link>
          );
        })}
      </div>
      
      {/* User Info Section */}
      <div className="mt-8 pt-4 border-t border-gray-200 dark:border-gray-700">
        <div className="text-xs text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-2">
          Account Type
        </div>
        <div className="text-sm font-medium text-gray-900 dark:text-white capitalize">
          {userType}
        </div>
      </div>
    </div>
  );
}
