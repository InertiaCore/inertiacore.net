# Events

Inertia provides an event system that allows you to "hook into" the various lifecycle events of the library.

## Registering listeners

To register an event listener, use the `router.on()` method.

```js
// framework: vue
import { router } from "@inertiajs/vue3";
router.on('start', (event) => {
    console.log(\`Starting a visit to \${event.detail.visit.url}\`)
})
```

```jsx
// framework: react
import { router } from '@inertiajs/react'
router.on('start', (event) => {
    console.log(\`Starting a visit to \${event.detail.visit.url}\`)
})
```

```js
// framework: svelte
import { router } from '@inertiajs/svelte'
router.on('start', (event) => {
    console.log(\`Starting a visit to \${event.detail.visit.url}\`)
})
```

Under the hood, Inertia uses native browser events, so you can also interact with Inertia events using the typical event methods you may already be familiar with - just be sure to prepend `inertia:` to the event name.

```js
// framework: vue
import { router } from '@inertiajs/vue3'
document.addEventListener('inertia:start', (event) => {
    console.log(\`Starting a visit to \${event.detail.visit.url}\`)
})
```

```jsx
// framework: react
import { router } from '@inertiajs/react'
document.addEventListener('inertia:start', (event) => {
    console.log(\`Starting a visit to \${event.detail.visit.url}\`)
})
```

```js
// framework: svelte
import { router } from '@inertiajs/svelte'
document.addEventListener('inertia:start', (event) => {
    console.log(\`Starting a visit to \${event.detail.visit.url}\`)
})
```

## Removing listeners

When you register an event listener, Inertia automatically returns a callback that can be invoked to remove the event listener.

```js
// framework: vue
import { router } from '@inertiajs/vue3'
let removeStartEventListener = router.on('start', (event) => {
    console.log(\`Starting a visit to \${event.detail.visit.url}\`)
})
// Remove the listener...
removeStartEventListener()
```

```jsx
// framework: react
import { router } from '@inertiajs/react'
let removeStartEventListener = router.on('start', (event) => {
    console.log(\`Starting a visit to \${event.detail.visit.url}\`)
})
// Remove the listener...
removeStartEventListener()
```

```js
// framework: svelte
import { router } from '@inertiajs/svelte'
let removeStartEventListener = router.on('start', (event) => {
    console.log(\`Starting a visit to \${event.detail.visit.url}\`)
})
// Remove the listener...
removeStartEventListener()
```

Combined with hooks, you can automatically remove the event listener when components unmount.

```jsx
// framework: vue
import { router } from '@inertiajs/vue3'
import { onUnmounted } from 'vue'
onUnmounted(
    router.on('start', (event) => {
        console.log(\`Starting a visit to \${event.detail.visit.url}\`)
    })
)
```

```jsx
// framework: react
import { useEffect } from 'react'
import { router } from '@inertiajs/react'
useEffect(() => {
    return router.on('start', (event) => {
        console.log(\`Starting a visit to \${event.detail.visit.url}\`)
    })
}, [])
```

```js
// framework: svelte4
import { router } from '@inertiajs/svelte'
import { onMount } from 'svelte'
onMount(() => {
    return router.on('start', (event) => {
        console.log(\`Starting a visit to \${event.detail.visit.url}\`)
    })
})
```

```js
// framework: svelte5
import { router } from '@inertiajs/svelte'
$effect(() => {
    return router.on('start', (event) => {
        console.log(\`Starting a visit to \${event.detail.visit.url}\`)
    })
})
```

Alternatively, if you're using native browser events, you can remove the event listener using `removeEventListener()`.

```js
// framework: vue
import { router } from '@inertiajs/vue3'
let startEventListener = (event) => {
    console.log(\`Starting a visit to \${event.detail.visit.url}\`)
}
document.addEventListener('inertia:start', startEventListener)
// Remove the listener...
document.removeEventListener('inertia:start', startEventListener)
```

