# Error handling

> [!NOTE]
> We have a another example of how to handle errors in the [Recommended middleware](/core/recommended-middleware.md) documentation, which includes 404 and 500 error handling.

## Development

One of the advantages to working with a robust server-side framework is the built-in exception handling you get for free. For example, ASP.NET Core ships with excellent error reporting tools which display nicely formatted stack traces and detailed exception information in local development.

The challenge is, if you're making an XHR request (which Inertia does) and you hit a server-side error, you're typically left digging through the network tab in your browser's devtools to diagnose the problem.

Inertia solves this issue by showing all non-Inertia responses in a modal. This means you get the same beautiful error-reporting you're accustomed to, even though you've made that request over XHR.

## Production

In production you will want to return a proper Inertia error response instead of relying on the modal-driven error reporting that is present during development. To accomplish this, you'll need to update your framework's default exception handler to return a custom error page.

When building ASP.NET Core applications, you can accomplish this by configuring a custom exception handling middleware in your application's startup configuration.

```csharp
using Microsoft.AspNetCore.Diagnostics;
using InertiaCore;

public class ErrorHandlingMiddleware
{
    private readonly RequestDelegate _next;
    private readonly IWebHostEnvironment _env;

    public ErrorHandlingMiddleware(RequestDelegate next, IWebHostEnvironment env)
    {
        _next = next;
        _env = env;
    }

    public async Task InvokeAsync(HttpContext context)
    {
        try
        {
            await _next(context);
        }
        catch (Exception ex)
        {
            if (!_env.IsDevelopment())
            {
                var statusCode = context.Response.StatusCode;
                if (new[] { 500, 503, 404, 403 }.Contains(statusCode))
                {
                    await HandleProductionErrorAsync(context, statusCode);
                    return;
                }
            }
            throw; // Re-throw in development to show detailed error page
        }
    }

    private async Task HandleProductionErrorAsync(HttpContext context, int statusCode)
    {
        var result = Inertia.Render("ErrorPage", new { Status = statusCode });
        context.Response.StatusCode = statusCode;
        await result.ExecuteResultAsync(new ActionContext(context, new RouteData(), new ActionDescriptor()));
    }
}
```

You may have noticed we're returning an `ErrorPage` page component in the example above. You'll need to actually create this component, which will serve as the generic error page for your application. Here's an example error component you can use as a starting point.

```vue
// framework: vue
<script setup>
import { computed } from "vue";
const props = defineProps({ status: Number });
const title = computed(() => {
  return {
    503: "503: Service Unavailable",
    500: "500: Server Error",
    404: "404: Page Not Found",
    403: "403: Forbidden",
  }[props.status];
});
const description = computed(() => {
  return {
    503: "Sorry, we are doing some maintenance. Please check back soon.",
    500: "Whoops, something went wrong on our servers.",
    404: "Sorry, the page you are looking for could not be found.",
    403: "Sorry, you are forbidden from accessing this page.",
  }[props.status];
});
</script>
<template>
  <div>
    <h1>{{ title }}</h1>
    <div>{{ description }}</div>
  </div>
</template>
```

```jsx
// framework: reactexport default function ErrorPage({ status }) {
  const title = {
    503: "503: Service Unavailable",
    500: "500: Server Error",
    404: "404: Page Not Found",
    403: "403: Forbidden",
  }[status];
  const description = {
    503: "Sorry, we are doing some maintenance. Please check back soon.",
    500: "Whoops, something went wrong on our servers.",
    404: "Sorry, the page you are looking for could not be found.",
    403: "Sorry, you are forbidden from accessing this page.",
  }[status];
  return (
    <div>
      <H1>{title}</H1>
      <div>{description}</div>
    </div>
  );
}
```

```svelte
// framework: svelte4
<script>
export let status
$: title = {
  503: '503: Service Unavailable',
  500: '500: Server Error',
  404: '404: Page Not Found',
  403: '403: Forbidden',
}[status]
$: description = {
  503: 'Sorry, we are doing some maintenance. Please check back soon.',
  500: 'Whoops, something went wrong on our servers.',
  404: 'Sorry, the page you are looking for could not be found.',
  403: 'Sorry, you are forbidden from accessing this page.',
}[status]
</script>
<div>
<h1>{title}</h1>
<div>{description}</div>
</div>
```

```svelte
// framework: svelte5
<script>
let { status } = $props()
const title = {
  503: '503: Service Unavailable',
  500: '500: Server Error',
  404: '404: Page Not Found',
  403: '403: Forbidden',
}
const description = {
  503: 'Sorry, we are doing some maintenance. Please check back soon.',
  500: 'Whoops, something went wrong on our servers.',
  404: 'Sorry, the page you are looking for could not be found.',
  403: 'Sorry, you are forbidden from accessing this page.',
}
</script>
<div>
<h1>{title[status]}</h1>
<div>{description[status]}</div>
</div>
```
