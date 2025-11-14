import React from 'react';
import { useFormContext } from 'react-hook-form';
import { getInputClassName } from './fieldUtils';

const SelectField = ({ name, label, options = [], placeholder, rules, ...rest }) => {
  const { register, formState: { errors } } = useFormContext();
  const error = errors?.[name];

  return (
    <div>
      <label htmlFor={name} className="block text-sm font-medium text-gray-700">
        {label}
      </label>
      <select
        id={name}
        className={getInputClassName(!!error)}
        {...register(name, rules)}
        {...rest}
      >
        {placeholder && <option value="">{placeholder}</option>}
        {options.map((opt) => (
          <option key={opt} value={opt}>
            {opt}
          </option>
        ))}
      </select>
      {error && <p className="mt-1 text-sm text-red-600">{error.message}</p>}
    </div>
  );
};

export default SelectField;