```jsx
// framework: react
import { router } from '@inertiajs/react'
let startEventListener = (event) => {
    console.log(\`Starting a visit to \${event.detail.visit.url}\`)
}
document.addEventListener('inertia:start', startEventListener)
// Remove the listener...
document.removeEventListener('inertia:start', startEventListener)
```

```js
// framework: svelte
import { router } from '@inertiajs/svelte'
let startEventListener = (event) => {
    console.log(\`Starting a visit to \${event.detail.visit.url}\`)
}
document.addEventListener('inertia:start', startEventListener)
// Remove the listener...
document.removeEventListener('inertia:start', startEventListener)
```

## Cancelling events

Some events, such as `before`, `exception`, and `invalid`, support cancellation, allowing you to prevent Inertia's default behavior. Just like native events, the event will be cancelled if only one event listener calls `event.preventDefault()`.

```js
// framework: vue
import { router } from "@inertiajs/vue3";
router.on("before", (event) => {
  if (!confirm("Are you sure you want to navigate away?")) {
    event.preventDefault();
  }
});
```

```jsx
// framework: react
import { router } from "@inertiajs/react";
router.on("before", (event) => {
  if (!confirm("Are you sure you want to navigate away?")) {
    event.preventDefault();
  }
});
```

```js
// framework: svelte
import { router } from "@inertiajs/svelte";
router.on("before", (event) => {
  if (!confirm("Are you sure you want to navigate away?")) {
    event.preventDefault();
  }
});
```

For convenience, if you register your event listener using `router.on()`, you can cancel the event by returning `false` from the listener.

```js
// framework: vue
import { router } from "@inertiajs/vue3";
router.on("before", (event) => {
  return confirm("Are you sure you want to navigate away?");
});
```

```jsx
// framework: react
import { router } from "@inertiajs/react";
router.on("before", (event) => {
  return confirm("Are you sure you want to navigate away?");
});
```

```js
// framework: svelte
import { router } from "@inertiajs/svelte";
router.on("before", (event) => {
  return confirm("Are you sure you want to navigate away?");
});
```

Note, browsers do not allow cancelling the native `popstate` event, so preventing forward and back history visits while using Inertia.js is not possible.

## Before

The `before` event fires when a request is about to be made to the server. This is useful for intercepting visits.

```js
// framework: vue
import { router } from '@inertiajs/vue3'
router.on('before', (event) => {
    console.log(\`About to make a visit to \${event.detail.visit.url}\`)
})
```

```jsx
// framework: react
import { router } from '@inertiajs/react'
router.on('before', (event) => {
    console.log(\`About to make a visit to \${event.detail.visit.url}\`)
})
```

```js
// framework: svelte
import { router } from '@inertiajs/svelte'
router.on('before', (event) => {
    console.log(\`About to make a visit to \${event.detail.visit.url}\`)
})
```

The primary purpose of this event is to allow you to prevent a visit from happening.

```js
// framework: vue
import { router } from "@inertiajs/vue3";
router.on("before", (event) => {
  return confirm("Are you sure you want to navigate away?");
});
```

```jsx
// framework: react
import { router } from "@inertiajs/react";
router.on("before", (event) => {
  return confirm("Are you sure you want to navigate away?");
});
```

```js
// framework: svelte
import { router } from "@inertiajs/svelte";
router.on("before", (event) => {
  return confirm("Are you sure you want to navigate away?");
});
```

## Start

The `start` event fires when a request to the server has started. This is useful for displaying loading indicators.

```js
// framework: vue
import { router } from '@inertiajs/vue3'
router.on('start', (event) => {
    console.log(\`Starting a visit to \${event.detail.visit.url}\`)
})
```

```jsx
// framework: react
import { router } from '@inertiajs/react'
router.on('start', (event) => {
    console.log(\`Starting a visit to \${event.detail.visit.url}\`)
})
```

