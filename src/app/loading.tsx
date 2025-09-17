export default function Loading() {
  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="text-center">
        {/* Main Spinner */}
        <div className="relative w-20 h-20 mx-auto mb-6">
          <div className="absolute inset-0 border-4 border-gray-700 rounded-full"></div>
          <div className="absolute inset-0 border-4 border-transparent border-t-red-500 rounded-full animate-spin"></div>
          <div className="absolute inset-2 border-4 border-transparent border-t-yellow-500 rounded-full animate-spin" style={{animationDelay: '75ms'}}></div>
        </div>

        {/* Loading Text */}
        <h2 className="text-xl font-semibold text-white mb-2">Loading ValoClass</h2>
        <p className="text-gray-400">Preparing your Valorant experience...</p>

        {/* Loading Dots */}
        <div className="flex justify-center gap-1 mt-4">
          <div className="w-2 h-2 bg-red-500 rounded-full animate-pulse"></div>
          <div className="w-2 h-2 bg-red-500 rounded-full animate-pulse" style={{animationDelay: '100ms'}}></div>
          <div className="w-2 h-2 bg-red-500 rounded-full animate-pulse" style={{animationDelay: '200ms'}}></div>
        </div>
      </div>
    </div>
  )
}
