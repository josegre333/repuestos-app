import { defineStore } from 'pinia'

interface CartItem {
  productId: number
  name: string
  price: number
  quantity: number
  image: string | null
  stock: number
}

export const useCartStore = defineStore('cart', {
  state: () => ({
    items: [] as CartItem[],
    isOpen: false,
  }),
  getters: {
    itemCount: (state) => state.items.reduce((sum, i) => sum + i.quantity, 0),
    total: (state) => state.items.reduce((sum, i) => sum + i.price * i.quantity, 0),
  },
  actions: {
    addItem(item: Omit<CartItem, 'quantity'> & { quantity?: number }) {
      const existing = this.items.find((i) => i.productId === item.productId)
      const qty = item.quantity || 1
      if (existing) {
        const newQty = existing.quantity + qty
        existing.quantity = Math.min(newQty, existing.stock)
      } else {
        this.items.push({ ...item, quantity: Math.min(qty, item.stock) })
      }
    },
    removeItem(productId: number) {
      this.items = this.items.filter((i) => i.productId !== productId)
    },
    updateQuantity(productId: number, quantity: number) {
      const item = this.items.find((i) => i.productId === productId)
      if (item) {
        if (quantity <= 0) {
          this.removeItem(productId)
        } else {
          item.quantity = Math.min(quantity, item.stock)
        }
      }
    },
    clearCart() {
      this.items = []
    },
    toggleCart() {
      this.isOpen = !this.isOpen
    },
  },
  persist: true,
})