```js
// framework: svelte
import { router } from '@inertiajs/svelte'
router.on('start', (event) => {
    console.log(\`Starting a visit to \${event.detail.visit.url}\`)
})
```

The `start` event is not cancelable.

## Progress

The `progress` event fires as progress increments during file uploads.

```js
// framework: vue
import { router } from "@inertiajs/vue3";
router.on("progress", (event) => {
  this.form.progress = event.detail.progress.percentage;
});
```

```jsx
// framework: react
import { router } from "@inertiajs/react";
router.on("progress", (event) => {
  this.form.progress = event.detail.progress.percentage;
});
```

```js
// framework: svelte
import { router } from "@inertiajs/svelte";
router.on("progress", (event) => {
  this.form.progress = event.detail.progress.percentage;
});
```

The `progress` event is not cancelable.

## Success

The `success` event fires on successful page visits, unless validation errors are present. However, this does _not_ include history visits.

```js
// framework: vue
import { router } from '@inertiajs/vue3'
router.on('success', (event) => {
    console.log(\`Successfully made a visit to \${event.detail.page.url}\`)
})
```

```jsx
// framework: react
import { router } from '@inertiajs/react'
router.on('success', (event) => {
    console.log(\`Successfully made a visit to \${event.detail.page.url}\`)
})
```

```js
// framework: svelte
import { router } from '@inertiajs/svelte'
router.on('success', (event) => {
    console.log(\`Successfully made a visit to \${event.detail.page.url}\`)
})
```

The `success` event is not cancelable.

## Error

The `error` event fires when validation errors are present on "successful" page visits.

```js
// framework: vue
import { router } from "@inertiajs/vue3";
router.on("error", (errors) => {
  console.log(errors);
});
```

```jsx
// framework: react
import { router } from "@inertiajs/react";
router.on("error", (errors) => {
  console.log(errors);
});
```

```js
// framework: svelte
import { router } from "@inertiajs/svelte";
router.on("error", (errors) => {
  console.log(errors);
});
```

The `error` event is not cancelable.

## Invalid

