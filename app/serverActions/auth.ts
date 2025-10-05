// 'use server'
//
// import { signIn, signOut, auth, update } from '@/app/auth'
// import { redirect } from 'next/navigation'
//
// // 로그인/회원가입
// export const signInWithCredentials = async (
//   _prevState: { message: string },
//   formData: FormData
// ) => {
//   try {
//     console.log('signIn 호출 직전')
//     await signIn('credentials', {
//       displayName: formData.get('displayName') || '',
//       email: formData.get('email') || '',
//       password: formData.get('password') || '',
//       redirectTo: '/',
//     })
//     console.log('signIn 호출 후')
//   } catch (error: any) {
//     return {message: error.cause?.err?.message || '로그인/회원가입 실패'}
//   }
//
//   redirect('/')
// }
//
// // 일반 로그인
// // export const signInWithCredentials = async (
// //     _prevState: { message: string },
// //     formData: FormData
// // ) => {
// //     try {
// //         await signIn('credentials', {
// //             email: formData.get('email'),
// //             password: formData.get('password'),
// //         })
// //         redirect('/') // 성공 시 메인 페이지로 이동
// //     } catch (error: any) {
// //         return { message: error?.message || '로그인에 실패했습니다.' }
// //     }
// // }
//
// // sns 로그인
// export const signInWithGoogle = async () => {
//   await signIn('google', {redirectTo: '/'})
// }
//
// // 로그아웃
// export const signOutWithForm = async (formData: FormData) => {
//   await signOut()
// }
//
// // 세션 갱신
// export const updateSession = async (data: any) => {
//   return await update(data)
// }