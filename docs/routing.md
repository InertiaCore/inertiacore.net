# Routing

## Defining routes

When using Inertia, all of your application's routes are defined server-side. This means that you don't need Vue Router or React Router. Instead, you can simply define ASP.NET Core routes and return [Inertia responses](/responses) from those routes.

## Shorthand routes

If you have a [page](/pages) that doesn't need a corresponding controller method, like an "FAQ" or "about" page, you can route directly to a component using minimal controller actions with attribute routing.

```csharp
[Route("[controller]")]
public class HomeController : Controller
{
    [HttpGet("/about")]
    public IActionResult About()
    {
        return Inertia.Render("About");
    }

    [HttpGet("/faq")]
    public IActionResult FAQ()
    {
        return Inertia.Render("FAQ");
    }
}
```

<!-- TODO: Build a route generator for typescript and .NET -->
<!-- ## Generating URLs

Some server-side frameworks allow you to generate URLs from named routes. However, you will not have access to those helpers client-side. Here are a couple ways to still use named routes with Inertia.

The first option is to generate URLs server-side and include them as props. Notice in this example how we're passing the `edit_url` and `create_url` to the `Users/Index` component.

```csharp
[ApiController]
[Route("[controller]")]
public class UsersController : Controller
{
    private readonly IUrlHelper _urlHelper;
    private readonly ApplicationDbContext _context;

    public UsersController(IUrlHelper urlHelper, ApplicationDbContext context)
    {
        _urlHelper = urlHelper;
        _context = context;
    }

    [HttpGet]
    public IActionResult Index()
    {
        var users = _context.Users.Select(user => new
        {
            user.Id,
            user.Name,
            user.Email,
            EditUrl = _urlHelper.Action(nameof(Edit), "Users", new { id = user.Id })
        }).ToList();

        return Inertia.Render("Users/Index", new
        {
            Users = users,
            CreateUrl = _urlHelper.Action(nameof(Create), "Users")
        });
    }

    [HttpGet("{id}/edit")]
    public IActionResult Edit(int id)
    {
        // Edit implementation
    }

    [HttpGet("create")]
    public IActionResult Create()
    {
        // Create implementation
    }
}
```

For .NET applications, you can expose your routes to the client-side by creating a route helper service that generates URLs based on your ASP.NET Core routes. With attribute routing, you can leverage named routes:

```csharp
[Route("[controller]")]
public class UsersController : Controller
{
    [HttpGet("create", Name = "users.create")]
    public IActionResult Create()
    {
        return Inertia.Render("Users/Create");
    }

    [HttpPost(Name = "users.store")]
    public IActionResult Store(UserViewModel model)
    {
        // Store implementation
    }
}
```

You can then create a service to expose these named routes to JavaScript, or use a library like [AspNetCore.RouteJs](https://github.com/danielearwicker/RouteJs) which provides similar functionality:

```html
<Link :href="route('users.create')">Create User</Link>
```

When [server-side rendering](/server-side-rendering) is enabled, ensure your route definitions are available in both client and server contexts. -->

## Customizing the Page URL

The [page object](/the-protocol#the-page-object) includes a `url` that represents the current page's URL. By default, the .NET adapter resolves this using the request path and query string, returning a relative URL.

If you need to customize how the URL is resolved, you can configure it in middleware:

```csharp
// Add services
app.use((context, next)=>{
    Inertia.ResolveUrlUsing(()=> {
        return context.Request.Path + context.Request.QueryString;
    })
    return next();
});
```
