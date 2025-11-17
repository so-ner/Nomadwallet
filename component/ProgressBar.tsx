'use client';

import React from 'react';

interface ProgressBarProps {
  totalSteps: number;
  currentStep: number;
  stepsPerRow?: number;
}

export default function ProgressBar({
  totalSteps,
  currentStep,
  stepsPerRow = 3,
}: ProgressBarProps) {
  const steps = Array.from({ length: totalSteps }, (_, i) => i + 1);
  const isActive = (step: number) => step <= currentStep;

  // 원 스타일
  const circleStyle = (active: boolean): React.CSSProperties => ({
    width: '26px',
    height: '26px',
    borderRadius: '50%',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: active ? '#326789' : '#B5E6F3', // Primary-500 : Primary-200
    border: '2px solid #B5E6F3', // Primary-200
    color: active ? '#FFFFFF' : '#326789', // White : Primary-500
    fontSize: '14px',
    fontWeight: 700,
    flexShrink: 0,
  });

  // 그리드로 배치
  const rows: number[][] = [];
  for (let i = 0; i < steps.length; i += stepsPerRow) {
    rows.push(steps.slice(i, i + stepsPerRow));
  }

  return (
    <div
      style={{
        display: 'inline-flex',
        flexDirection: 'column',
        alignItems: 'center',
        gap: '14px',
        padding: '20px',
      }}
    >
      {rows.map((row, rowIndex) => (
        <div
          key={rowIndex}
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '14px',
          }}
        >
          {row.map((step) => (
            <div key={step} style={circleStyle(isActive(step))}>
              {step}
            </div>
          ))}
        </div>
      ))}
    </div>
  );
}

