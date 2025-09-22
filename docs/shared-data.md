# Shared data

Sometimes you need to access specific pieces of data on numerous pages within your application. For example, you may need to display the current user in the site header. Passing this data manually in each response across your entire application is cumbersome. Thankfully, there is a better option: shared data.

## Sharing data

Inertia's server-side adapters all provide a method of making shared data available for every request. This is typically done outside of your controllers. Shared data will be automatically merged with the page props provided in your controller.

In ASP.NET Core applications, this is typically handled by configuring shared data in your startup or through middleware.

```csharp
using InertiaCore;
using Microsoft.AspNetCore.Mvc;

public class HandleInertiaRequests
{
    private readonly RequestDelegate _next;
    private readonly IConfiguration _configuration;

    public HandleInertiaRequests(RequestDelegate next, IConfiguration configuration)
    {
        _next = next;
        _configuration = configuration;
    }

    public async Task InvokeAsync(HttpContext context)
    {
        // Synchronously...
        Inertia.Share("appName", _configuration["App:Name"]);

        // Lazily...
        Inertia.Share("auth", () => context.User.Identity.IsAuthenticated
            ? new {
                User = new {
                    Id = context.User.FindFirst("id")?.Value,
                    Name = context.User.Identity.Name,
                    Email = context.User.FindFirst("email")?.Value
                }
            }
            : null);

        await _next(context);
    }
}
```

Alternatively, you can manually share data using the `Inertia.Share` method.

```csharp
using InertiaCore;

// Synchronously...
Inertia.Share("appName", Configuration["App:Name"]);

// Lazily...
Inertia.Share("user", (HttpContext context) => context.User.Identity.IsAuthenticated
    ? new {
        Id = context.User.FindFirst("id")?.Value,
        Name = context.User.Identity.Name,
        Email = context.User.FindFirst("email")?.Value
    }
    : null
);
```

Shared data should be used sparingly as all shared data is included with every response.

Page props and shared data are merged together, so be sure to namespace your shared data appropriately to avoid collisions.

## Accessing shared data

Once you have shared the data server-side, you will be able to access it within any of your pages or components. Here's an example of how to access shared data in a layout component.

```vue
<!-- framework: vue -->
<script setup>
import { computed } from "vue";
import { usePage } from "@inertiajs/vue3";
const page = usePage();
const user = computed(() => page.props.auth.user);
</script>
<template>
  <main>
    <header>You are logged in as: {{ user.name }}</header>
    <article>
      <slot />
    </article>
  </main>
</template>
```

```jsx
// framework: react
import { usePage } from "@inertiajs/react";
export default function Layout({ children }) {
  const { auth } = usePage().props;
  return (
    <main>
      <header>You are logged in as: {auth.user.name}</header>
      <article>{children}</article>
    </main>
  );
}
```

```svelte
<!-- framework: svelte -->
<script>
  import { page } from "@inertiajs/svelte";
</script>
<main>
  <header>You are logged in as: {$page.props.auth.user.name}</header>
  <article>
    <slot />
  </article>
</main>
```

## Flash messages

Another great use-case for shared data is flash messages. These are messages stored in the session only for the next request. For example, it's common to set a flash message after completing a task and before redirecting to a different page.

Here's a simple way to implement flash messages in your Inertia applications. First, share the flash message on each request.

```csharp
public class HandleInertiaRequests
{
    private readonly RequestDelegate _next;

    public HandleInertiaRequests(RequestDelegate next)
    {
        _next = next;
    }

    public async Task InvokeAsync(HttpContext context)
    {
        Inertia.Share("flash", () =>
        {
            try
            {
                var factory = context.RequestServices.GetRequiredService<ITempDataDictionaryFactory>();
                var tempData = factory.GetTempData(context);
                var flash = new Dictionary<string, object>();
                if (tempData.TryGetValue("message", out var message) && message is not null)
                {
                    // Ensure we only store simple serializable types
                    flash.Add("message", message.ToString() ?? "");
                }
                return flash;
            }
            catch (Exception)
            {
                // If there's any issue with TempData, return empty flash to prevent crashes
                return new Dictionary<string, object>();
            }
        });

        await _next(context);
    }
}

// Or in your controller:
public IActionResult Create()
{
    TempData["message"] = "User created successfully!";
    return RedirectToAction("Index");
}
```

Next, display the flash message in a frontend component, such as the site layout.

```vue
<!-- framework: vue -->
<template>
  <main>
    <header></header>
    <article>
      <div v-if="$page.props.flash.message" class="alert">
        {{ $page.props.flash.message }}
      </div>
      <slot />
    </article>
    <footer></footer>
  </main>
</template>
```

```jsx
// framework: react
import { usePage } from "@inertiajs/react";
export default function Layout({ children }) {
  const { flash } = usePage().props;
  return (
    <main>
      <header></header>
      <article>
        {flash.message && <div class="alert">{flash.message}</div>}
        {children}
      </article>
      <footer></footer>
    </main>
  );
}
```

```svelte
<!-- framework: svelte -->
<script>
  import { page } from "@inertiajs/svelte";
</script>
<main>
  <header></header>
  <article>
    {#if $page.props.flash.message}
    <div class="alert">{$page.props.flash.message}</div>
    {/if}
    <slot />
  </article>
  <footer></footer>
</main>
```
