# Merging props

By default, Inertia overwrites props with the same name when reloading a page. However, there are instances, such as pagination or infinite scrolling, where that is not the desired behavior. In these cases, you can merge props instead of overwriting them.

## Server side

To specify that a prop should be merged, you can use the `Inertia.Merge()` or `Inertia.DeepMerge()` methods on the prop value.

Use `Merge` when merging simple arrays, and `DeepMerge` when working with nested objects that contain arrays or complex structures, such as pagination objects.

Shallow Merge:

```csharp
app.MapGet("/items", (HttpContext context) =>
{
    // Static array of tags
    var allTags = new[] {
        "ASP.NET Core", "React", "Vue", "Tailwind", "Inertia",
        "C#", "JavaScript", "TypeScript", "Docker", "Vite"
    };

    // Get chunk of tags by page
    var page = int.Parse(context.Request.Query["page"].FirstOrDefault() ?? "1");
    var perPage = 5;
    var offset = (page - 1) * perPage;
    var tags = allTags.Skip(offset).Take(perPage).ToArray();

    return Inertia.Render("Tags/Index", new
    {
        tags = Inertia.Merge(tags)
    });
});
```

Deep Merge:

```csharp
app.MapGet("/users", (HttpContext context, UserService userService) =>
{
    var page = int.Parse(context.Request.Query["page"].FirstOrDefault() ?? "1");
    var perPage = int.Parse(context.Request.Query["per_page"].FirstOrDefault() ?? "10");

    return Inertia.Render("Users/Index", new
    {
        results = Inertia.DeepMerge(userService.GetPaginated(page, perPage))
    });
});
```

During the merging process, if the value is an array, the incoming items will be _appended_ to the existing array, not merged by index. However, you may chain the `matchOn` method to determine how existing items should be matched and updated.

```csharp
Inertia.Render("Users/Index", new
{
    users = Inertia.DeepMerge(users).MatchOn("data.id")
});
```

In this example, Inertia will iterate over the `users.data` array and attempt to match each item by its `id` field. If a match is found, the existing item will be replaced. If no match is found, the new item will be appended.

You may also pass an array of keys to `matchOn` to specify multiple keys for matching.

## Client side

On the client side, Inertia detects that this prop should be merged. If the prop returns an array, it will append the response to the current prop value. If it's an object, it will merge the response with the current prop value. If you have opted to `DeepMerge`, Inertia ensures a deep merge of the entire structure.

## Combining with deferred props

You can also combine [deferred props](/deferred-props) with mergeable props to defer the loading of the prop and ultimately mark it as mergeable once it's loaded.

```csharp
app.MapGet("/users", (HttpContext context, UserService userService) =>
{
    var page = int.Parse(context.Request.Query["page"].FirstOrDefault() ?? "1");
    var perPage = int.Parse(context.Request.Query["per_page"].FirstOrDefault() ?? "10");

    return Inertia.Render("Users/Index", new
    {
        results = Inertia.Defer(() => userService.GetPaginated(page, perPage)).DeepMerge()
    });
});
```

## Resetting props

On the client side, you can indicate to the server that you would like to reset the prop. This is useful when you want to clear the prop value before merging new data, such as when the user enters a new search query on a paginated list.

The `reset` request option accepts an array of the props keys you would like to reset.

```js
// framework: vue
router.reload({
  reset: ["results"],
  // ...
});
```

```js
// framework: react
router.reload({
  reset: ["results"],
  // ...
});
```

```js
// framework: svelte
router.reload({
  reset: ["results"],
  // ...
});
```