The `invalid` event fires when a non-Inertia response is received from the server, such as an HTML or vanilla JSON response. A valid Inertia response is a response that has the `X-Inertia` header set to `true` with a `json` payload containing [the page object](/the-protocol#the-page-object).

This event is fired for all response types, including `200`, `400`, and `500`response codes.

```js
// framework: vue
import { router } from '@inertiajs/vue3'
router.on('invalid', (event) => {
console.log(\`An invalid Inertia response was received.\`)
console.log(event.detail.response)
})
```

```jsx
// framework: react
import { router } from '@inertiajs/react'
router.on('invalid', (event) => {
console.log(\`An invalid Inertia response was received.\`)
console.log(event.detail.response)
})
```

```js
// framework: svelte
import { router } from '@inertiajs/svelte'
router.on('invalid', (event) => {
console.log(\`An invalid Inertia response was received.\`)
console.log(event.detail.response)
})
```

You may cancel the `invalid` event to prevent Inertia from showing the non-Inertia response modal.

```js
// framework: vue
import { router } from "@inertiajs/vue3";
router.on("invalid", (event) => {
  event.preventDefault();
  // Handle the invalid response yourself...
});
```

```jsx
// framework: react
import { router } from "@inertiajs/react";
router.on("invalid", (event) => {
  event.preventDefault();
  // Handle the invalid response yourself...
});
```

```js
// framework: svelte
import { router } from "@inertiajs/svelte";
router.on("invalid", (event) => {
  event.preventDefault();
  // Handle the invalid response yourself...
});
```

## Exception

The `exception` event fires on unexpected XHR errors such as network interruptions. In addition, this event fires for errors generated when resolving page components.

```js
// framework: vue
import { router } from '@inertiajs/vue3'
router.on('exception', (event) => {
console.log(\`An unexpected error occurred during an Inertia visit.\`)
console.log(event.detail.error)
})
```

```jsx
// framework: react
import { router } from '@inertiajs/react'
router.on('exception', (event) => {
console.log(\`An unexpected error occurred during an Inertia visit.\`)
console.log(event.detail.error)
})
```

```js
// framework: svelte
import { router } from '@inertiajs/svelte'
router.on('exception', (event) => {
console.log(\`An unexpected error occurred during an Inertia visit.\`)
console.log(event.detail.error)
})
```

You may cancel the `exception` event to prevent the error from being thrown.

```js
// framework: vue
import { router } from "@inertiajs/vue3";
router.on("exception", (event) => {
  event.preventDefault();
  // Handle the error yourself
});
```

```jsx
// framework: react
import { router } from "@inertiajs/react";
router.on("exception", (event) => {
  event.preventDefault();
  // Handle the error yourself
});
```

```js
// framework: svelte
import { router } from "@inertiajs/svelte";
router.on("exception", (event) => {
  event.preventDefault();
  // Handle the error yourself
});
```

This event will _not_ fire for XHR requests that receive `400` and `500` level responses or for non-Inertia responses, as these situations are handled in other ways by Inertia. Please consult the [error handling documentation](/error-handling) for more information.

## Finish

The `finish` event fires after an XHR request has completed for both "successful" and "unsuccessful" responses. This event is useful for hiding loading indicators.

```js
// framework: vue
import { router } from "@inertiajs/vue3";
router.on("finish", (event) => {
  NProgress.done();
});
```

```jsx
// framework: react
import { router } from "@inertiajs/react";
router.on("finish", (event) => {
  NProgress.done();
});
```

```js
// framework: svelte
import { router } from "@inertiajs/svelte";
router.on("finish", (event) => {
  NProgress.done();
});
```

The `finish` event is not cancelable.

## Navigate

The `navigate` event fires on successful page visits, as well as when navigating through history.

```js
// framework: vue
import { router } from '@inertiajs/vue3'
router.on('navigate', (event) => {
    console.log(\`Navigated to \${event.detail.page.url}\`)
})
```

```jsx
// framework: react
import { router } from '@inertiajs/react'
router.on('navigate', (event) => {
    console.log(\`Navigated to \${event.detail.page.url}\`)
})
```

```js
// framework: svelte
import { router } from '@inertiajs/svelte'
router.on('navigate', (event) => {
    console.log(\`Navigated to \${event.detail.page.url}\`)
})
```

The `navigate` event is not cancelable.

## Prefetching

The `prefetching` event fires when the router starts prefetching a page.

```js
// framework: vue
import { router } from '@inertiajs/vue3'
router.on('prefetching', (event) => {
    console.log(\`Prefetching \${event.detail.page.url}\`)
})
```

```jsx
// framework: react
import { router } from '@inertiajs/react'
router.on('prefetching', (event) => {
    console.log(\`Prefetching \${event.detail.page.url}\`)
})
```

```js
// framework: svelte
import { router } from '@inertiajs/svelte'
router.on('prefetching', (event) => {
    console.log(\`Prefetching \${event.detail.page.url}\`)
})
```

The `prefetching` event is not cancelable.

## Prefetched

The `prefetched` event fires when the router has successfully prefetched a page.

```js
// framework: vue
import { router } from '@inertiajs/vue3'
router.on('prefetched', (event) => {
    console.log(\`Prefetched \${event.detail.page.url}\`)
})
```

```jsx
// framework: react
import { router } from '@inertiajs/react'
router.on('prefetched', (event) => {
    console.log(\`Prefetched \${event.detail.page.url}\`)
})
```

```js
// framework: svelte
import { router } from '@inertiajs/svelte'
router.on('prefetched', (event) => {
    console.log(\`Prefetched \${event.detail.page.url}\`)
})
```

The `prefetched` event is not cancelable.

## Event callbacks

In addition to the global events described throughout this page, Inertia also provides a number of [event callbacks](/manual-visits#event-callbacks) that fire when manually making Inertia visits.
