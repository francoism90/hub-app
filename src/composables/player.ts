import { readonly, shallowRef } from 'vue'
import { get, set } from '@vueuse/core'
import shaka from 'shaka-player/dist/shaka-player.ui'
import { logger } from '@/utils'

interface Controls extends shaka.ui.Overlay {
  replay?: any
  forward?: any
}

const player = shallowRef<shaka.Player>()
const ui = shallowRef<Controls>()

export function usePlayer() {
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

        // Remove controls
        set(ui, undefined)
      }

      // Create overlay
      if (typeof ui.value !== 'object') {
        set(ui, new shaka.ui.Overlay(instance, container, element))

        const controls = get(ui) as Controls

        // Create controls
        controls.replay = class extends shaka.ui.Element {
          constructor(parent: HTMLElement, controls: shaka.ui.Controls) {
            super(parent, controls)
            parent.appendChild(replay(element, 10))
          }
        }

        controls.replay.Factory = class {
          create(rootElement: HTMLElement, controls: Controls) {
            if (ui.value) {
              return new ui.value.replay(rootElement, controls)
            }
          }
        }

        controls.forward = class extends shaka.ui.Element {
          constructor(parent: HTMLElement, controls: shaka.ui.Controls) {
            super(parent, controls)
            parent.appendChild(forward(element, 10))
          }
        }

        controls.forward.Factory = class {
          create(rootElement: HTMLElement, controls: Controls) {
            if (ui.value) {
              return new ui.value.forward(rootElement, controls)
            }
          }
        }

        shaka.ui.Controls.registerElement('replay', new controls.replay.Factory())
        shaka.ui.Controls.registerElement('forward', new controls.forward.Factory())

        // Configure UI
        controls.configure({
          addBigPlayButton: false,
          singleClickForPlayAndPause: false,
          keyboardSeekDistance: 10,
          controlPanelElements: [
            'play_pause',
            'replay',
            'forward',
            'time_and_duration',
            'spacer',
            'fullscreen',
            'overflow_menu'
          ],
          seekBarColors: {
            base: 'rgba(255, 255, 255, 0.3)',
            buffered: 'rgba(255, 255, 255, 0.54)',
            played: 'rgba(57, 51, 108, 1)'
          }
        })
      }
    } catch (error: unknown) {
      if (error instanceof shaka.util.Error) {
        return logger.error('Error code', error.code, 'object', error)
      }

      logger.error(error)
    }
  }

  const replay = (video: HTMLMediaElement | null, step: number) => {
    const el = document.createElement('button')

    el.classList.add('material-icons-round', 'shaka-tooltip')
    el.textContent = 'replay_10'

    el.addEventListener('click', () => {
      if (!video?.duration || video?.duration < step) {
        return
      }

      video.currentTime - step < video.duration
        ? (video.currentTime -= step)
        : (video.currentTime = video.duration - step)
    })

    return el
  }

  const forward = (video: HTMLMediaElement | null, step: number) => {
    const el = document.createElement('button')

    el.classList.add('material-icons-round', 'shaka-tooltip')
    el.textContent = 'forward_10'

    el.addEventListener('click', () => {
      if (!video?.duration || video?.duration < step) {
        return
      }

      video.currentTime + step < video.duration
        ? (video.currentTime += step)
        : (video.currentTime = video.duration - step)
    })

    return el
  }

  return {
    initialize,
    player: readonly(player)
  }
}
