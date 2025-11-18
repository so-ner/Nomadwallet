'use client';

import React, { useState } from 'react';
import Button from './Button';

interface ConfirmModalProps {
  title: string;
  message: string;
  confirmText?: string;
  cancelText?: string;
  isVisible: boolean;
  onConfirm: () => void;
  onCancel?: () => void;
}

export default function ConfirmModal({
  title,
  message,
  confirmText = '확인',
  cancelText,
  isVisible,
  onConfirm,
  onCancel,
}: ConfirmModalProps) {
  const [isCancelHovered, setIsCancelHovered] = useState(false);

  if (!isVisible) return null;

  const hasCancel = !!cancelText && !!onCancel;

  return (
    <>
      {/* Backdrop & Modal Container */}
      <div 
        className="fixed inset-0 z-[110] flex items-center justify-center px-5 bg-black bg-opacity-40"
        onClick={onCancel || (() => {})}
      >
        <div
          className="bg-white rounded-[20px] max-w-md w-full shadow-[0_8px_36px_0_rgba(0,0,0,0.16)]"
          onClick={(e) => e.stopPropagation()}
        >
          <div className="px-[24px] pt-[24px] pb-[16px] text-center">
            <h2 className="text-headline-3 text-grayscale-00">{title}</h2>
          </div>
          <div className="px-[24px] py-[8px] text-center">
            <p className="text-body-5 text-grayscale-600 whitespace-pre-line">{message}</p>
          </div>

          {/* Buttons */}
          <div className={`px-[24px] pt-[16px] pb-[24px] bg-white flex ${hasCancel ? 'flex-row gap-3' : 'flex-col'} rounded-b-[20px]`}>
            {hasCancel ? (
              <>
                {/* Cancel Button (왼쪽) */}
                <button
                  type="button"
                  onClick={onCancel}
                  onMouseEnter={() => setIsCancelHovered(true)}
                  onMouseLeave={() => setIsCancelHovered(false)}
                  className={`flex-1 h-[5.6rem] py-[0.6rem] px-[1.6rem] rounded-[1.2rem] border transition-colors flex items-center justify-center font-bold cursor-pointer ${
                    isCancelHovered
                      ? 'bg-status-input'
                      : 'bg-white'
                  } text-grayscale-600`}
                  style={{
                    borderColor: '#E0E0E0',
                    fontSize: '16px',
                  }}
                >
                  {cancelText}
                </button>
                {/* Confirm Button (오른쪽) */}
                <Button
                  type="button"
                  variant="default"
                  onClick={onConfirm}
                  className="flex-1"
                  style={{
                    height: '5.6rem',
                    borderRadius: '1.2rem',
                    padding: '0.6rem 1.6rem',
                    backgroundColor: '#406686',
                    color: '#FFFFFF',
                  }}
                >
                  {confirmText}
                </Button>
              </>
            ) : (
              <Button
                type="button"
                variant="default"
                onClick={onConfirm}
                className="w-full"
                style={{
                  height: '5.6rem',
                  borderRadius: '1.2rem',
                  padding: '0.6rem 1.6rem',
                  backgroundColor: '#406686',
                  color: '#FFFFFF',
                }}
              >
                {confirmText}
              </Button>
            )}
          </div>
        </div>
      </div>
    </>
  );
}

