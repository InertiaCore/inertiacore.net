# Merging props

Inertia overwrites props with the same name when reloading a page. However, you may need to merge new data with existing data instead. For example, when implementing a "load more" button for paginated results.

Prop merging only works during [partial reloads](/partial-reloads). Full page visits will always replace props entirely, even if you've marked them for merging.

## Merge methods

To merge a prop instead of overwriting it, you may use the `Inertia::merge()` method when returning your response.

```csharp
var allTags = new[] {
    "ASP.NET Core", "React", "Vue", "Tailwind", "Inertia",
    "C#", "JavaScript", "TypeScript", "Docker", "Vite"
};

var page = int.Parse(context.Request.Query["page"].FirstOrDefault() ?? "1");
var perPage = 5;
var offset = (page - 1) * perPage;
var tags = allTags.Skip(offset).Take(perPage).ToArray();

return Inertia.Render("Tags/Index", new
{
    tags = Inertia.Merge(tags)
});
```

The `Inertia::merge()` method will append new items to existing arrays at the root level. You may change this behavior to prepend items instead.

```csharp
// Append at root level (default)...
Inertia.Merge(items);
// Prepend at root level...
Inertia.Merge(items).Prepend();
```

For more precise control, you can target specific nested properties for merging while replacing the rest of the object.

```csharp
// Only append to the 'data' array, replace everything else...
Inertia.Merge(User::paginate()).Append('data');
// Prepend to the 'messages' array...
Inertia.Merge(chatData).Prepend('messages');
```

You can combine multiple operations and target several properties at once.

```csharp

Inertia.Merge(forumData).Append('posts').Prepend('announcements');
// Target multiple properties...
Inertia.Merge(dashboardData).Append(['notifications', 'activities']);
```

On the client side, Inertia handles all the merging automatically according to your server-side configuration.

## Matching items

When merging arrays, you may use the `matchOn` parameter to match existing items by a specific field and update them instead of appending new ones.

```csharp
// Match posts by ID, update existing ones...
Inertia.Merge(postData).Append('data', matchOn: 'id');
// Multiple properties with different match fields...
Inertia.Merge(complexData).Append(['users.data' => 'id', 'messages' => 'uuid']);
```

In the first example, Inertia will iterate over the `data` array and attempt to match each item by its `id` field. If a match is found, the existing item will be replaced. If no match is found, the new item will be appended.

## Deep merge

Instead of specifying which nested paths should be merged, you may use `Inertia.DeepMerge()` to ensure a deep merge of the entire structure.

```csharp

app.MapGet("/chat", (HttpContext context) =>
{
    var chatData = [
        'messages' => [
            ['id' => 4, 'text' => 'Hello there!', 'user' => 'Alice'],
            ['id' => 5, 'text' => 'How are you?', 'user' => 'Bob'],
        ],
    ];
    return Inertia.Render("Chat", new
    {
        chat = Inertia.DeepMerge(chatData)->MatchOn('messages.id'),
    });
});
```

> ![NOTICE] `Inertia.DeepMerge()` was introduced before `Inertia.Merge()` had support for prepending and targeting nested paths. In most cases, `Inertia.Merge()` with its append and prepend methods should be sufficient.

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

## Client side visits

You can also merge props directly on the client side without making a server request using [client side visits](/manual-visits#client-side-visits). Inertia provides [prop helper methods](/manual-visits#prop-helpers) that allow you to append, prepend, or replace prop
values.

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
