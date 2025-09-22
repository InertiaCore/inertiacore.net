# Partial reloads

When making visits to the same page you are already on, it's not always necessary to re-fetch all of the page's data from the server. In fact, selecting only a subset of the data can be a helpful performance optimization if it's acceptable that some page data becomes stale. Inertia makes this possible via its "partial reload" feature.

As an example, consider a "user index" page that includes a list of users, as well as an option to filter the users by their company. On the first request to the page, both the `users` and `companies`props are passed to the page component. However, on subsequent visits to the same page (maybe to filter the users), you can request only the `users` data from the server without requesting the `companies` data. Inertia will then automatically merge the partial data returned from the server with the data it already has in memory client-side.

Partial reloads only work for visits made to the same page component.

## Only certain props

To perform a partial reload, use the `only` visit option to specify which data the server should return. This option should be an array of keys which correspond to the keys of the props.

```js
// framework: vue
import { router } from "@inertiajs/vue3";
router.visit(url, {
  only: ["users"],
});
```

```js
// framework: react
import { router } from "@inertiajs/react";
router.visit(url, {
  only: ["users"],
});
```

```js
// framework: svelte
import { router } from "@inertiajs/svelte";
router.visit(url, {
  only: ["users"],
});
```

## Except certain props

In addition to the `only` visit option you can also use the `except` option to specify which data the server should exclude. This option should also be an array of keys which correspond to the keys of the props.

```js
// framework: vue
import { router } from "@inertiajs/vue3";
router.visit(url, {
  except: ["users"],
});
```

```js
// framework: react
import { router } from "@inertiajs/react";
router.visit(url, {
  except: ["users"],
});
```

```js
// framework: svelte
import { router } from "@inertiajs/svelte";
router.visit(url, {
  except: ["users"],
});
```

## Router shorthand

Since partial reloads can only be made to the same page component the user is already on, it almost always makes sense to just use the `router.reload()` method, which automatically uses the current URL.

```js
// framework: vue
import { router } from "@inertiajs/vue3";
router.reload({ only: ["users"] });
```

```js
// framework: react
import { router } from "@inertiajs/react";
router.reload({ only: ["users"] });
```

```js
// framework: svelte
import { router } from "@inertiajs/svelte";
router.reload({ only: ["users"] });
```

## Using links

It's also possible to perform partial reloads with Inertia links using the `only` property.

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

## Lazy data evaluation

For partial reloads to be most effective, be sure to also use lazy data evaluation when returning props from your server-side routes or controllers. This can be accomplished by wrapping all optional page data in a closure.

```csharp
return Inertia.Render("Users/Index", new
{
    users = new Func<object>(() => userService.GetAll()),
    companies = new Func<object>(() => companyService.GetAll())
});
```

When InertiaCore performs a request, it will determine which data is required and only then will it evaluate the delegate function. This can significantly increase the performance of pages that contain a lot of optional data.

Additionally, InertiaCore provides an `Optional()` method to specify that a prop should never be included unless explicitly requested using the `only` option:

```csharp
return Inertia.Render("Users/Index", new
{
    users = Inertia.Optional(() => userService.GetAll())
});
```

On the inverse, you can use the `Always()` method to specify that a prop should always be included, even if it has not been explicitly required in a partial reload.

```csharp
return Inertia.Render("Users/Index", new
{
    users = Inertia.Always(userService.GetAll())
});
```

Here's a summary of each approach:

```csharp
return Inertia.Render("Users/Index", new
{
    // ALWAYS included on standard visits
    // OPTIONALLY included on partial reloads
    // ALWAYS evaluated
    users = userService.GetAll(),

    // ALWAYS included on standard visits
    // OPTIONALLY included on partial reloads
    // ONLY evaluated when needed
    users = new Func<object>(() => userService.GetAll()),

    // NEVER included on standard visits
    // OPTIONALLY included on partial reloads
    // ONLY evaluated when needed
    users = Inertia.Optional(() => userService.GetAll()),

    // ALWAYS included on standard visits
    // ALWAYS included on partial reloads
    // ALWAYS evaluated
    users = Inertia.Always(userService.GetAll())
});
```
