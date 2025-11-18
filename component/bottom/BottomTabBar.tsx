'use client';

import React from 'react';
import Link from 'next/link';
import {usePathname} from 'next/navigation';
import styles from '@/app/budget/page.module.css';

const BottomTabBar: React.FC = () => {
  const pathname = usePathname();

  const TabButton: React.FC<{ href: string; label: string; icon: string }> = ({ href, label, icon }) => {
    const active = pathname === href;
    return (
      <Link href={href} className={`${styles.navButton} ${active ? styles.navActive : styles.navInactive}`}>
        <span className={styles.navIconText}>{icon}</span>
        <span className={styles.navText}>{label}</span>
      </Link>
    );
  };

  return (
    <nav className={styles.bottomNavBar}>
      <TabButton href="/expense" label="지출" icon="🧾" />
      <TabButton href="/budget" label="예산" icon="🏠" />
      <TabButton href="/mypage" label="마이페이지" icon="👤" />
    </nav>
  );
};

export default BottomTabBar;


