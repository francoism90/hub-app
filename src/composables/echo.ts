import { shallowRef } from 'vue'
import Echo from 'laravel-echo'
import Pusher from 'pusher-js'
import { api } from '@/utils'
import type { PusherChannel } from 'laravel-echo/dist/channel'
import type { UserModel } from '@/interfaces'

const echo = shallowRef<Echo>()

export function useEcho() {
  const initialize = async () => {
    if (typeof echo.value === 'object') {
      await destroy()
    }

    echo.value = new Echo({
      broadcaster: 'pusher',
      key: import.meta.env.VITE_WS_KEY,
      cluster: import.meta.env.VITE_WS_CLUSTER,
      wsHost: import.meta.env.VITE_WS_HOST,
      wsPort: import.meta.env.VITE_WS_PORT,
      wssPort: import.meta.env.VITE_WS_PORT,
      forceTLS: true,
      encrypted: true,
      disableStats: true,
      enabledTransports: ['ws', 'wss'],
      authorizer: (channel: PusherChannel) => ({
        authorize: async (socketId: string, callback: Function) =>
          api
            .post('v1/broadcasting/auth', {
              socket_id: socketId,
              channel_name: channel.name
            })
            .then((response) => callback(null, response.data))
            .catch((error) => callback(error))
      })
    })
  }

  const notifcations = (user: UserModel) =>
    echo.value?.private('user.' + user.id)?.notification((notification: any) => {
      console.log(notification.type)
    })

  const reset = async () => echo.value?.leaveAllChannels()

  const destroy = async () => {
    await echo.value?.leaveAllChannels()
    await echo.value?.disconnect()

    echo.value = undefined
  }

  return {
    Pusher,
    initialize,
    notifcations,
    reset,
    destroy,
    echo
  }
}
