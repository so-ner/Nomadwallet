import Image from 'next/image';
import LoginForm from './_component/LoginForm';
import SocialLoginSection from './_component/SocialLoginSection';

export default function LoginPage() {
  return (
    <div className="flex flex-col items-center min-h-screen w-full bg-white">
      <div className="w-full h-[13.2rem] flex justify-center items-start pt-[5.7rem]">
        <Image
          src="/icons/logo.svg"
          alt="로고"
          width={154}
          height={35}
        />
      </div>
      <LoginForm />
      <SocialLoginSection />
    </div>
  );
}
