import {supabase} from "@/lib/supabaseClient";

/**
 * noti_log 테이블 실시간 구독
 * @param userId 현재 로그인한 사용자 ID
 * @param onNewNoti 새 알림 발생 시 실행할 콜백
 */
export const subscribeToNoti = (userId: string, onNewNoti: (payload: any) => void) => {
  const channel = supabase
    .channel('realtime:noti_log')
    .on(
      'postgres_changes',
      { event: 'INSERT', schema: 'public', table: 'noti_log' },
      payload => {
        // 🔍 유저별 필터링
        if (payload.new.user_id === userId) {
          onNewNoti(payload.new)
        }
      }
    )
    .subscribe()

  return channel
}

/**
 * 구독 해제용
 */
export const unsubscribeNoti = (channel: ReturnType<typeof subscribeToNoti>) => {
  supabase.removeChannel(channel)
}