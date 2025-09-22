# Links

To create links to other pages within an Inertia app, you will typically use the Inertia `<Link>`component. This component is a light wrapper around a standard anchor `<Link>` link that intercepts click events and prevents full page reloads. This is [how Inertia provides a single-page app experience](/how-it-works) once your application has been loaded.

## Creating links

To create an Inertia link, use the Inertia `<Link>` component. Any attributes you provide to this component will be proxied to the underlying HTML tag.

```jsx
// framework: vue
import { Link } from "@inertiajs/vue3";
<Link href="/">Home</Link>;
```

```jsx
// framework: react
import { Link } from "@inertiajs/react";
<Link href="/">Home</Link>;
```

```jsx
// framework: svelte
import { inertia, Link } from '@inertiajs/svelte'
<Link href="/" use:inertia>Home</Link>
<Link href="/">Home</Link>
```

By default, Inertia renders links as anchor `<Link>` elements. However, you can change the tag using the `as` prop.

```jsx
// framework: vue
import { Link } from '@inertiajs/vue3'
<Link href="/logout" method="post" as="button">Logout</Link>
// Renders as...
<button type="button">Logout</button>
```

```jsx
// framework: react
import { Link } from '@inertiajs/react'
<Link href="/logout" method="post" as="button">Logout</Link>
// Renders as...
<button type="button">Logout</button>
```

```jsx
// framework: svelte
import { Link } from '@inertiajs/svelte'
<Link href="/logout" method="post" as="button">Logout</Link>
// Renders as...
<button type="button">Logout</button>
```

Creating `POST`/`PUT`/`PATCH`/ `DELETE` anchor `<Link>` links is discouraged as it causes "Open Link in New Tab / Window" accessibility issues. The component automatically renders a{` `} `<button>` element when using these methods.

## Method

You can specify the HTTP request method for an Inertia link request using the `method` prop. The default method used by links is `GET`, but you can use the `method` prop to make `POST`, `PUT`, `PATCH`, and `DELETE` requests via links.

```jsx
// framework: vue
import { Link } from "@inertiajs/vue3";
<Link href="/logout" method="post" as="button">
  Logout
</Link>;
```

```jsx
// framework: react
import { Link } from "@inertiajs/react";
<Link href="/logout" method="post" as="button">
  Logout
</Link>;
```

```jsx
// framework: svelte
import { inertia, Link } from '@inertiajs/svelte'
<button use:inertia={{ href: '/logout', method: 'post' }} type="button">Logout</button>
<Link href="/logout" method="post">Logout</button>
```

<!-- TODO: Add wayfinder -->
<!-- ## Wayfinder

