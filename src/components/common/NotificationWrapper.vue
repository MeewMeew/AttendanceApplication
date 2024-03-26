<script setup lang="ts">
import { Notification, NotificationGroup } from 'notiwind'

import IconComponent from '@/components/icons/IconComponent.vue'
</script>

<template>
  <NotificationGroup group="app" position="bottom">
    <div
      class="pointer-events-none fixed inset-x-0 bottom-0 flex items-start justify-end p-6 px-4 py-6"
    >
      <div class="w-full max-w-sm">
        <Notification
          v-slot="{ notifications, close }"
          enter="ease-out duration-300 transition"
          enter-from="translate-y-2 opacity-0 sm:translate-y-0 sm:translate-x-4"
          enter-to="translate-y-0 opacity-100 sm:translate-x-0"
          leave="transition ease-in duration-500"
          leave-from="opacity-100"
          leave-to="opacity-0"
          move="transition duration-500"
          move-delay="delay-300"
        >
          <div
            v-for="notification in notifications"
            :key="notification.id"
            class="pointer-events-auto mt-4 w-full max-w-sm overflow-hidden rounded-lg bg-white shadow-lg ring-1 ring-black ring-opacity-5 dark:bg-black"
          >
            <div class="p-4">
              <div class="flex items-center justify-center">
                <div class="shrink-0">
                  <div
                    v-if="notification.type === 'error'"
                    class="inline-flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-lg bg-red-100 text-danger dark:bg-red-800 dark:text-red-200"
                  >
                    <svg
                      class="h-5 w-5"
                      aria-hidden="true"
                      xmlns="http://www.w3.org/2000/svg"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path
                        d="M10 .5a9.5 9.5 0 1 0 9.5 9.5A9.51 9.51 0 0 0 10 .5Zm3.707 11.793a1 1 0 1 1-1.414 1.414L10 11.414l-2.293 2.293a1 1 0 0 1-1.414-1.414L8.586 10 6.293 7.707a1 1 0 0 1 1.414-1.414L10 8.586l2.293-2.293a1 1 0 0 1 1.414 1.414L11.414 10l2.293 2.293Z"
                      />
                    </svg>
                    <span class="sr-only">Error icon</span>
                  </div>
                  <div
                    v-else-if="notification.type === 'warning'"
                    class="inline-flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-lg bg-orange-100 text-orange-500 dark:bg-orange-700 dark:text-orange-200"
                  >
                    <svg
                      class="h-5 w-5"
                      aria-hidden="true"
                      xmlns="http://www.w3.org/2000/svg"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path
                        d="M10 .5a9.5 9.5 0 1 0 9.5 9.5A9.51 9.51 0 0 0 10 .5ZM10 15a1 1 0 1 1 0-2 1 1 0 0 1 0 2Zm1-4a1 1 0 0 1-2 0V6a1 1 0 0 1 2 0v5Z"
                      />
                    </svg>
                    <span class="sr-only">Warning icon</span>
                  </div>
                  <div
                    v-else-if="notification.type === 'loading'"
                    class="inline-flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-lg bg-orange-100 text-orange-500 dark:bg-orange-700 dark:text-orange-200"
                  >
                    <icon-component name="Loader2" stroke-width="2" class="animate-spin" />
                    <span class="sr-only">Loading icon</span>
                  </div>
                  <div
                    v-else
                    class="inline-flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-lg bg-green-100 text-green-400 dark:bg-green-800 dark:text-green-200"
                  >
                    <svg
                      class="h-5 w-5"
                      aria-hidden="true"
                      xmlns="http://www.w3.org/2000/svg"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path
                        d="M10 .5a9.5 9.5 0 1 0 9.5 9.5A9.51 9.51 0 0 0 10 .5Zm3.707 8.207-4 4a1 1 0 0 1-1.414 0l-2-2a1 1 0 0 1 1.414-1.414L9 10.586l3.293-3.293a1 1 0 0 1 1.414 1.414Z"
                      />
                    </svg>
                    <span class="sr-only">Check icon</span>
                  </div>
                </div>
                <div class="ml-3 w-0 flex-1 pt-0.5">
                  <p class="font-semibold text-neutral-900 dark:text-neutral-200">
                    {{ notification.title }}
                  </p>
                  <p class="text-sm font-semibold text-neutral-600 dark:text-neutral-200">
                    {{ notification.text }}
                  </p>
                </div>
                <div class="ml-4 flex shrink-0">
                  <button
                    class="text-gray-400 hover:text-gray-500 focus:ring-gray-400 inline-flex rounded-md bg-white focus:outline-none focus:ring-2 focus:ring-offset-2"
                    @click="close(notification.id)"
                  >
                    <span class="sr-only">Close</span>
                    <icon-component
                      name="X"
                      class="bg-white text-black dark:bg-black dark:text-white"
                      stroke-width="2px"
                    />
                  </button>
                </div>
              </div>
            </div>
          </div>
        </Notification>
      </div>
    </div>
  </NotificationGroup>
</template>

<style scoped></style>
