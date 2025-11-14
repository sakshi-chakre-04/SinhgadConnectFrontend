import React from 'react';
import { useFormContext } from 'react-hook-form';
import { getInputClassName } from './fieldUtils';

const InputField = ({ name, label, type = 'text', rules, ...rest }) => {
  const { register, formState: { errors } } = useFormContext();
  const error = errors?.[name];

  return (
    <div>
      <label htmlFor={name} className="block text-sm font-medium text-gray-700">
        {label}
      </label>
      <input
        id={name}
        type={type}
        className={getInputClassName(!!error)}
        {...register(name, rules)}
        {...rest}
      />
      {error && <p className="mt-1 text-sm text-red-600">{error.message}</p>}
    </div>
  );
};

export default InputField;
