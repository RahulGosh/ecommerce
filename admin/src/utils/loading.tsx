const LoadingScreen = () => {
  return (
    <div className="flex flex-col items-center justify-center h-screen bg-gradient-to-br from-gray-900 to-gray-800 text-white">
      {/* Animated Logo / Icon */}
      <div className="relative w-20 h-20">
        <div className="absolute inset-0 rounded-full border-4 border-t-transparent border-blue-400 animate-spin"></div>
        <span className="absolute inset-0 flex items-center justify-center font-bold text-lg">
          🚀
        </span>
      </div>

      {/* Loading Text */}
      <p className="mt-6 text-lg font-medium animate-pulse">
        Warming up the app…
      </p>

      {/* Sub-message for Render cold start */}
      <p className="mt-2 text-sm text-gray-400 text-center max-w-xs">
        First load may take up to a minute on free hosting. Hang tight! ⚡
      </p>
    </div>
  );
};

export default LoadingScreen;