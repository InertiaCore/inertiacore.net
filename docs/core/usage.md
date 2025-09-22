# Usage

InertiaCore is a server-side adapter for Inertia.js. It allows you to use Inertia.js with ASP.NET Core.

It essentially allows you to use a front-end framework (React, Vue, Svelte) as if it were a Razor view, but maintain the SPA experience. It dramatically simplifies the process of building a modern web application with a modern front-end framework paired with a server-side framework.

## Routes

To pass data to a page component, use `Inertia.Render()`.

```csharp
    public async Task<IActionResult> Index()
    {
        var posts = await _context.Posts.ToListAsync();

        var data = new
        {
            Posts = posts,
        };

        return Inertia.Render("Posts", data);
    }
```

To make a form endpoint, remember to add `[FromBody]` to your model parameter, because the request data is passed using
JSON.

```csharp
    [HttpPost]
    public async Task<IActionResult> Create([FromBody] Post post)
    {
        if (!ModelState.IsValid)
        {
            // The validation errors are passed automatically.
            return await Index();
        }

        _context.Add(post);
        await _context.SaveChangesAsync();

        return RedirectToAction("Index");
    }
```

# Features

## Shared data

You can add some shared data to your views using for example middlewares:

```csharp
using InertiaCore;

[...]

app.Use(async (context, next) =>
{
    var userId = context.Session.GetInt32("userId");

    Inertia.Share("auth", new
    {
        UserId = userId
    });

    // Or

    Inertia.Share(new Dictionary<string, object?>
    {
        ["auth"] => new
        {
            UserId = userId
        }
    });
});
```

## Async Lazy Props

You can use async lazy props to load data asynchronously in your components. This is useful for loading data that is not needed for the initial render of the page.

```csharp

// simply use the LazyProps the same way you normally would, except pass in an async function

    public async Task<IActionResult> Index()
    {
        var posts = new LazyProp(async () => await _context.Posts.ToListAsync());

        var data = new
        {
            Posts = posts,
        };

        return Inertia.Render("Posts", data);
    }
```
