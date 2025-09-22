# Redirects

When making a non-GET Inertia request manually or via a `<Link>` element, you should ensure that you always respond with a proper Inertia redirect response.

For example, if your controller is creating a new user, your "store" endpoint should return a redirect back to a standard `GET` endpoint, such as your user "index" page. Inertia will automatically follow this redirect and update the page accordingly.

```csharp
using Microsoft.AspNetCore.Mvc;
using InertiaCore;

[ApiController]
[Route("api/[controller]")]
public class UsersController : ControllerBase
{
    private readonly IUserService _userService;

    public UsersController(IUserService userService)
    {
        _userService = userService;
    }

    [HttpGet]
    public async Task<IActionResult> Index()
    {
        var users = await _userService.GetAllUsersAsync();
        return Inertia.Render("Users/Index", new { Users = users });
    }

    [HttpPost]
    public async Task<IActionResult> Store([FromBody] CreateUserRequest request)
    {
        if (!ModelState.IsValid)
        {
            return BadRequest(ModelState);
        }

        await _userService.CreateUserAsync(new User
        {
            Name = request.Name,
            Email = request.Email
        });

        return Inertia.Back();
        //
        // return RedirectToAction(nameof(Index));
    }
}

public class CreateUserRequest
{
    [Required]
    [MaxLength(50)]
    public string Name { get; set; }

    [Required]
    [MaxLength(50)]
    [EmailAddress]
    public string Email { get; set; }
}
```

## 303 response code

When redirecting after a `PUT`, `PATCH`, or `DELETE` request, you must use a `303` response code, otherwise the subsequent request will not be treated as a `GET`request. A `303` redirect is very similar to a `302` redirect; however, the follow-up request is explicitly changed to a `GET` request.

If you're using the ASP.NET InertiaCore adapter, all redirects created (including those with `Inertia.Back()`) will automatically be converted to `303` redirects.

```csharp
// You may optionally provide a fallback URL (when referrer is not available) and status code (in case you need a different status code than the default `303`)
return Inertia.Back(fallbackUrl, statusCode);
```

## External redirects

Sometimes it's necessary to redirect to an external website, or even another non-Inertia endpoint in your app while handling an Inertia request. This can be accomplished using a server-side initiated `window.location` visit via the `Inertia.Location()` method.

```csharp
return Inertia.Location(url);
```

The `Inertia.Location()` method will generate a `409 Conflict` response and include the destination URL in the `X-Inertia-Location` header. When this response is received client-side, Inertia will automatically perform a `window.location = url` visit.
