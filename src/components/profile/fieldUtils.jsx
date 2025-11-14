export const getInputClassName = (hasError = false) =>
  `mt-1 block w-full rounded-md border shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm ${
    hasError ? 'border-red-500' : 'border-gray-300'
  }`;
