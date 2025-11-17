'use client';

import React, { useState } from 'react';
import Image from 'next/image';

interface InputFieldProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label: string;
  description?: string;
  descriptionType?: 'default' | 'success' | 'error';
  type?: 'text' | 'email' | 'password' | 'tel' | 'number';
  showPasswordToggle?: boolean;
}

export default function InputField({
  label,
  description,
  descriptionType = 'default',
  type = 'text',
  showPasswordToggle = false,
  className = '',
  value,
  ...props
}: InputFieldProps) {
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);
  const [inputValue, setInputValue] = useState(value || '');
  const hasValue = inputValue !== '';

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInputValue(e.target.value);
    props.onChange?.(e);
  };

  const getDescriptionColor = () => {
    switch (descriptionType) {
      case 'success':
        return '#60BA63'; // status.success
      case 'error':
        return '#EB4F49'; // status.spend
      default:
        return '#757575'; // grayscale-600
    }
  };

  const inputType = type === 'password' && isPasswordVisible ? 'text' : type;

  // 외부 컨테이너 스타일 (input처럼 보이는 껍데기)
  const containerStyle: React.CSSProperties = {
    width: '100%',
    height: '5.4rem',
    display: 'flex',
    alignItems: 'center',
    padding: '1.6rem 2rem',
    gap: '1rem',
    borderRadius: '1.2rem',
    backgroundColor: '#F4F5FA', // status.input
  };

  // 내부 input 스타일
  const inputStyle: React.CSSProperties = {
    flex: 1,
    height: '100%',
    fontSize: '14px',
    lineHeight: '16px',
    fontWeight: 600,
    color: hasValue ? '#212121' : '#9E9E9E', // grayscale-900 : grayscale-500
    outline: 'none',
    border: 'none',
    background: 'transparent',
    padding: 0,
  };

  return (
    <div className="flex flex-col">
      {/* Label - Caption1: 14px, Semi-bold, 16px line-height */}
      <label style={{ fontSize: '14px', lineHeight: '16px', fontWeight: 600, marginBottom: '1.6rem' }}>
        {label}
      </label>

      {/* Input Container (외부 껍데기) */}
      <div style={containerStyle} className={className}>
        <input
          {...props}
          type={inputType}
          value={inputValue}
          onChange={handleChange}
          style={inputStyle}
          placeholder={props.placeholder}
        />

        {/* Password Toggle Icon */}
        {showPasswordToggle && type === 'password' && (
          <button
            type="button"
            onClick={() => setIsPasswordVisible(!isPasswordVisible)}
            style={{
              cursor: 'pointer',
              background: 'none',
              border: 'none',
              padding: 0,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              width: '24px',
              height: '24px',
            }}
            aria-label={isPasswordVisible ? '비밀번호 숨기기' : '비밀번호 보기'}
          >
            <Image
              src="/icons/icon-password-hide.svg"
              alt={isPasswordVisible ? '비밀번호 숨기기' : '비밀번호 보기'}
              width={24}
              height={24}
              style={{ width: '24px', height: '24px' }}
            />
          </button>
        )}
      </div>

      {/* Description - Caption1: 14px, Semi-bold, 16px line-height */}
      {description && (
        <p style={{
          fontSize: '14px',
          lineHeight: '16px',
          fontWeight: 600,
          marginTop: '0.8rem',
          color: getDescriptionColor(),
        }}>
          {description}
        </p>
      )}
    </div>
  );
}

