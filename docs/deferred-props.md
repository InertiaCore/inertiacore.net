# Deferred props

Inertia's deferred props feature allows you to defer the loading of certain page data until after the initial page render. This can be useful for improving the perceived performance of your app by allowing the initial page render to happen as quickly as possible.

## Server side

To defer a prop, you can use the `Inertia.Defer()` method when returning your response. This method receives a delegate function that returns the prop data. The delegate will be executed in a separate request after the initial page render.

```csharp
app.MapGet("/users", (UserService userService, RoleService roleService, PermissionService permissionService) =>
{
    return Inertia.Render("Users/Index", new
    {
        users = userService.GetAll(),
        roles = roleService.GetAll(),
        permissions = Inertia.Defer(() => permissionService.GetAll())
    });
});
```

### Grouping requests

By default, all deferred props get fetched in one request after the initial page is rendered, but you can choose to fetch data in parallel by grouping props together.

```csharp
app.MapGet("/users", (UserService userService, RoleService roleService, PermissionService permissionService, TeamService teamService, ProjectService projectService, TaskService taskService) =>
{
    return Inertia.Render("Users/Index", new
    {
        users = userService.GetAll(),
        roles = roleService.GetAll(),
        permissions = Inertia.Defer(() => permissionService.GetAll()),
        teams = Inertia.Defer(() => teamService.GetAll(), "attributes"),
        projects = Inertia.Defer(() => projectService.GetAll(), "attributes"),
        tasks = Inertia.Defer(() => taskService.GetAll(), "attributes")
    });
});
```

In the example above, the `teams`, `projects`, and `tasks` props will be fetched in one request, while the `permissions` prop will be fetched in a separate request in parallel. Group names are arbitrary strings and can be anything you choose.

## Client side

On the client side, Inertia provides the `Deferred` component to help you manage deferred props. This component will automatically wait for the specified deferred props to be available before rendering its children.

```vue
<!-- framework: vue -->
<script setup>
import { Deferred } from "@inertiajs/vue3";
</script>
<template>
  <Deferred data="permissions">
    <template #fallback>
      <div>Loading...</div>
    </template>
    <div v-for="permission in permissions"><!-- ... --></div>
  </Deferred>
</template>
```

```jsx
// framework: react
import { Deferred } from "@inertiajs/react";
export default () => (
  <Deferred data="permissions" fallback={<div>Loading...</div>}>
    <PermissionsChildComponent />
  </Deferred>
);
```

```svelte
<!-- framework: svelte4 -->
<script>
import { Deferred } from '@inertiajs/svelte'
export let permissions
</script>
<Deferred data="permissions">
  <svelte:fragment slot="fallback">
    <div>Loading...</div>
  </svelte:fragment>
  {#each permissions as permission}
    <!-- ... -->
  {/each}
</Deferred>
```

```svelte
<!-- framework: svelte5 -->
<script>
import { Deferred } from '@inertiajs/svelte'
let { permissions } = $props()
</script>
<Deferred data="permissions">
  {#snippet fallback()}
    <div>Loading...</div>
  {/snippet}
  {#each permissions as permission}
    <!-- ... -->
  {/each}
</Deferred>
```

If you need to wait for multiple deferred props to become available, you can specify an array to the `data` prop.

```vue
<!-- framework: vue -->
<script setup>
import { Deferred } from "@inertiajs/vue3";
</script>
<template>
  <Deferred :data="['teams', 'users']">
    <template #fallback>
      <div>Loading...</div>
    </template>
    <!-- Props are now loaded -->
  </Deferred>
</template>
```

```jsx
// framework: react
import { Deferred } from "@inertiajs/react";
export default () => (
  <Deferred data={["teams", "users"]} fallback={<div>Loading...</div>}>
    <ChildComponent />
  </Deferred>
);
```

```svelte
<!-- framework: svelte4 -->
<script>
import { Deferred } from '@inertiajs/svelte'
export let teams
export let users
</script>
<Deferred data={['teams', 'users']}>
  <svelte:fragment slot="fallback">
    <div>Loading...</div>
  </svelte:fragment>
  <!-- Props are now loaded -->
</Deferred>
```

```svelte
<!-- framework: svelte5 -->
<script>
import { Deferred } from '@inertiajs/svelte'
let { teams, users } = $props()
</script>
<Deferred data={['teams', 'users']}>
  {#snippet fallback()}
    <div>Loading...</div>
  {/snippet}
<!-- Props are now loaded -->
</Deferred>
```
