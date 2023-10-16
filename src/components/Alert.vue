<template>
    <div
      v-if="show"
      class="alert"
      :style="{
        backgroundColor: backgroundColor,
      }"
    >
      <div class="message">{{ message }}</div>
      <div class="close-alert" @click="$emit('close')">&times;</div>
    </div>
  </template>
  
  <script setup>
  import { useBackgroundColor } from "../composables/useBackgroundColor";
  const props = defineProps({
    message: {
      required: true,
      type: String,
    },
    show: {
      required: true,
      type: Boolean,
    },
    type: {
      required: false,
      default: "danger",
      validator(value) {
        return ["danger", "warning", "info"].includes(value);
      },
    },
  });
  
  const backgroundColor = useBackgroundColor(props);
  const emit = defineEmits(["close"]);
  </script>
  
  <style scoped>
  .alert {
    display: flex;
    justify-content: space-between;
    align-items: center;
    background: var(--danger-color);
    margin-bottom: 20px;
    padding: 20px;
    border-radius: 10px;
    height: 100px;
  }
  
  .message{
    background: none ;
    font-size: 1.1em;
  }

  .close-alert {
    font-size: 50px;
    cursor: pointer;
    background: none;
    margin-bottom: 10px;
  }
  </style>