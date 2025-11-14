import React from 'react';

const FormField = ({ 
  id, 
  label, 
  type = 'text', 
  required = false, 
  error, 
  register, 
  validation,
  placeholder,
  rows
}) => {
  const fieldClassName = `w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 ${
    error ? 'border-red-500' : 'border-gray-300'
  }`;

  const Element = type === 'textarea' ? 'textarea' : 'input';

  return (
    <div>
      <label htmlFor={id} className="block text-sm font-medium text-gray-700 mb-2">
        {label} {required && '*'}
      </label>
      <Element
        id={id}
        type={type === 'textarea' ? undefined : type}
        {...register(id, validation)}
        placeholder={placeholder}
        rows={type === 'textarea' ? rows : undefined}
        className={fieldClassName}
        aria-invalid={error ? 'true' : 'false'}
      />
      {error && (
        <p className="mt-1 text-sm text-red-600">{error.message}</p>
      )}
    </div>
  );
};

export default FormField;
