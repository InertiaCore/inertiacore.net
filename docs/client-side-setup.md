# Client-side setup

Once you have your [server-side framework configured](/server-side-setup), you then need to setup your client-side framework. Inertia currently provides support for React, Vue, and Svelte.

## ASP.NET Core starter templates

ASP.NET Core templates with InertiaCore provide out-of-the-box scaffolding for new Inertia applications. These templates are the fastest way to start building a new Inertia project using ASP.NET Core and Vue or React. However, if you would like to manually install Inertia into your application, please consult the documentation below.

## Install dependencies

First, install the Inertia client-side adapter corresponding to your framework of choice.

```bash
// framework: vue
npm install @inertiajs/vue3
```

```bash
// framework: react
npm install @inertiajs/react
```

```bash
// framework: svelte
npm install @inertiajs/svelte
```

## Initialize the Inertia app

Next, update your main JavaScript file to boot your Inertia app. To accomplish this, we'll initialize the client-side framework with the base Inertia component.

```js
// framework: vue
import { createApp, h } from 'vue'
import { createInertiaApp } from '@inertiajs/vue3'
createInertiaApp({
    resolve: name => {
        const pages = import.meta.glob('./Pages/**/*.vue', { eager: true })
        return pages[\`./Pages/\${name}.vue\`]
    },
    setup({ el, App, props, plugin }) {
        createApp({ render: () => h(App, props) })
            .use(plugin)
            .mount(el)
    },
})
```

```jsx
// framework: react
import { createInertiaApp } from '@inertiajs/react'
import { createRoot } from 'react-dom/client'

createInertiaApp({
    resolve: name => {
        const pages = import.meta.glob('./Pages/**/*.jsx', { eager: true })
        return pages[\`./Pages/\${name}.jsx\`]
    },
    setup({ el, App, props }) {
        createRoot(el).render(<App {...props} />)
    },
})
```

```js
// framework: svelte4
import { createInertiaApp } from '@inertiajs/svelte'

createInertiaApp({
    resolve: name => {
        const pages = import.meta.glob('./Pages/**/*.svelte', { eager: true })
        return pages[\`./Pages/\${name}.svelte\`]
    },
    setup({ el, App, props }) {
        new App({ target: el, props })
    },
})
```

```js
// framework: svelte5
import { createInertiaApp } from '@inertiajs/svelte'
import { mount } from 'svelte'

createInertiaApp({
    resolve: name => {
        const pages = import.meta.glob('./Pages/**/*.svelte', { eager: true })
        return pages[\`./Pages/\${name}.svelte\`]
    },
    setup({ el, App, props }) {
        mount(App, { target: el, props })
    },
})
```

The `setup` callback receives everything necessary to initialize the client-side framework, including the root Inertia `App` component.

## Resolving components

The `resolve` callback tells Inertia how to load a page component. It receives a page name (string), and returns a page component module. How you implement this callback depends on which bundler (Vite or Webpack) you're using.

```js
// framework: vue
// Vite
resolve: name => {
    const pages = import.meta.glob('./Pages/**/*.vue', { eager: true })
    return pages[\`./Pages/\${name}.vue\`]
},
// Webpack
resolve: name => require(\`./Pages/\${name}\`),
```

```js
// framework: react
// Vite
resolve: name => {
    const pages = import.meta.glob('./Pages/**/*.jsx', { eager: true })
    return pages[\`./Pages/\${name}.jsx\`]
},
// Webpack
resolve: name => require(\`./Pages/\${name}\`),
```

```js
// framework: svelte
// Vite
resolve: name => {
    const pages = import.meta.glob('./Pages/**/*.svelte', { eager: true })
    return pages[\`./Pages/\${name}.svelte\`]
},
// Webpack
resolve: name => require(\`./Pages/\${name}.svelte\`),
```

By default we recommend eager loading your components, which will result in a single JavaScript bundle. However, if you'd like to lazy-load your components, see our [code splitting](/code-splitting) documentation.

<!-- TODO: Add this back in once the server-side setup is updated -->
<!-- ## Defining a root element

By default, Inertia assumes that your application's root template has a root element with an `id` of `app`. If your application's root element has a different `id`, you can provide it using the `id` property.

```js
createInertiaApp({
  id: "my-app",
  // ...
});
```

If you change the `id` of the root element, be sure to update it [server-side](/server-side-setup#root-template) as well. -->
