# File uploads

## FormData conversion

When making Inertia requests that include files (even nested files), Inertia will automatically convert the request data into a `FormData` object. This conversion is necessary in order to submit a `multipart/form-data` request via XHR.

If you would like the request to always use a `FormData` object regardless of whether a file is present in the data, you may provide the `forceFormData` option when making the request.

```js
// framework: vue
import { router } from "@inertiajs/vue3";
router.post("/users", data, {
  forceFormData: true,
});
```

```js
// framework: react
import { router } from "@inertiajs/react";
router.post("/users", data, {
  forceFormData: true,
});
```

```js
// framework: svelte
import { router } from "@inertiajs/svelte";
router.post("/users", data, {
  forceFormData: true,
});
```

You can learn more about the `FormData` interface via its [MDN documentation](https://developer.mozilla.org/en-US/docs/Web/API/FormData).

Prior to version 0.8.0, Inertia did not automatically convert requests to `FormData`. If you're using an Inertia release prior to this version, you will need to manually perform this conversion.

## File upload example

Let's examine a complete file upload example using Inertia. This example includes both a `name` text input and an `avatar` file input.

```vue
// framework: vue
<script setup>
import { useForm } from "@inertiajs/vue3";
const form = useForm({
  name: null,
  avatar: null,
});
function submit() {
  form.post("/users");
}
</script>
<template>
  <form @submit.prevent="submit">
    <input type="text" v-model="form.name" />
    <input type="file" @input="form.avatar = $event.target.files[0]" />
    <progress v-if="form.progress" :value="form.progress.percentage" max="100">
      {{ form.progress.percentage }}%
    </progress>
    <button type="submit">Submit</button>
  </form>
</template>
```

```jsx
// framework: react
import { useForm } from "@inertiajs/react";
const { data, setData, post, progress } = useForm({
  name: null,
  avatar: null,
});
function submit(e) {
  e.preventDefault();
  post("/users");
}
return (
  <form onSubmit={submit}>
    <input
      type="text"
      value={data.name}
      onChange={(e) => setData("name", e.target.value)}
    />
    <input type="file" onChange={(e) => setData("avatar", e.target.files[0])} />
    {progress && (
      <progress value={progress.percentage} max="100">
        {progress.percentage}%
      </progress>
    )}
    <button type="submit">Submit</button>
  </form>
);
```

```svelte
// framework: svelte4
<script>
import { useForm } from '@inertiajs/svelte'
const form = useForm({
  name: null,
  avatar: null,
})
function submit() {
  $form.post('/users')
}
</script>
<form on:submit|preventDefault={submit}>
  <input type="text" bind:value={$form.name} />
  <input type="file" on:input={e => $form.avatar = e.target.files[0]} />
  {#if $form.progress}
    <progress value={$form.progress.percentage} max="100">
      {$form.progress.percentage}%
    </progress>
  {/if}
  <button type="submit">Submit</button>
</form>
```

```svelte
// framework: svelte5
<script>
import { useForm } from '@inertiajs/svelte'
const form = useForm({
  name: null,
  avatar: null,
})
function submit(e) {
  e.preventDefault()
  $form.post('/users')
}
</script>
<form onsubmit={submit}>
  <input type="text" bind:value={$form.name} />
  <input type="file" oninput={e => $form.avatar = e.target.files[0]} />
  {#if $form.progress}
    <progress value={$form.progress.percentage} max="100">
      {$form.progress.percentage}%
    </progress>
  {/if}
  <button type="submit">Submit</button>
</form>
```

This example uses the [Inertia form helper](/forms#form-helper) for convenience, since the form helper provides easy access to the current upload progress. However, you are free to submit your forms using [manual Inertia visits](/manual-visits) as well.

## Multipart limitations

Uploading files using a `multipart/form-data` request is not natively supported in some server-side frameworks when using the `PUT`,`PATCH`, or `DELETE` HTTP methods. The simplest workaround for this limitation is to simply upload files using a `POST` request instead.

However, ASP.NET Core supports form method overriding through middleware, which allows you to upload the files using `POST`, but have the framework handle the request as a `PUT` or `PATCH` request. This is done by including a `_method` attribute in the data of your request, though this requires custom middleware configuration.

```js
// framework: vue
import { router } from "@inertiajs/vue3";
router.post(`/users/${user.id}`, {
  _method: "put",
  name: form.name,
  avatar: form.avatar,
});
```

```js
// framework: react
import { router } from "@inertiajs/react";
router.post(`/users/${user.id}`, {
  _method: "put",
  name: data.name,
  avatar: data.avatar,
});
```

```js
// framework: svelte
import { router } from "@inertiajs/svelte";
router.post(`/users/${user.id}`, {
  _method: "put",
  name: $form.name,
  avatar: $form.avatar,
});
```

For ASP.NET Core applications, you would typically handle file uploads in your controller action like this:

```csharp
[HttpPost]
public async Task<IActionResult> Update(int id, [FromForm] UserUpdateRequest request)
{
    var user = await userService.GetUserAsync(id);

    if (request.Avatar != null)
    {
        // Handle file upload
        var fileName = await fileService.SaveFileAsync(request.Avatar);
        user.AvatarPath = fileName;
    }

    user.Name = request.Name;
    await userService.UpdateUserAsync(user);

    return Inertia.Render("Users/Show", new { User = user });
}

public class UserUpdateRequest
{
    public string Name { get; set; }
    public IFormFile Avatar { get; set; }
}
```
