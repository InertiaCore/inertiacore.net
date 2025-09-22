# Asset versioning

One common challenge when building single-page apps is refreshing site assets when they've been changed. Thankfully, Inertia makes this easy by optionally tracking the current version of your site assets. When an asset changes, Inertia will automatically make a full page visit instead of a XHR visit on the next request.

## Configuration

To enable automatic asset refreshing, you need to tell Inertia the current version of your assets. This can be any arbitrary string (letters, numbers, or a file hash), as long as it changes when your assets have been updated.

Automatically, your application's asset version is picked up from the Vite Helper.

```csharp
builder.Services.AddViteHelper();
```

Alternatively, the asset version can be provided manually using the `Inertia.Version()` method.

```csharp
app.use(async (context, next) => {
    Inertia.Version(() => "1234567890");
    await next();
});
```

## Cache busting

Asset refreshing in Inertia works on the assumption that a hard page visit will trigger your assets to reload. However, Inertia doesn't actually do anything to force this. Typically this is done with some form of cache busting. For example, appending a version query parameter to the end of your asset URLs.

With modern build tools like Vite, asset versioning is often done automatically. You can also implement cache busting by including version hashes in your asset filenames or by appending version query parameters.

## Manual refreshing

If you want to take asset refreshing into your control, you can return a fixed value from the `Version` method in the `HandleInertiaRequestsMiddleware`. This disables InertiaCore's automatic asset versioning.

For example, if you want to notify users when a new version of your frontend is available, you can still expose the actual asset version to the frontend by including it as [shared data](/shared-data).

```csharp
app.use(async (context, next) => {
    Inertia.Version(null);
    Inertia.Share("version", () => "1234567890");
    await next();
});
```

On the frontend, you can watch the `version` property and show a notification when a new version is detected.
