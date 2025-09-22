# Responses

## Creating responses

Creating an Inertia response is simple. To get started, invoke the `Inertia::render()` method within your controller or route, providing both the name of the [JavaScript page component](/pages) that you wish to render, as well as any properties (data) for the page.

In the example below, we will pass a single property (`event`) which contains four attributes ( `id`, `title`, `start_date` and `description`) to the `Event/Show` page component.

```csharp
using InertiaCore;

[ApiController]
public class EventsController : ControllerBase
{
    public IActionResult Show(int id)
    {
        var eventItem = eventService.GetEvent(id);

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

To ensure that pages load quickly, only return the minimum data required for the page. Also, be aware that all data returned from the controllers will be visible client-side, so be sure to omit sensitive information.

## Properties

To pass data from the server to your page components, you can use properties. You can pass various types of values as props, including primitive types, arrays, objects, and several .NET-specific types that are automatically resolved:

```csharp
using InertiaCore;
using Microsoft.AspNetCore.Mvc;

public class DashboardController : ControllerBase
{
    public IActionResult Index()
    {
        return Inertia.Render("Dashboard", new
        {
            // Primitive values
            Title = "Dashboard",
            Count = 42,
            Active = true,
            // Objects and arrays
            Settings = new { Theme = "dark", Notifications = true },
            // Entity Framework models
            User = userService.GetCurrentUser(), // EF Core entity
            Users = userService.GetAllUsers(), // List/IEnumerable
            // DTOs and custom objects
            Profile = new UserProfileDto(userService.GetCurrentUser()),
            // Anonymous objects
            Data = new { Key = "value" },
            // Computed properties using functions
            Timestamp = () => DateTimeOffset.UtcNow.ToUnixTimeSeconds()
        });
    }
}
```

<!-- TODO: Verify this -->
<!-- TODO: Enable MergeProps and MergeStrategies -->
<!-- Entity Framework models and collections are automatically serialized to JSON. Custom objects implementing `IConvertible` or having appropriate properties are serialized using System.Text.Json.

## IInertiaProperty interface

When passing props to your components, you may want to create custom classes that can transform themselves into the appropriate data format. While .NET's standard serialization simply converts objects to JSON, Inertia offers the more powerful `IInertiaProperty` interface for context-aware transformations.

This interface requires a `ToInertiaProperty` method that receives a `PropertyContext` object containing the property key (`context.Key`), all props for the page (`context.Props`), and the HTTP context (`context.HttpContext`).

```csharp
using InertiaCore;

public class UserAvatar : IInertiaProperty
{
    private readonly User _user;
    private readonly int _size;

    public UserAvatar(User user, int size = 64)
    {
        _user = user;
        _size = size;
    }

    public object ToInertiaProperty(PropertyContext context)
    {
        return !string.IsNullOrEmpty(_user.Avatar)
            ? $"/storage/{_user.Avatar}"
            : $"https://ui-avatars.com/api/?name={Uri.EscapeDataString(_user.Name)}&size={_size}";
    }
}
```

Once defined, you can use this class directly as a prop value.

```csharp
return Inertia.Render("Profile", new
{
    User = user,
    Avatar = new UserAvatar(user, 128)
});
```

The `PropertyContext` gives you access to the property key, which enables powerful patterns like merging with shared data.

```csharp
using InertiaCore;

public class MergeWithShared : IInertiaProperty
{
    private readonly string[] _items;

    public MergeWithShared(params string[] items)
    {
        _items = items ?? Array.Empty<string>();
    }

    public object ToInertiaProperty(PropertyContext context)
    {
        // Access the property key to get shared data
        var shared = Inertia.GetShared<string[]>(context.Key) ?? Array.Empty<string>();

        // Merge with the new items
        return shared.Concat(_items).ToArray();
    }
}

// Usage
Inertia.Share("notifications", new[] { "Welcome back!" });
return Inertia.Render("Dashboard", new
{
    Notifications = new MergeWithShared("New message received")
    // Result: ["Welcome back!", "New message received"]
});
```

## IInertiaProperties interface

In some situations you may want to group related props together for reusability across different pages. You can accomplish this by implementing the `IInertiaProperties` interface.

This interface requires a `ToInertiaProperties` method that returns a dictionary of key-value pairs. The method receives a `RenderContext` object containing the component name (`context.Component`) and HTTP context (`context.HttpContext`).

```csharp
using InertiaCore;
using Microsoft.AspNetCore.Authorization;

public class UserPermissions : IInertiaProperties
{
    private readonly User _user;
    private readonly IAuthorizationService _authorizationService;

    public UserPermissions(User user, IAuthorizationService authorizationService)
    {
        _user = user;
        _authorizationService = authorizationService;
    }

    public async Task<IDictionary<string, object>> ToInertiaPropertiesAsync(RenderContext context)
    {
        var canEdit = await _authorizationService.AuthorizeAsync(_user, "edit");
        var canDelete = await _authorizationService.AuthorizeAsync(_user, "delete");
        var canPublish = await _authorizationService.AuthorizeAsync(_user, "publish");

        return new Dictionary<string, object>
        {
            ["canEdit"] = canEdit.Succeeded,
            ["canDelete"] = canDelete.Succeeded,
            ["canPublish"] = canPublish.Succeeded,
            ["isAdmin"] = _user.IsInRole("admin")
        };
    }
}
```

You can use these prop classes directly in the `Render()` method.

```csharp
public async Task<IActionResult> Index([FromServices] UserPermissions permissions)
{
    return await Inertia.RenderAsync("UserProfile", permissions);
}
```

You can also combine multiple prop classes with other props:

```csharp
public async Task<IActionResult> Index([FromServices] UserPermissions permissions)
{
    return await Inertia.RenderAsync("UserProfile", new
    {
        User = userService.GetCurrentUser()
    }, permissions);
}
```

## Root template data

There are situations where you may want to access your prop data in your application's root Razor view. For example, you may want to add a meta description tag, Twitter card meta tags, or Facebook Open Graph meta tags. You can access this data via the `ViewData["Page"]` variable.

```html
@{ var page = ViewData["Page"] as dynamic; }
<meta name="twitter:title" content="@page.Props.Event.Title" />
```

Sometimes you may even want to provide data to the root template that will not be sent to your JavaScript page component. This can be accomplished by invoking the `WithViewData` method.

```csharp
return Inertia.Render("Event", new { Event = eventItem })
    .WithViewData(new { Meta = eventItem.Meta });
```

After invoking the `WithViewData` method, you can access the defined data as you would typically access Razor view data.

```html
<meta name="description" content="@ViewData["Meta"]">
``` -->

## Maximum response size

To enable client-side history navigation, all Inertia server responses are stored in the browser's history state. However, keep in mind that some browsers impose a size limit on how much data can be saved within the history state.

For example, [Firefox](https://developer.mozilla.org/en-US/docs/Web/API/History/pushState) has a size limit of 16 MiB and throws a `NS_ERROR_ILLEGAL_VALUE` error if you exceed this limit. Typically, this is much more data than you'll ever practically need when building applications.
