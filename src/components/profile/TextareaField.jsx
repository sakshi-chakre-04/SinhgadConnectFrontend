import React from 'react';
import { useFormContext } from 'react-hook-form';
import { getInputClassName } from './fieldUtils';

const TextareaField = ({ name, label, rules, hint, rows = 3, ...rest }) => {
  const { register, formState: { errors } } = useFormContext();
  const error = errors?.[name];

  return (
    <div>
      <label htmlFor={name} className="block text-sm font-medium text-gray-700">
        {label}
      </label>
      <textarea
        id={name}
        rows={rows}
        className={getInputClassName(!!error)}
        {...register(name, rules)}
        {...rest}
      />
      {hint && <p className="mt-2 text-sm text-gray-500">{hint}</p>}
      {error && <p className="mt-1 text-sm text-red-600">{error.message}</p>}
    </div>
  );
};

export default TextareaField;
