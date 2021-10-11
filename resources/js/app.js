import { App } from '@inertiajs/inertia-react'
import React from 'react'
import { render } from 'react-dom'
import { Inertia } from '@inertiajs/inertia'

const el = document.getElementById('app')

// Inertia.on('start', () => console.log('se comenzo a cargar'))
// Inertia.on('finish', () => console.log('se termino de cargar'))

render(
  <App
    initialPage={JSON.parse(el.dataset.page)}
    resolveComponent={name => require(`./Pages/${name}`).default}
  />,
  el
)