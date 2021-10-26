import { App } from '@inertiajs/inertia-react'
import React from 'react'
import { render } from 'react-dom'
import { Inertia } from '@inertiajs/inertia'
import NProgress from 'nprogress'

const el = document.getElementById('app')

let timeout = null

Inertia.on('start', () => {
  timeout = setTimeout(() => NProgress.start(), 250)
})

Inertia.on('progress', (event) => {
  if (NProgress.isStarted() && event.detail.progress.percentage) {
    NProgress.set((event.detail.progress.percentage / 100) * 0.9)
  }
})

Inertia.on('finish', (event) => {
  clearTimeout(timeout)
  if (!NProgress.isStarted()) {
    return
  } else if (event.detail.visit.completed) {
    NProgress.done()
  } else if (event.detail.visit.interrupted) {
    NProgress.set(0)
  } else if (event.detail.visit.cancelled) {
    NProgress.done()
    NProgress.remove()
  }
})

// Inertia.on('start', () => console.log('se comenzo a cargar'))
// Inertia.on('finish', () => console.log('se termino de cargar'))

render(
  <App
    initialPage={JSON.parse(el.dataset.page)}
    resolveComponent={name => require(`./Pages/${name}`).default}
  />,
  el
)