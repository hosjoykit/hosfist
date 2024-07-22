import { Notyf } from 'notyf'
import 'notyf/notyf.min.css' // for React, Vue and Svelte

export const notyf = new Notyf({
  ripple: false,
  dismissible: true,
  position: {
    x: 'left',
    y: 'bottom'
  },
  types: [
    {
      type: 'warning',
      background: 'orange',
      icon: false,
    },
  ]
})
