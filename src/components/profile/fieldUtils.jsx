export const getInputClassName = (hasError = false) =>
  `mt-1 block w-full rounded-xl border bg-white/50 backdrop-blur-sm focus:bg-white focus:ring-2 focus:ring-indigo-500/20 transition-all sm:text-sm py-2 px-3 shadow-sm outline-none ${hasError
    ? 'border-red-300 focus:border-red-500 ring-red-200/50'
    : 'border-gray-200 focus:border-indigo-500 text-gray-700 placeholder-gray-400'
  }`;
