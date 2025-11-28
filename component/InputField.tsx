'use client';

import React, { useState, useEffect } from 'react';
import Image from 'next/image';

interface InputFieldProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label: string;
  description?: string;
  descriptionType?: 'default' | 'success' | 'error';
  type?: 'text' | 'email' | 'password' | 'tel' | 'number';
  showPasswordToggle?: boolean;
  rightButton?: React.ReactNode;
  rightElement?: React.ReactNode;
  maxLength?: number;
  showCharCount?: boolean;
}

export default function InputField({
  label,
  description,
  descriptionType = 'default',
  type = 'text',
  showPasswordToggle = false,
  className = '',
  value,
  rightButton,
  rightElement,
  maxLength,
  showCharCount = false,
  ...props
}: InputFieldProps) {
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);
  const [inputValue, setInputValue] = useState(value || '');
  const hasValue = inputValue !== '';

  // value prop이 변경될 때 내부 state 동기화
  useEffect(() => {
    if (value !== undefined) {
      setInputValue(String(value));
    }
  }, [value]);

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

  // 외부 wrapper 스타일 (input과 버튼을 감싸는 컨테이너)
  const wrapperStyle: React.CSSProperties = {
    width: '100%',
    display: 'flex',
    alignItems: 'stretch',
    gap: rightButton ? '1.2rem' : '0',
  };

  // Input 컨테이너 스타일 (input처럼 보이는 껍데기)
  const containerStyle: React.CSSProperties = {
    flex: 1,
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

      {/* Wrapper: Input과 버튼을 감싸는 컨테이너 */}
      <div style={wrapperStyle}>
        {/* Input Container (외부 껍데기) */}
        <div style={containerStyle} className={className}>
          <input
            {...props}
            type={inputType}
            value={inputValue}
            onChange={handleChange}
            style={inputStyle}
            placeholder={props.placeholder}
            maxLength={maxLength}
          />

          {/* Right Element (예: 문자 수 배지) */}
          {rightElement && (
            <div style={{ display: 'flex', alignItems: 'center' }}>
              {rightElement}
            </div>
          )}

          {/* Character Count Badge */}
          {showCharCount && maxLength && (
            <div
              style={{
                backgroundColor: '#406686',
                color: '#FFFFFF',
                fontSize: '12px',
                fontWeight: 600,
                padding: '0.2rem 0.6rem',
                borderRadius: '0.4rem',
                minWidth: '2.4rem',
                textAlign: 'center',
              }}
            >
              {String(inputValue).length}
            </div>
          )}

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
                src={isPasswordVisible ? '/icons/icon-password-show.svg' : '/icons/icon-password-hide.svg'}
                alt={isPasswordVisible ? '비밀번호 숨기기' : '비밀번호 보기'}
                width={24}
                height={24}
                style={{ width: '24px', height: '24px' }}
              />
            </button>
          )}
        </div>

        {/* Right Button - input 컨테이너 밖에 배치 */}
        {rightButton && (
          <div style={{ display: 'flex', alignItems: 'stretch' }}>
            {rightButton}
          </div>
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

