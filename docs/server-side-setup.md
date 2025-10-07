# Server-side setup

The first step when installing Inertia is to configure your server-side framework. InertiaCore provides a third-party server-side adapter for [.NET](https://dotnet.microsoft.com/). For other frameworks, please see the [community adapters](https://inertiajs.com/community-adapters).

InertiaCore is fine-tuned for .NET, so the documentation examples on this website utilize ASP.NET Core. For examples of using Inertia with other server-side frameworks, please refer to the framework specific documentation maintained by that adapter.

## .NET project templates

If you want a batteries-included experience, we recommend using one of the project templates the [quick start guide](/core/quick-start.md).

.NET project templates for InertiaCore provide out-of-the-box scaffolding for new Inertia applications. These templates are the absolute fastest way to start building a new Inertia project using ASP.NET Core with Vue, React, or other frontend frameworks. However, if you would like to manually install Inertia into your application, please consult the documentation below.

## Install dependencies

First, install the Inertia server-side adapter using the NuGet package manager.

```bash
# Release version
dotnet add package AspNetCore.InertiaCore

# Preview version
dotnet add package InertiaCorePreview --prerelease
```

## Root template

Next, setup the root template that will be loaded on the first page visit to your application. This template should include your site's CSS and JavaScript assets, along with the Inertia mounting point. We are using the [Vite Helper](/core/vite-helper.md) to automatically load the JavaScript assets.

.NET (Razor):

```cshtml
@using InertiaCore
@using InertiaCore.Utils
<!DOCTYPE html>
<html>
  <head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    @await Inertia.Head(Model)
  </head>
  <body>
    @await Inertia.Html(Model)
    @Vite.Input("src/app.ts")
  </body>
</html>
```

For React applications using Vite, ensure your bundler is configured with React Refresh for optimal development experience.

The `@Vite.Input()` helper renders a `<div>` element with an `id` of `app`. This element serves as the mounting point for your JavaScript application.

<!-- You may customize the `id` by passing a different value to the helper. -->

```cshtml
@using InertiaCore
@using InertiaCore.Utils
<!DOCTYPE html>
<html>
  ...
  <body>
    @Vite.ReactRefresh()
    @await Inertia.Html(Model)
    @Vite.Input("src/App.tsx")
  </body>
</html>
```

<!-- TODO: Add this back in once the Vite Helper support is updated -->
<!-- If you change the `id` of the root element, be sure to update it [client-side](/client-side-setup#defining-a-root-element) as well. -->

By default, InertiaCore will assume your root template is named `App.cshtml`. If you would like to use a different root view, you can configure it in your application startup.

## App Startup

Next we need to setup the Inertia and Vite services. Add the Inertia and Vite services to your application's request pipeline in `Program.cs` or `Startup.cs`. We also recommend adding the Vite Helper:

```csharp
var builder = WebApplication.CreateBuilder(args);

// Add Inertia services
builder.Services.AddInertia();
builder.Services.AddViteHelper();

var app = builder.Build();

// Configure the HTTP request pipeline
app.UseStaticFiles();
app.UseRouting();

// Add Inertia middleware
app.UseInertia();

app.MapControllerRoute(
    name: "default",
    pattern: "{controller=Home}/{action=Index}/{id?}");

app.Run();
```

The Inertia middleware provides configuration options for setting your [asset version](/asset-versioning), as well as methods for defining [shared data](/shared-data).

For the best possible experience, you may also want to visit the recommended middleware setup section in the [Middleware Recommendations](/core/middleware-recommendations.md) documentation.

## Creating responses

That's it, you're all ready to go server-side! Now you're ready to start creating Inertia [pages](/pages) and rendering them via [responses](/responses).

```csharp
using InertiaCore;

public class EventsController : Controller
{
    public IActionResult Show(int id)
    {
        var eventItem = _context.Events.Find(id);

        return Inertia.Render("Event/Show", new
        {
            Event = new
            {
                eventItem.Id,
                eventItem.Title,
                eventItem.StartDate,
                eventItem.Description
            }
        });
    }
}
```
