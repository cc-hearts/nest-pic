<script setup lang="ts">
import Headers from '@/components/header/headers.vue'
import Home from '@/layouts/home'
import {
  NConfigProvider,
  NDialogProvider,
  NNotificationProvider,
  darkTheme,
} from 'naive-ui'
import { placement, isDark } from '@/configs'
import Menus from '@/features/components/menu/menu.js'
import { computed } from 'vue'
const theme = computed(() => (isDark.value ? darkTheme : undefined))
</script>

<template>
  <NConfigProvider
    :theme="theme"
    :placement="placement"
    class="flex w-full h-full flex-col"
  >
    <NNotificationProvider>
      <NDialogProvider>
        <Headers>
          <template #left>
            <Menus />
          </template>
        </Headers>
        <Home />
      </NDialogProvider>
    </NNotificationProvider>
  </NConfigProvider>
</template>

<style lang="scss">
* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

body,
html,
#app {
  width: 100%;
  height: 100%;
}
</style>
