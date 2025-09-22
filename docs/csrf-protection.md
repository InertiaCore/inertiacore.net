# CSRF protection

## Making requests

ASP.NET requires manually configuring the anti-forgery service. We also recommend setting the header name to `X-XSRF-TOKEN` to match the default header name used by Axios. Setup your application startup to include the following:

```csharp
builder.Services.AddAntiforgery(options => options.HeaderName = "X-XSRF-TOKEN");
```

We also recommend adding the following middleware to your application startup:

```csharp
app.UseInertia();
app.UseMiddleware<CsrfMiddleware>();
```

The `CsrfMiddleware` class is a custom middleware that validates the CSRF token. It helps make sure that the CSRF token is available and included in the response for axios on future requests. The middleware checks for the presence of the CSRF token in the request and validates it non-safe methods. If the token is invalid, the middleware will return a 409 error.

```csharp
using InertiaCore;
using Microsoft.AspNetCore.Antiforgery;
using Microsoft.AspNetCore.Mvc.ViewFeatures;

namespace App.Middleware;

public class CsrfMiddleware
{
    private readonly RequestDelegate _next;

    public CsrfMiddleware(RequestDelegate next)
    {
        _next = next;
    }

    public async Task InvokeAsync(HttpContext context)
    {
        var logger = context.RequestServices.GetRequiredService<ILogger<CsrfMiddleware>>();
        var antiforgery = context.RequestServices.GetRequiredService<IAntiforgery>();
        var method = context.Request.Method.ToUpperInvariant();
        var isSafeMethod = method == "GET" || method == "HEAD" || method == "OPTIONS" || method == "TRACE";

        // Validate CSRF for state-changing HTTP methods
        if (!isSafeMethod)
        {
            try
            {
                await antiforgery.ValidateRequestAsync(context);
            }
            catch (AntiforgeryValidationException ex)
            {
                var isInertiaRequest = context.Request.Headers["X-Inertia"].ToString() == "true";
                var referrer = context.Request.Headers["Referer"].ToString() ?? "/";
                var locationKey = isInertiaRequest ? "X-Inertia-Location" : "Location";

                logger.LogWarning("CSRF Middleware: Token validation failed - {Message}", ex.Message);

                // Put flash message into TempData
                var factory = context.RequestServices.GetRequiredService<ITempDataDictionaryFactory>();
                var tempData = factory.GetTempData(context);
                tempData["flash.error"] = "The page expired, please try again.";
                tempData.Save();

                context.Response.StatusCode = isInertiaRequest ? 409 : 303;
                context.Response.Headers[locationKey] = referrer;
                return;
            }
        }

        var tokens = antiforgery.GetAndStoreTokens(context);

        // Put the *request* token into a cookie that JS can read so Axios can echo it back
        // IMPORTANT: httpOnly=false so the browser will expose it to JS (Axios).
        var cookieOptions = new CookieOptions
        {
            HttpOnly = false,
            Secure = false,            // true in production
            SameSite = SameSiteMode.Strict, // use None if cross-site (and keep Secure=true)
            Path = "/"
        };

        context.Response.Cookies.Append("XSRF-TOKEN", tokens.RequestToken!, cookieOptions);

        await _next(context);
    }
}
```

This ensures each Inertia request includes the necessary CSRF token for `POST`, `PUT`, `PATCH`, and `DELETE` requests.

However, if you want to handle anti-forgery protection manually, one approach is to include the anti-forgery token as a prop on every response. You can then use the token when making Inertia requests.

```js
// framework: vue
import { router, usePage } from "@inertiajs/vue3";
const page = usePage();
router.post("/users", {
  _token: page.props.csrf_token,
  name: "John Doe",
  email: "john.doe@example.com",
});
```

```js
// framework: react
import { router, usePage } from "@inertiajs/react";
const props = usePage().props;
router.post("/users", {
  _token: props.csrf_token,
  name: "John Doe",
  email: "john.doe@example.com",
});
```

```js
// framework: svelte
import { page, router } from "@inertiajs/svelte";
router.post("/users", {
  _token: $page.props.csrf_token,
  name: "John Doe",
  email: "john.doe@example.com",
});
```

You can even use Inertia's [shared data](/shared-data) functionality to automatically include the `csrf_token` with each response.

However, a better approach is to use the anti-forgery functionality already built into [axios](https://github.com/axios/axios) for this. Axios is the HTTP library that Inertia uses under the hood.

Axios automatically checks for the existence of an `XSRF-TOKEN` cookie. If it's present, it will then include the token in an `X-XSRF-TOKEN` header for any requests it makes.

The easiest way to implement this in ASP.NET Core is using the built-in anti-forgery middleware. Simply configure the anti-forgery service to include the `XSRF-TOKEN` cookie on each response, and then verify the token using the `X-XSRF-TOKEN` header sent in the requests from axios.

## Handling mismatches

When an anti-forgery token mismatch occurs, your server-side framework will likely throw an exception that results in an error response. For example, when using ASP.NET Core, an `AntiforgeryValidationException` is thrown which results in a `400` error page. Since that isn't a valid Inertia response, the error is shown in a modal.

<video controls="" style="max-width: 100%; margin: 30px auto;"><source src="https://inertiajs.com/mp4/csrf-mismatch-modal.mp4" type="video/mp4"></source></video>Obviously, this isn't a great user experience. A better way to handle these errors is to return a redirect back to the previous page, along with a flash message that the page expired. This will result in a valid Inertia response with the flash message available as a prop which you can then display to the user. Of course, you'll need to share your [flash messages](/shared-data#flash-messages) with Inertia for this to work.

When using middleware example above, it automatically redirect the user back to the page they were previously on while flashing a message to TempData. Feel free to adjust as you see fit.

The end result is a much better experience for your users. Instead of seeing the error modal, the user is instead presented with a message that the page "expired" and are asked to try again.

<video controls="" style="max-width: 100%; margin: 30px auto;"><source src="https://inertiajs.com/mp4/csrf-mismatch-warning.mp4" type="video/mp4"></source></video>
