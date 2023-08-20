<template>
  <div class="textarea flex shrink grow">
    <div class="dropdown w-full min-w-full">
      <div class="inline-flex flex-wrap gap-1">
        <button
          v-for="item in state.selected"
          :key="item.id"
          class="btn btn-xs gap-0 normal-case"
          @click="toggle(item)"
        >
          <span>{{ item.name }}</span>
          <close class="h-4 w-4" />
        </button>

        <label
          tabindex="0"
          class="btn btn-accent btn-xs gap-0 normal-case"
        >
          <span>Add</span>
          <add class="h-4 w-4" />
        </label>
      </div>

      <div class="dropdown-content inset-x-0 z-[1] mt-4">
        <form @submit.prevent="submit">
          <input
            v-model.trim="form.filter.query"
            type="search"
            class="input w-full rounded-none border-0 border-b border-gray-300 font-bold"
            autofocus
          >
        </form>

        <ul
          v-if="state.data?.length"
          class="menu max-h-40 flex-nowrap overflow-y-auto bg-base-200"
          tabindex="0"
        >
          <li
            v-for="option in state.data"
            :key="option.id"
          >
            <a @click="toggle(option)">
              {{ option.name }}
            </a>
          </li>
        </ul>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { onBeforeMount, reactive, watch } from 'vue'
import { watchDebounced } from '@vueuse/core'
import { useTagInput } from '@/composables'
import { Add, Close } from '@/assets'
import type { TagModel } from '@/interfaces'

const props = defineProps<{
  modelValue: TagModel[] | null | undefined
}>()

const emit = defineEmits(['update:modelValue'])
const form = reactive({ filter: { query: '' } })

const { initialize, fetch, toggle, state } = useTagInput()
const submit = async () => fetch(form)

onBeforeMount(() => initialize(props.modelValue))
watch(state, () => emit('update:modelValue', state.selected), { deep: true })
watchDebounced(form, () => submit(), { debounce: 350, maxWait: 10000 })
</script>
