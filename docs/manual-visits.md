# Manual visits

In addition to [creating links](/links), it's also possible to manually make Inertia visits / requests programmatically via JavaScript. This is accomplished via the `router.visit()` method.

```js
// framework: vue
import { router } from "@inertiajs/vue3";
router.visit(url, {
  method: "get",
  data: {},
  replace: false,
  preserveState: false,
  preserveScroll: false,
  only: [],
  except: [],
  headers: {},
  errorBag: null,
  forceFormData: false,
  queryStringArrayFormat: "brackets",
  async: false,
  showProgress: true,
  fresh: false,
  reset: [],
  preserveUrl: false,
  prefetch: false,
  onCancelToken: (cancelToken) => {},
  onCancel: () => {},
  onBefore: (visit) => {},
  onStart: (visit) => {},
  onProgress: (progress) => {},
  onSuccess: (page) => {},
  onError: (errors) => {},
  onFinish: (visit) => {},
  onPrefetching: () => {},
  onPrefetched: () => {},
});
```

```js
// framework: react
import { router } from "@inertiajs/react";
router.visit(url, {
  method: "get",
  data: {},
  replace: false,
  preserveState: false,
  preserveScroll: false,
  only: [],
  except: [],
  headers: {},
  errorBag: null,
  forceFormData: false,
  queryStringArrayFormat: "brackets",
  async: false,
  showProgress: true,
  fresh: false,
  reset: [],
  preserveUrl: false,
  prefetch: false,
  onCancelToken: (cancelToken) => {},
  onCancel: () => {},
  onBefore: (visit) => {},
  onStart: (visit) => {},
  onProgress: (progress) => {},
  onSuccess: (page) => {},
  onError: (errors) => {},
  onFinish: (visit) => {},
  onPrefetching: () => {},
  onPrefetched: () => {},
});
```

```js
// framework: svelte
import { router } from "@inertiajs/svelte";
router.visit(url, {
  method: "get",
  data: {},
  replace: false,
  preserveState: false,
  preserveScroll: false,
  only: [],
  except: [],
  headers: {},
  errorBag: null,
  forceFormData: false,
  queryStringArrayFormat: "brackets",
  async: false,
  showProgress: true,
  fresh: false,
  reset: [],
  preserveUrl: false,
  prefetch: false,
  onCancelToken: (cancelToken) => {},
  onCancel: () => {},
  onBefore: (visit) => {},
  onStart: (visit) => {},
  onProgress: (progress) => {},
  onSuccess: (page) => {},
  onError: (errors) => {},
  onFinish: (visit) => {},
  onPrefetching: () => {},
  onPrefetched: () => {},
});
```

However, it's generally more convenient to use one of Inertia's shortcut request methods. These methods share all the same options as `router.visit()`.

```js
// framework: vue
import { router } from "@inertiajs/vue3";
router.get(url, data, options);
router.post(url, data, options);
router.put(url, data, options);
router.patch(url, data, options);
router.delete(url, options);
router.reload(options); // Uses the current URL
```

```js
// framework: react
import { router } from "@inertiajs/react";
router.get(url, data, options);
router.post(url, data, options);
router.put(url, data, options);
router.patch(url, data, options);
router.delete(url, options);
router.reload(options); // Uses the current URL
```

```js
// framework: svelte
import { router } from "@inertiajs/svelte";
router.get(url, data, options);
router.post(url, data, options);
router.put(url, data, options);
router.patch(url, data, options);
router.delete(url, options);
router.reload(options); // Uses the current URL
```

The `reload()` method is a convenient, shorthand method that automatically visits the current page with `preserveState` and `preserveScroll` both set to `true`, making it the perfect method to invoke when you just want to reload the current page's data.

## Method

When making manual visits, you may use the `method` option to set the request's HTTP method to `get`, `post`, `put`, `patch` or `delete`. The default method is `get`.

```js
// framework: vue
import { router } from "@inertiajs/vue3";
router.visit(url, { method: "post" });
```

```js
// framework: react
import { router } from "@inertiajs/react";
router.visit(url, { method: "post" });
```

```js
// framework: svelte
import { router } from "@inertiajs/svelte";
router.visit(url, { method: "post" });
```

Uploading files via `put` or `patch` is not supported in some web frameworks. Instead, make the request via `post`, including a `_method` field set to `put` or `patch`. This is called form method spoofing.

<!-- TODO: Add wayfinder -->
<!-- ## Typed Routes

