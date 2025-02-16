# Server-side rendering

If you want to enable SSR in your Inertia app, remember to add `Inertia.Head()` to your layout:

```html
@using InertiaCore
<!DOCTYPE html>
<html>
  <head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title inertia>My App</title>

    @await Inertia.Head(Model)
  </head>
  <body>
    @await Inertia.Html(Model)

    <script src="/js/app.js"></script>
  </body>
</html>
```

and enable the SSR option:

```csharp
builder.Services.AddInertia(options =>
{
    options.SsrEnabled = true;

    // You can optionally set a different URL than the default.
    options.SsrUrl = "http://127.0.0.1:13714/render"; // default
});
```
