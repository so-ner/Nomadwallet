'use client';

import React, { useState } from 'react';

type ProfileState = 'basic' | 'upload';

async function changeProfile({
  from,
  to,
  file,
  currentKey,
}: {
  from: ProfileState;
  to: ProfileState;
  file?: File;
  currentKey?: string;
}) {
  if (from === 'basic' && to === 'upload') {
    // 기본 → 업로드
    if (!file) throw new Error('파일이 필요합니다.');

    const formData = new FormData();
    formData.append('file', file);

    // R2 업로드
    const uploadRes= await fetch('/api/storage/upload', {
      method: 'POST',
      body: formData
    }).then((r) => r.json());

    const newKey = uploadRes.key;
    if (!newKey) throw new Error("업로드 실패");

    // Supabase에 url 저장
    const response = await fetch('/api/storage/save', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ key: newKey, isBasic: false }),
    });

    return response.json();
  } else if (from === 'upload' && to === 'basic') {
    if (!currentKey) throw new Error("현재 키가 필요합니다.");
    const randomBasic = Math.floor(Math.random() * 2) + 1; // 1 또는 2
    const newBasicKey = `${randomBasic}.jpg`;

    // 업로드 → 기본 (랜덤하게)
    await fetch('/api/storage/delete', {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          old_key: currentKey,
          new_key: newBasicKey,
          new_is_basic: true,
          type: "PROFILE_REPLACE",
        }),
      });

    const response = await fetch('/api/storage/save', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ key: newBasicKey, isBasic: true }),
    });

    return response.json();
  } else if (from === 'upload' && to === 'upload') {
    // 업로드 → 업로드
    if (!file) throw new Error('파일이 필요합니다.');
    if (!currentKey) throw new Error('현재 키가 필요합니다.');

    const formData = new FormData();
    formData.append('file', file);

    // R2 업로드
    const uploadRes = await fetch('/api/storage/upload', {
      method: 'POST',
      body: formData
    }).then((r) => r.json());

    const newKey = uploadRes.key;
    if (!newKey) throw new Error("업로드 실패");

    // Supabase에 url 업데이트
    const response = await fetch('/api/storage/save', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ key: newKey, isBasic: false }),
    });

    // MQ에 삭제 요청
    await fetch('/api/storage/delete', {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        old_key: currentKey,
        new_key: newKey,
        new_is_basic: false,
        type: "PROFILE_REPLACE",
      }),
    });

    return response.json();
  }
}

export default function ImageTestPage() {
  const [from, setFrom] = useState<ProfileState>('basic');
  const [to, setTo] = useState<ProfileState>('basic');
  const [file, setFile] = useState<File | null>(null);
  const [currentKey, setCurrentKey] = useState<string>('');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<string>('');
  const [error, setError] = useState<string>('');

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0]);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setResult('');

    try {
      const response = await changeProfile({
        from,
        to,
        file: file || undefined,
        currentKey: currentKey || undefined,
      });
      setResult(JSON.stringify(response, null, 2));
      
      // 성공 후 응답에서 imageUrl을 가져와서 상태 업데이트
      if (response?.imageUrl) {
        if (response.imageUrl.startsWith('basic/')) {
          setFrom('basic');
          setCurrentKey('');
        } else {
          setFrom('upload');
          const urlParts = response.imageUrl.split('?')[0];
          setCurrentKey(urlParts);
        }
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : '알 수 없는 오류가 발생했습니다.');
    } finally {
      setLoading(false);
    }
  };

  const needsFile = to === 'upload';
  const needsCurrentKey = from === 'upload';

  return (
    <div style={{ padding: '20px' }}>
      <h1>이미지 업로드 테스트</h1>

      <form onSubmit={handleSubmit} style={{ marginTop: '20px' }}>
        <div style={{ marginBottom: '15px' }}>
          <label htmlFor="from">현재 상태</label>
          <br />
          <select
            id="from"
            value={from}
            onChange={(e) => {
              const newFrom = e.target.value as ProfileState;
              setFrom(newFrom);
              if (newFrom === 'basic') {
                setCurrentKey('');
              }
            }}
            style={{ marginTop: '5px', padding: '5px', width: '200px' }}
          >
            <option value="basic">기본</option>
            <option value="upload">업로드</option>
          </select>
        </div>

        <div style={{ marginBottom: '15px' }}>
          <label htmlFor="to">목표 상태</label>
          <br />
          <select
            id="to"
            value={to}
            onChange={(e) => setTo(e.target.value as ProfileState)}
            style={{ marginTop: '5px', padding: '5px', width: '200px' }}
          >
            <option value="basic">기본</option>
            <option value="upload">업로드</option>
          </select>
        </div>

        {needsFile && (
          <div style={{ marginBottom: '15px' }}>
            <label htmlFor="file">이미지 파일</label>
            <br />
            <input
              id="file"
              type="file"
              accept="image/jpeg,image/jpg,image/png"
              onChange={handleFileChange}
              style={{ marginTop: '5px' }}
              required
            />
            {file && (
              <p style={{ fontSize: '12px', color: '#666', marginTop: '5px' }}>
                선택된 파일: {file.name} ({(file.size / 1024).toFixed(2)} KB)
              </p>
            )}
          </div>
        )}

        {needsCurrentKey && (
          <div style={{ marginBottom: '15px' }}>
            <label htmlFor="currentKey">현재 키 (예: profile/123.jpg)</label>
            <br />
            <input
              id="currentKey"
              type="text"
              value={currentKey}
              onChange={(e) => setCurrentKey(e.target.value)}
              placeholder="profile/123.jpg"
              style={{ marginTop: '5px', padding: '5px', width: '300px' }}
              required={needsCurrentKey}
            />
          </div>
        )}

        <div style={{ marginBottom: '15px', padding: '10px', backgroundColor: '#f5f5f5' }}>
          <span>현재 케이스: </span>
          <strong>
            {from === 'basic' && to === 'upload' && '기본 → 업로드'}
            {from === 'upload' && to === 'basic' && '업로드 → 기본 (랜덤)'}
            {from === 'upload' && to === 'upload' && '업로드 → 업로드'}
          </strong>
        </div>

        <button
          type="submit"
          disabled={loading || (needsFile && !file) || (needsCurrentKey && !currentKey)}
          style={{
            padding: '10px 20px',
            backgroundColor: loading ? '#ccc' : '#4f46e5',
            color: 'white',
            border: 'none',
            cursor: loading ? 'not-allowed' : 'pointer',
          }}
        >
          {loading ? '처리 중...' : '변경하기'}
        </button>
      </form>

      {error && (
        <div style={{ marginTop: '20px', padding: '10px', backgroundColor: '#fee', border: '1px solid #fcc' }}>
          <h3>오류</h3>
          <pre style={{ whiteSpace: 'pre-wrap' }}>{error}</pre>
        </div>
      )}

      {result && (
        <div style={{ marginTop: '20px', padding: '10px', backgroundColor: '#efe', border: '1px solid #cfc' }}>
          <h3>결과</h3>
          <pre style={{ whiteSpace: 'pre-wrap' }}>{result}</pre>
        </div>
      )}
    </div>
  );
}