<minimumversion version="2.1.2"></minimumversion>When using typed route generation (similar to Laravel's Wayfinder), you can pass the resulting object directly to any router method. The router will infer the HTTP method and URL from the route object.

```js
// framework: vue
import { router } from '@inertiajs/vue3'
import { userShow } from './routes'
router.visit(userShow(1))
router.post(userStore())
router.delete(userDestroy(1))
```

```js
// framework: react
import { router } from '@inertiajs/react'

import { userShow } from './routes'
router.visit(userShow(1))
router.post(userStore())
router.delete(userDestroy(1))

```

```js
// framework: svelte
import { router } from '@inertiajs/svelte'
import { userShow } from './routes'
router.visit(userShow(1))
router.post(userStore())
router.delete(userDestroy(1))
```

If you provide both a typed route object and specify the `method` option, the `method` option will take precedence.

```js
// framework: vue
import { router } from "@inertiajs/vue3";
import { userUpdate } from "./routes";
router.visit(userUpdate(1), { method: "patch" });
```

```js
// framework: react
import { router } from '@inertiajs/react'

import { userUpdate } from './routes'
router.visit(userUpdate(1), { method: 'patch' })

```

```js
// framework: svelte
import { router } from '@inertiajs/svelte'
import { userUpdate } from './routes'
router.visit(userUpdate(1), { method: 'patch' })
``` -->

## Data

You may use the `data` option to add data to the request.

```js
// framework: vue
import { router } from "@inertiajs/vue3";
router.visit("/users", {
  method: "post",
  data: {
    name: "John Doe",
    email: "john.doe@example.com",
  },
});
```

```js
// framework: react
import { router } from "@inertiajs/react";
router.visit("/users", {
  method: "post",
  data: {
    name: "John Doe",
    email: "john.doe@example.com",
  },
});
```

```js
// framework: svelte
import { router } from "@inertiajs/svelte";
router.visit("/users", {
  method: "post",
  data: {
    name: "John Doe",
    email: "john.doe@example.com",
  },
});
```

For convenience, the `get()`, `post()`, `put()`, and `patch()`methods all accept `data` as their second argument.

```js
// framework: vue
import { router } from "@inertiajs/vue3";
router.post("/users", {
  name: "John Doe",
  email: "john.doe@example.com",
});
```

```js
// framework: react
import { router } from "@inertiajs/react";
router.post("/users", {
  name: "John Doe",
  email: "john.doe@example.com",
});
```

```js
// framework: svelte
import { router } from "@inertiajs/svelte";
router.post("/users", {
  name: "John Doe",
  email: "john.doe@example.com",
});
```

## Custom headers

The `headers` option allows you to add custom headers to a request.

```js
// framework: vue
import { router } from "@inertiajs/vue3";
router.post("/users", data, {
  headers: {
    "Custom-Header": "value",
  },
});
```

```js
// framework: react
import { router } from "@inertiajs/react";
router.post("/users", data, {
  headers: {
    "Custom-Header": "value",
  },
});
```

```js
// framework: svelte
import { router } from "@inertiajs/svelte";
router.post("/users", data, {
  headers: {
    "Custom-Header": "value",
  },
});
```

The headers Inertia uses internally to communicate its state to the server take priority and therefore cannot be overwritten.

## File uploads

When making visits / requests that include files, Inertia will automatically convert the request data into a `FormData` object. If you would like the request to always use a `FormData` object, you may use the `forceFormData` option.

```js
// framework: vue
import { router } from "@inertiajs/vue3";
router.post("/companies", data, {
  forceFormData: true,
});
```

```js
// framework: react
import { router } from "@inertiajs/react";
router.post("/companies", data, {
  forceFormData: true,
});
```

```js
// framework: svelte
import { router } from "@inertiajs/svelte";
router.post("/companies", data, {
  forceFormData: true,
});
```

For more information on uploading files, check out the dedicated [file uploads](/file-uploads)documentation.

## Browser history

When making visits, Inertia automatically adds a new entry into the browser history. However, it's also possible to replace the current history entry by setting the `replace` option to `true`.

```js
// framework: vue
import { router } from "@inertiajs/vue3";
router.get("/users", { search: "John" }, { replace: true });
```

```js
// framework: react
import { router } from "@inertiajs/react";
router.get("/users", { search: "John" }, { replace: true });
```

```js
// framework: svelte
import { router } from "@inertiajs/svelte";
router.get("/users", { search: "John" }, { replace: true });
```

Visits made to the same URL automatically set `replace` to `true`.

## Client side visits

You can use the `router.push` and `router.replace` method to make client-side visits. This method is useful when you want to update the browser's history without making a server request.

```js
// framework: vue
import { router } from "@inertiajs/vue3";
router.push({
  url: "/users",
  component: "Users",
  props: { search: "John" },
  clearHistory: false,
  encryptHistory: false,
  preserveScroll: false,
  preserveState: false,
  errorBag: null,
  onSuccess: (page) => {},
  onError: (errors) => {},
  onFinish: (visit) => {},
});
```

```js
// framework: react
import { router } from "@inertiajs/react";
router.push({
  url: "/users",
  component: "Users",
  props: { search: "John" },
  clearHistory: false,
  encryptHistory: false,
  preserveScroll: false,
  preserveState: false,
  errorBag: null,
  onSuccess: (page) => {},
  onError: (errors) => {},
  onFinish: (visit) => {},
});
```

```js
// framework: svelte
import { router } from "@inertiajs/svelte";
router.push({
  url: "/users",
  component: "Users",
  props: { search: "John" },
  clearHistory: false,
  encryptHistory: false,
  preserveScroll: false,
  preserveState: false,
  errorBag: null,
  onSuccess: (page) => {},
  onError: (errors) => {},
  onFinish: (visit) => {},
});
```

All of the parameters are optional. By default, all passed paramaters (except `errorBag`) will be merged with the current page. This means you are responsible for overriding the current page's URL, component, and props.

If you need access to the current page's props, you can pass a function to the props option. This function will receive the current page's props as an argument and should return the new props.

The `errorBag` option allows you to specify which error bag to use when handling validation errors in the `onError` callback.

```js
// framework: vue
import { router } from "@inertiajs/vue3";
router.push({ url: "/users", component: "Users" });
router.replace({
  props: (currentProps) => ({ ...currentProps, search: "John" }),
});
```

```js
// framework: react
import { router } from "@inertiajs/react";
router.push({ url: "/users", component: "Users" });
router.replace({
  props: (currentProps) => ({ ...currentProps, search: "John" }),
});
```

```js
// framework: svelte
import { router } from "@inertiajs/svelte";
router.push({ url: "/users", component: "Users" });
router.replace({
  props: (currentProps) => ({ ...currentProps, search: "John" }),
});
```

Make sure that any route you push on the client side is also defined on the server side. If the user refreshes the page, the server will need to know how to render the page.

## State preservation

By default, page visits to the same page create a fresh page component instance. This causes any local state, such as form inputs, scroll positions, and focus states to be lost.

However, in some situations, it's necessary to preserve the page component state. For example, when submitting a form, you need to preserve your form data in the event that form validation fails on the server.

For this reason, the `post`, `put`, `patch`, `delete`, and `reload` methods all set the `preserveState` option to `true` by default.

You can instruct Inertia to preserve the component's state when using the `get` method by setting the `preserveState` option to `true`.

```js
// framework: vue
import { router } from "@inertiajs/vue3";
router.get("/users", { search: "John" }, { preserveState: true });
```

```js
// framework: react
import { router } from "@inertiajs/react";
router.get("/users", { search: "John" }, { preserveState: true });
```

```js
// framework: svelte
import { router } from "@inertiajs/svelte";
router.get("/users", { search: "John" }, { preserveState: true });
```

If you'd like to only preserve state if the response includes validation errors, set the `preserveState` option to "errors".

```js
// framework: vue
import { router } from "@inertiajs/vue3";
router.get("/users", { search: "John" }, { preserveState: "errors" });
```

```js
// framework: react
import { router } from "@inertiajs/react";
router.get("/users", { search: "John" }, { preserveState: "errors" });
```

```js
// framework: svelte
import { router } from "@inertiajs/svelte";
router.get("/users", { search: "John" }, { preserveState: "errors" });
```

You can also lazily evaluate the `preserveState` option based on the response by providing a callback.

```js
// framework: vue
import { router } from "@inertiajs/vue3";
router.post("/users", data, {
  preserveState: (page) => page.props.someProp === "value",
});
```

```js
// framework: react
import { router } from "@inertiajs/react";
router.post("/users", data, {
  preserveState: (page) => page.props.someProp === "value",
});
```

```js
// framework: svelte
import { router } from "@inertiajs/svelte";
router.post("/users", data, {
  preserveState: (page) => page.props.someProp === "value",
});
```

## Scroll preservation

When navigating between pages, Inertia mimics default browser behavior by automatically resetting the scroll position of the document body (as well as any [scroll regions](/scroll-management#scroll-regions)you've defined) back to the top of the page.

You can disable this behavior by setting the `preserveScroll` option to `true`.

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

For more information regarding this feature, please consult the [scroll management](/scroll-management) documentation.

## Partial reloads

The `only` option allows you to request a subset of the props (data) from the server on subsequent visits to the same page, thus making your application more efficient since it does not need to retrieve data that the page is not interested in refreshing.

```js
// framework: vue
import { router } from "@inertiajs/vue3";
router.get("/users", { search: "John" }, { only: ["users"] });
```

```js
// framework: react
import { router } from "@inertiajs/react";
router.get("/users", { search: "John" }, { only: ["users"] });
```

```js
// framework: svelte
import { router } from "@inertiajs/svelte";
router.get("/users", { search: "John" }, { only: ["users"] });
```

For more information on this feature, please consult the [partial reloads](/partial-reloads)documentation.

## Visit cancellation

You can cancel a visit using a cancel token, which Inertia automatically generates and provides via the `onCancelToken()` callback prior to making the visit.

```js
// framework: vue
import { router } from "@inertiajs/vue3";
router.post("/users", data, {
  onCancelToken: (cancelToken) => (this.cancelToken = cancelToken),
});
// Cancel the visit...
this.cancelToken.cancel();
```

```js
// framework: react
import { router } from "@inertiajs/react";
router.post("/users", data, {
  onCancelToken: (cancelToken) => (this.cancelToken = cancelToken),
});
// Cancel the visit...
this.cancelToken.cancel();
```

```js
// framework: svelte
import { router } from "@inertiajs/svelte";
router.post("/users", data, {
  onCancelToken: (cancelToken) => (this.cancelToken = cancelToken),
});
// Cancel the visit...
this.cancelToken.cancel();
```

The `onCancel()` and `onFinish()` event callbacks will be executed when a visit is cancelled.

## Event callbacks

In addition to Inertia's [global events](/events), Inertia also provides a number of per-visit event callbacks.

```js
// framework: vue
import { router } from "@inertiajs/vue3";
router.post("/users", data, {
  onBefore: (visit) => {},
  onStart: (visit) => {},
  onProgress: (progress) => {},
  onSuccess: (page) => {},
  onError: (errors) => {},
  onCancel: () => {},
  onFinish: (visit) => {},
  onPrefetching: () => {},
  onPrefetched: () => {},
});
```

```js
// framework: react
import { router } from "@inertiajs/react";
router.post("/users", data, {
  onBefore: (visit) => {},
  onStart: (visit) => {},
  onProgress: (progress) => {},
  onSuccess: (page) => {},
  onError: (errors) => {},
  onCancel: () => {},
  onFinish: (visit) => {},
  onPrefetching: () => {},
  onPrefetched: () => {},
});
```

```js
// framework: svelte
import { router } from "@inertiajs/svelte";
router.post("/users", data, {
  onBefore: (visit) => {},
  onStart: (visit) => {},
  onProgress: (progress) => {},
  onSuccess: (page) => {},
  onError: (errors) => {},
  onCancel: () => {},
  onFinish: (visit) => {},
  onPrefetching: () => {},
  onPrefetched: () => {},
});
```

Returning `false` from the `onBefore()` callback will cause the visit to be cancelled.

```js
// framework: vue
import { router } from '@inertiajs/vue3'
router.delete(\`/users/\${user.id}\
```

```js
// framework: react
import { router } from '@inertiajs/react'
router.delete(\`/users/\${user.id}\
```

```js
// framework: svelte
import { router } from '@inertiajs/svelte'
router.delete(\`/users/\${user.id}\
```

It's also possible to return a promise from the `onSuccess()` and `onError()` callbacks. When doing so, the "finish" event will be delayed until the promise has resolved.

```js
// framework: vue
import { router } from '@inertiajs/vue3'
router.post(url, {
    onSuccess: () => {
        return Promise.all([
            this.firstTask(),
            this.secondTask()
        ])
    }
    onFinish: visit => {
    // Not called until firstTask() and secondTask() have finished
    },
})
```

```js
// framework: react
import { router } from '@inertiajs/react'
router.post(url, {
    onSuccess: () => {
        return Promise.all([
            this.firstTask(),
            this.secondTask()
        ])
    }
    onFinish: visit => {
    // Not called until firstTask() and secondTask() have finished
    },
})
```

```js
// framework: svelte
import { router } from '@inertiajs/svelte'
router.post(url, {
    onSuccess: () => {
        return Promise.all([
            this.firstTask(),
            this.secondTask()
        ])
    }
    onFinish: visit => {
        // Not called until firstTask() and secondTask() have finished
    },
})
```
