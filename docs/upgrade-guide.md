# Upgrade guide for v2.0

You can find the legacy docs for Inertia.js v1.0 at [v1.inertiajs.com](https://v1.inertiajs.com).

## What's new

Inertia.js v2.0 is a huge step forward for Inertia! The core library has been completely rewritten to architecturally support asynchronous requests, enabling a whole set of new features, including:

- [Polling](/polling)
- [Prefetching](/prefetching)
- [Deferred props](/deferred-props)
- [Infinite scrolling](/merging-props)
- [Lazy loading data on scroll](/load-when-visible)

Additionally, for security sensitive projects, Inertia now offers a [history encryption API](/history-encryption), allowing you to clear page data from history state when logging out of an application.

## Upgrade dependencies

To upgrade to the Inertia.js v2.0, first use npm to install the client-side adapter of your choice:

```bash
// framework: vue
npm install @inertiajs/vue3@^2.0
```

```bash
// framework: react
npm install @inertiajs/react@^2.0
```

```bash
// framework: svelte
npm install @inertiajs/svelte@^2.0
```

Next, upgrade the InertiaCore package to use the latest version:

```bash
dotnet add package AspNetCore.InertiaCore
```

## Breaking changes

While a significant release, Inertia.js v2.0 doesn't introduce many breaking changes. Here's a list of all the breaking changes:

### ASP.NET Core version support

InertiaCore supports .NET 6.0 and later versions.

### Dropped Vue 2 support

The Vue 2 adapter has been removed. Vue 2 reached End of Life on December 3, 2023, so this felt like it was time.

### Router `replace` method

The previously deprecated `router.replace` method has been re-instated, but its functionality has changed. It is now used to make [Client Side](/manual-visits#client-side-visits) page visits. To make server-side visits that replace the current history entry in the browser, use the `replace` option:

```js
// framework: vue
router.get("/users", { search: "John" }, { replace: true });
```

```js
// framework: react
router.get("/users", { search: "John" }, { replace: true });
```

```js
// framework: svelte
router.get("/users", { search: "John" }, { replace: true });
```

### Svelte adapter

- Dropped support for Svelte 3 as it reached End of Life on June 20, 2023.
- The `remember` helper has been rename to `useRemember` to be consistent with other helpers.
- Updated `setup` callback in `app.js`. You need to pass `props` when initializing the `App` component. [See setup in app.js](/client-side-setup#initialize-the-inertia-app)
- `setup` callback is now required in `ssr.js`. [See setup in ssr.js](/server-side-rendering#add-server-entry-point)

### Partial reloads are now async

Previously partial reloads in Inertia were synchronous, just like all Inertia requests. In v2.0, partial reloads are now asynchronous. Generally this is desirable, but if you were relying on these requests being synchronous, you may need to adjust your code.
