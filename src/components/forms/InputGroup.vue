<script lang="ts" setup>
import { defineProps } from 'vue'

const input = defineModel()
const props = defineProps({
  label: String,
  type: String,
  placeholder: String,
  customClasses: String,
  required: {
    type: Boolean,
    default: false
  }
})
</script>

<template>
  <div :class="props.customClasses">
    <label class="text-gray-600 block pb-1 text-sm font-semibold dark:text-whiten">
      {{ props.label }}
      <span v-if="props.required" class="text-meta-1">*</span>
    </label>
    <input
      v-model="input"
      :type="props.type"
      :placeholder="props.placeholder"
      class="w-full rounded-lg border-[1.5px] border-stroke bg-transparent px-5 py-2 font-normal text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"
    />
  </div>
</template>

<style scoped lang="postcss">
input::-webkit-outer-spin-button,
input::-webkit-inner-spin-button {
  -webkit-appearance: none;
  margin: 0;
}

/* Firefox */
input[type='number'] {
  -moz-appearance: textfield;
}
</style>
