import { ref, watch, onBeforeUnmount, type Ref } from 'vue'

export function useDebounce<T>(source: Ref<T>, delay = 400): Ref<T> {
  const debounced = ref(source.value) as Ref<T>
  let timer: ReturnType<typeof setTimeout>

  watch(source, (val) => {
    clearTimeout(timer)
    timer = setTimeout(() => {
      debounced.value = val
    }, delay)
  })

  onBeforeUnmount(() => clearTimeout(timer))

  return debounced
}
