'use client';

import React, {useState, ChangeEvent} from 'react';
import styles from './TextField.module.css';

interface TextFieldProps {
  id: string;
  label: string;
  type?: 'text' | 'password' | 'email';
  placeholder?: string;
  required?: boolean;
}

const TextField: React.FC<TextFieldProps> = ({
                                               id,
                                               label,
                                               type = 'text',
                                               placeholder,
                                               required = false
                                             }) => {
  const [value, setValue] = useState('');

  const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
    setValue(event.target.value);
  };

  return (
    <div className={styles.container}>
      <label htmlFor={id} className={styles.label}>
        {label}
      </label>
      <input
        id={id}
        name={id}
        type={type}
        placeholder={placeholder}
        value={value}
        onChange={handleChange}
        className={styles.input}
        required={required}
      />
    </div>
  );
};

export default TextField;
