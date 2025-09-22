# Scroll management

## Scroll resetting

When navigating between pages, Inertia mimics default browser behavior by automatically resetting the scroll position of the document body (as well as any [scroll regions](#scroll-regions) you've defined) back to the top.

In addition, Inertia keeps track of the scroll position of each page and automatically restores that scroll position as you navigate forward and back in history.

## Scroll preservation

Sometimes it's desirable to prevent the default scroll resetting when making visits. You can disable this behavior by setting the `preserveScroll` option to `true`.

```js
// framework: vue
import { router } from "@inertiajs/vue3";
router.visit(url, { preserveScroll: true });
```

```js
// framework: react
import { router } from "@inertiajs/react";
router.visit(url, { preserveScroll: true });
```

```js
// framework: svelte
import { router } from "@inertiajs/svelte";
router.visit(url, { preserveScroll: true });
```

If you'd like to only preserve the scroll position if the response includes validation errors, set the `preserveScroll` option to "errors".

```js
// framework: vue
import { router } from "@inertiajs/vue3";
router.visit(url, { preserveScroll: "errors" });
```

```js
// framework: react
import { router } from "@inertiajs/react";
router.visit(url, { preserveScroll: "errors" });
```

```js
// framework: svelte
import { router } from "@inertiajs/svelte";
router.visit(url, { preserveScroll: "errors" });
```

You can also lazily evaluate the `preserveScroll` option based on the response by providing a callback.

```js
// framework: vue
import { router } from "@inertiajs/vue3";
router.post("/users", data, {
  preserveScroll: (page) => page.props.someProp === "value",
});
```

```js
// framework: react
import { router } from "@inertiajs/react";
router.post("/users", data, {
  preserveScroll: (page) => page.props.someProp === "value",
});
```

```js
// framework: svelte
import { router } from "@inertiajs/svelte";
router.post("/users", data, {
  preserveScroll: (page) => page.props.someProp === "value",
});
```

When using an [Inertia link](/links), you can preserve the scroll position using the `preserveScroll` prop.

```jsx
// framework: vue
import { Link } from "@inertiajs/vue3";
<Link href="/" preserve-scroll>
  Home
</Link>;
```

```jsx
// framework: react
import { Link } from "@inertiajs/react";
<Link preserveScroll href="/">
  Home
</Link>;
```

```jsx
// framework: svelte
import { inertia, Link } from '@inertiajs/svelte'
<Link href="/" use:inertia={{ preserveScroll: true }}>Home</Link>
<Link href="/" preserveScroll>Home</Link>
```

## Scroll regions

If your app doesn't use document body scrolling, but instead has scrollable elements (using the `overflow` CSS property), scroll resetting will not work.

In these situations, you must tell Inertia which scrollable elements to manage by adding the `scroll-region` attribute to the element.

```html
<div class="overflow-y-auto" scroll-region=""><!-- Your page content --></div>
```
