import Image from 'next/image';

interface LogoProps {
  className?: string;
}

export default function Logo({ className }: LogoProps) {
  return (
    <div
      className={className}
      style={{
        width: '100%',
        height: '13.2rem',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'flex-start',
        paddingTop: '5.7rem',
      }}
    >
      <Image
        src="/icons/logo.svg"
        alt="로고"
        width={154}
        height={35}
        style={{ width: '154px', height: '35px' }}
      />
    </div>
  );
}

