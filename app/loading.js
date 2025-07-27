export default function Loading() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 flex items-center justify-center">
      <div className="text-center">
        {/* Loading Animation */}
        <div className="flex justify-center mb-8">
          <div className="relative">
            {/* Main spinner */}
            <div className="w-20 h-20 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin"></div>
            
            {/* Inner spinner */}
            <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-12 h-12 border-4 border-purple-200 border-t-purple-600 rounded-full animate-spin animate-reverse"></div>
            
            {/* Center dot */}
            <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-4 h-4 bg-gradient-to-r from-blue-600 to-purple-600 rounded-full animate-pulse"></div>
          </div>
        </div>

        {/* Loading Text */}
        <div className="space-y-4">
          <h2 className="text-2xl font-bold text-gray-800">
            กำลังโหลด...
          </h2>
          
          <div className="flex justify-center items-center space-x-1">
            <div className="w-2 h-2 bg-blue-600 rounded-full animate-bounce"></div>
            <div className="w-2 h-2 bg-purple-600 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
            <div className="w-2 h-2 bg-red-600 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
          </div>
          
          <p className="text-gray-600 text-lg">
            โปรดรอสักครู่...
          </p>
        </div>

        {/* Additional Visual Elements */}
        <div className="mt-8 flex justify-center space-x-4">
          <div className="w-8 h-8 bg-blue-200 rounded-full animate-pulse"></div>
          <div className="w-6 h-6 bg-purple-200 rounded-full animate-pulse" style={{ animationDelay: '0.5s' }}></div>
          <div className="w-4 h-4 bg-red-200 rounded-full animate-pulse" style={{ animationDelay: '1s' }}></div>
        </div>
      </div>
    </div>
  );
}