<minimumversion version="2.0.6"></minimumversion>When using [Wayfinder](https://github.com/laravel/wayfinder) in conjunction with the `Link`component, you can simply pass the resulting object directly to the `href` prop. The `Link` will infer the HTTP method and URL directly from the Wayfinder object.

```jsx
// framework: vue
import { Link } from '@inertiajs/vue3'
import { show } from 'App/Http/Controllers/UserController'
<Link :href="show(1)">John Doe</Link>
```

```jsx
// framework: react
import { Link } from "@inertiajs/react";

import { show } from "App/Http/Controllers/UserController";

<Link href={show(1)}>John Doe</Link>;
```

```jsx
// framework: svelte
import { inertia, Link } from '@inertiajs/svelte'
import { show } from 'App/Http/Controllers/UserController'
<button use:inertia={{ href: show(1) }} type="button">John Doe</button>
<Link href={show(1)}>John Doe</button>
``` -->

## Data

When making `POST` or `PUT` requests, you may wish to add additional data to the request. You can accomplish this using the `data` prop. The provided data can be an `object` or `FormData` instance.

```jsx
// framework: vue
import { Link } from '@inertiajs/vue3'
<Link href="/endpoint" method="post" :data="{ foo: bar }">Save</Link>
```

```jsx
// framework: react
import { Link } from "@inertiajs/react";
<Link href="/endpoint" method="post" data={{ foo: bar }}>
  Save
</Link>;
```

```jsx
// framework: svelte
import { inertia, Link } from '@inertiajs/svelte'
<button use:inertia={{ href: '/endpoint', method: 'post', data: { foo: bar } }} type="button">Save</button>
<Link href="/endpoint" method="post" data={{ foo: bar }}>Save</Link>
```

## Custom headers

The `headers` prop allows you to add custom headers to an Inertia link. However, the headers Inertia uses internally to communicate its state to the server take priority and therefore cannot be overwritten.

```jsx
// framework: vue
import { Link } from '@inertiajs/vue3'
<Link href="/endpoint" :headers="{ foo: bar }">Save</Link>
```

```jsx
// framework: react
import { Link } from "@inertiajs/react";
<Link href="/endpoint" headers={{ foo: bar }}>
  Save
</Link>;
```

```jsx
// framework: svelte
import { inertia, Link } from '@inertiajs/svelte'
<button use:inertia={{ href: '/endpoint', headers: { foo: bar } }}>Save</button>
<Link href="/endpoint" headers={{ foo: bar }}>Save</Link>
```

## Browser history

The `replace` prop allows you to specify the browser's history behavior. By default, page visits push (new) state (`window.history.pushState`) into the history; however, it's also possible to replace state (`window.history.replaceState`) by setting the `replace` prop to `true`. This will cause the visit to replace the current history state instead of adding a new history state to the stack.

```jsx
// framework: vue
import { Link } from "@inertiajs/vue3";
<Link href="/" replace>
  Home
</Link>;
```

```jsx
// framework: react
import { Link } from "@inertiajs/react";
<Link replace href="/">
  Home
</Link>;
```

```jsx
// framework: svelte
import { inertia, Link } from '@inertiajs/svelte'
<Link href="/" use:inertia={{ replace: true }}>Home</Link>
<Link href="/" replace>Home</Link>
```

## State preservation

You can preserve a page component's local state using the `preserve-state` prop. This will prevent a page component from fully re-rendering. The `preserve-state` prop is especially helpful on pages that contain forms, since you can avoid manually repopulating input fields and can also maintain a focused input.

```jsx
// framework: vue
import { Link } from '@inertiajs/vue3'
<input v-model="query" type="text" />
<Link href="/search" :data="{ query }" preserve-state>Search</Link>
```

```jsx
// framework: react
import { Link } from '@inertiajs/react'
<input onChange={this.handleChange} value={query} type="text" />
<Link href="/search" data={query} preserveState>Search</Link>
```

```jsx
// framework: svelte
import { inertia, Link } from '@inertiajs/svelte'
<input bind:value={query} type="text" />
<button use:inertia={{ href: '/search', data: { query }, preserveState: true }}>Search</button>
<Link href="/search" data={{ query }} preserveState>Search</Link>
```

## Scroll preservation

You can use the `preserveScroll` prop to prevent Inertia from automatically resetting the scroll position when making a page visit.

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

For more information on managing scroll position, check out the documentation on [scroll management](/scroll-management).

## Partial reloads

The `only` prop allows you to specify that only a subset of a page's props (data) should be retrieved from the server on subsequent visits to that page.

```jsx
// framework: vue
import { Link } from '@inertiajs/vue3'
<Link href="/users?active=true" :only="['users']">Show active</Link>
```

```jsx
// framework: react
import { Link } from "@inertiajs/react";
<Link href="/users?active=true" only={["users"]}>
  Show active
</Link>;
```

```jsx
// framework: svelte
import { inertia, Link } from '@inertiajs/svelte'
<Link href="/users?active=true" use:inertia={{ only: ['users'] }}>Show active</Link>
<Link href="/users?active=true" only={['users']}>Show active</Link>
```

For more information on this topic, check out the complete documentation on [partial reloads](/partial-reloads).

## Active states

It's common to set an active state for navigation links based on the current page. This can be accomplished when using Inertia by inspecting the `page` object and doing string comparisons against the `page.url` and `page.component` properties.

```jsx
// framework: vue
import { Link } from '@inertiajs/vue3'
// URL exact match...
<Link href="/users" :class="{ 'active': $page.url === '/users' }">Users</Link>
// Component exact match...
<Link href="/users" :class="{ 'active': $page.component === 'Users/Index' }">Users</Link>
// URL starts with (/users, /users/create, /users/1, etc.)...
<Link href="/users" :class="{ 'active': $page.url.startsWith('/users') }">Users</Link>
// Component starts with (Users/Index, Users/Create, Users/Show, etc.)...
<Link href="/users" :class="{ 'active': $page.component.startsWith('Users') }">Users</Link>
```

```jsx
// framework: react
import { usePage } from '@inertiajs/react'
const { url, component } = usePage()
// URL exact match...
<Link href="/users" >Users</Link>
// Component exact match...
<Link href="/users" >Users</Link>
// URL starts with (/users, /users/create, /users/1, etc.)...
<Link href="/users" >Users</Link>
// Component starts with (Users/Index, Users/Create, Users/Show, etc.)...
<Link href="/users" >Users</Link>
```

```jsx
// framework: svelte
import { inertia, Link, page } from '@inertiajs/svelte'
// URL exact match...
<Link href="/users" use:inertia class:active={$page.url === '/users'}>Users</Link>
// Component exact match...
<Link href="/users" use:inertia class:active={$page.component === 'Users/Index'}>Users</Link>
// URL starts with (/users, /users/create, /users/1, etc.)...
<Link href="/users" class={$page.url.startsWith('/users') ? 'active' : ''}>Users</Link>
// Component starts with (Users/Index, Users/Create, Users/Show, etc.)...
<Link href="/users" class={$page.component.startsWith('Users') ? 'active' : ''}>Users</Link>
```

You can perform exact match comparisons (`===`), `startsWith()` comparisons (useful for matching a subset of pages), or even more complex comparisons using regular expressions.

Using this approach, you're not limited to just setting class names. You can use this technique to conditionally render any markup on active state, such as different link text or even an SVG icon that represents the link is active.

## Data loading attribute

While a link is making an active request, a `data-loading` attribute is added to the link element. This allows you to style the link while it's in a loading state. The attribute is removed once the request is complete.
