import { readonly, shallowRef } from 'vue'
import { get, set } from '@vueuse/core'
import { logger } from '@/utils'
import shaka from 'shaka-player/dist/shaka-player.ui'

const player = shallowRef<shaka.Player>()

export function useShaka() {
  const initialize = async (
    container: HTMLElement | null,
    element: HTMLMediaElement | null,
    source: string | undefined
  ) => {
    if (!shaka.Player.isBrowserSupported()) {
      return console.error('Browser not supported')
    }

    if (!container || !element || !source) {
      return logger.error('Invalid arguments given')
    }

    try {
      if (typeof player.value !== 'object') {
        set(player, new shaka.Player())
      }

      const instance = get(player) as shaka.Player

      // Set video container
      instance.setVideoContainer(container)

      // Configure settings
      instance.configure({
        preferredAudioLanguage: 'en',
        preferredTextLanguage: 'en',
        streaming: {
          ignoreTextStreamFailures: true,
          alwaysStreamText: true
        }
      })

      // Configure NetworkEngine
      instance
        ?.getNetworkingEngine()
        ?.registerRequestFilter(async (type, request) => (request.allowCrossSiteCredentials = true))

      // Reset on change
      if (element !== instance.getMediaElement() || source !== instance.getAssetUri()) {
        // Unload souce
        await instance.detach()
        await instance.attach(element)

        // Load source
        await instance.load(source)
      }
    } catch (error: unknown) {
      if (error instanceof shaka.util.Error) {
        return logger.error('Error code', error.code, 'object', error)
      }

      logger.error(error)
    }
  }

  return {
    initialize,
    player: readonly(player)
  }
}
