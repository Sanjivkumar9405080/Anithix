export const LoadingScreen = () => {
  return (
    <div className="fixed inset-0 z-50 bg-white flex flex-col items-center justify-center">
      <div className="relative flex flex-col items-center">
        {/* Animated Brand Emblem */}
        <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-primary via-[#8B7CFF] to-sky-400 flex items-center justify-center shadow-glow-primary animate-pulse">
          <span className="text-white font-black text-2xl font-heading">A</span>
        </div>
        
        {/* Spinner ring */}
        <div className="mt-6 flex items-center gap-2">
          <div className="w-2 h-2 rounded-full bg-primary animate-bounce" style={{ animationDelay: '0ms' }} />
          <div className="w-2 h-2 rounded-full bg-[#8B7CFF] animate-bounce" style={{ animationDelay: '150ms' }} />
          <div className="w-2 h-2 rounded-full bg-sky-400 animate-bounce" style={{ animationDelay: '300ms' }} />
        </div>

        <span className="mt-4 text-xs font-heading font-extrabold tracking-widest text-text-secondary uppercase">
          ANTHIX
        </span>
      </div>
    </div>
  );
};
