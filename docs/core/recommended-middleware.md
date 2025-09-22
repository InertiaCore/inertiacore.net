# Recommended Middleware

ASP.NET Core makes several middleware available out of the box. We can also add a couple of our own to enhance the experience.

InertiaCore recommends using the following middleware in your application:

1. [CSRF Protection (recommended)](#csrf-protection)
2. [Session (required)](#session)
3. [HandleInertiaRequests (optional)](#handleinertiarequests)
4. [Exception Handling (optional)](#exception-handling)

## CSRF Protection

We strongly recommend using the CSRF protection middleware. Please see the [CSRF Protection](/csrf-protection.md) documentation for more information.

## Session

For the best experience, we recommend using the session middleware. The session middleware is used to store state in a session. This is useful for storing state between requests. This may be ModelState, flash messages, or other state that you need to persist between requests.

```csharp
// Program.cs

// Add services to the container.
builder.Services.AddControllersWithViews()
    .AddSessionStateTempDataProvider();

builder.Services.AddSession(options =>
{
    options.Cookie.Name = "App.Session";
    options.Cookie.HttpOnly = true;
    options.Cookie.IsEssential = true;
    options.IdleTimeout = TimeSpan.FromMinutes(30);
});
builder.Services.AddInertia();
builder.Services.AddViteHelper();

// Later on...

app.UseStaticFiles(); // For static files, like our CSS and JavaScript files
app.UseRouting();
app.UseSession();
// app.UseAuthentication(); // If you have authentication
// app.UseAuthorization(); // If you have authorization
app.UseInertia();

app.MapControllerRoute(
    name: "default",
    pattern: "{controller}/{action=Index}/{id?}");
```

## HandleInertiaRequests

We recommend creating a custom HandleInertiaRequests middleware. This middleware is used to handle Inertia shared data on responses. This is helpful for flash messages, auth data, and other state that you want to include on every response. See the [Shared Data](/shared-data.md) documentation for more information.

> [!NOTE]
> This middleware is not required, but it is recommended for the best experience.
> It's worth noting every Inertia response will include the shared data, so it's important to only include the data that you need. You may want to cache heavy queries or make them lazy/optional to avoid performance issues. You can then `JSON.parse` out the `data-page` attribute on the `#app` element to get the data you need from the initial page load.

```csharp
// Program.cs
app.UseInertia();
app.UseMiddleware<CsrfMiddleware>();
```

```csharp
// HandleInertiaRequests.cs
using InertiaCore;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc.ViewFeatures;
using Microsoft.EntityFrameworkCore;
using App.Data;
using App.Models;

namespace App.Middleware;

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

                if (tempData.TryGetValue("error", out var error) && error is not null)
                {
                    // Ensure we only store simple serializable types
                    flash.Add("error", error.ToString() ?? "");
                }
                if (tempData.TryGetValue("success", out var success) && success is not null)
                {
                    // Ensure we only store simple serializable types
                    flash.Add("success", success.ToString() ?? "");
                }
                return flash;
            }
            catch (Exception)
            {
                // If there's any issue with TempData, return empty flash to prevent crashes
                return new Dictionary<string, object>();
            }
        });

        Inertia.Share("auth", () =>
        {
            if (context.User.Identity?.IsAuthenticated == true)
            {
                var userManager = context.RequestServices.GetRequiredService<UserManager<User>>();
                var dbContext = context.RequestServices.GetRequiredService<ApplicationDbContext>();
                var user = userManager.GetUserAsync(context.User).Result;
                if (user != null)
                {
                    // Load the account data separately
                    var account = dbContext.Accounts.Find(user.AccountId);

                    return (object)new
                    {
                        user = new
                        {
                            id = user.Id,
                            first_name = user.FirstName,
                            last_name = user.LastName,
                            email = user.Email,
                            owner = user.Owner,
                            account = new
                            {
                                id = user.AccountId,
                                name = account?.Name
                            }
                        }
                    };
                }
            }
            return (object)new { user = (object?)null };
        });

        await _next(context);
    }
}
```

## Exception Handling

We recommend using the exception handling middleware. This middleware is used to handle 404s and 500-level exceptions. This allows you to return a custom error page for 404s and 500-level exceptions, yielding a better user experience.

> ![NOTE]
> You may wish to remove `HandleExceptionAsync` during development to show let error pages show in modals and rendered by ASP.NET Core.

```csharp
// Program.cs
app.UseInertia();
app.UseMiddleware<ExceptionMiddleware>();
```

```csharp
// ExceptionMiddleware.cs
using InertiaCore;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.Abstractions;
using Microsoft.AspNetCore.Mvc.ViewFeatures;
using Microsoft.AspNetCore.Routing;

namespace App.Middleware;

public class ExceptionMiddleware
{
    private readonly RequestDelegate _next;
    private readonly ILogger<ExceptionMiddleware> _logger;
    private readonly IWebHostEnvironment _env;

    public ExceptionMiddleware(
        RequestDelegate next,
        ILogger<ExceptionMiddleware> logger,
        IWebHostEnvironment env)
    {
        _next = next;
        _logger = logger;
        _env = env;
    }

    public async Task InvokeAsync(HttpContext context)
    {
        try
        {
            await _next(context);

            // Handle 404s
            if (context.Response.StatusCode == 404 && !context.Response.HasStarted)
            {
                await RenderNotFound(context);
            }
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "An unhandled exception occurred");
            await HandleExceptionAsync(context, ex);
        }
    }

    private async Task HandleExceptionAsync(HttpContext context, Exception exception)
    {
        if (context.Response.HasStarted)
        {
            _logger.LogWarning("Response has already started, cannot render error page");
            throw exception;
        }

        context.Response.StatusCode = 500;

        // Clear any existing TempData to prevent serialization issues
        var tempDataFactory = context.RequestServices.GetService<ITempDataDictionaryFactory>();
        if (tempDataFactory != null)
        {
            var tempData = tempDataFactory.GetTempData(context);
            tempData.Clear();
        }

        var errorData = new
        {
            message = _env.IsDevelopment()
                ? exception.Message
                : "An unexpected error occurred. Please try again later.",
            stackTrace = _env.IsDevelopment() ? exception.StackTrace : null
        };

        var result = Inertia.Render("Error/ServerError", errorData);
        await result.ExecuteResultAsync(GetActionContext(context));
    }

    private async Task RenderNotFound(HttpContext context)
    {
        context.Response.StatusCode = 404;

        var result = Inertia.Render("Error/NotFound");
        await result.ExecuteResultAsync(GetActionContext(context));
    }

    private static ActionContext GetActionContext(HttpContext context)
    {
        var routeData = context.GetRouteData() ?? new RouteData();
        var actionDescriptor = new ActionDescriptor();
        return new ActionContext(context, routeData, actionDescriptor);
    }
}

```
