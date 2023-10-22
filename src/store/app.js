// Utilities
import { defineStore } from 'pinia'

export const useAppStore = defineStore('app', {
  state: () => ({
    tableId: null,
    apiUser: null,
    apiKey: null,
    senderName: null,
    senderAddress: null,
    to: null,
    subject: null,
    content: null
  }),
})
