# History encryption

Imagine a scenario where your user is authenticated, browses privileged information on your site, then logs out. If they press the back button, they can still see the privileged information that is stored in the window's history state. This is a security risk. To prevent this, Inertia.js provides a history encryption feature.

## How it works

When you instruct Inertia to encrypt your app's history, it uses the browser's built-in [`crypto` api ](https://developer.mozilla.org/en-US/docs/Web/API/Crypto)to encrypt the current page's data before pushing it to the history state. We store the corresponding key in the browser's session storage. When the user navigates back to a page, we decrypt the data using the key stored in the session storage.

Once you instruct Inertia to clear your history state, we simply clear the existing key from session storage roll a new one. If we attempt to decrypt the history state with the new key, it will fail and Inertia will make a fresh request back to your server for the page data.

History encryption relies on `window.crypto.subtle` which is only available in secure environments (sites with SSL enabled).

## Opting in

History encryption is an opt-in feature. There are several methods for enabling it:

### Global encryption

If you'd like to enable history encryption globally, set the `inertia.history.encrypt` config value to `true`.

You are able to opt out of encryption on specific pages by calling the `Inertia.EncryptHistory()` method before returning the response.

```csharp
Inertia.EncryptHistory(false);
```

### Per-request encryption

To encrypt the history of an individual request, simply call the `Inertia.EncryptHistory()` method before returning the response.

```csharp
Inertia.EncryptHistory();
```

<!-- TODO: Add encrypt middleware for a group of routes -->

### Encrypt middleware

You can also use a middleware to encrypt the history inside of middleware.

```csharp
app.Use((context, next) =>
{
   Inertia.EncryptHistory(false);
   return next();
});
```

<!-- To encrypt a group of routes, you may use InertiaCore's included `EncryptHistoryMiddleware`.

```csharp
app.MapGet("/", () => "Hello World!")
   .UseMiddleware<EncryptHistoryMiddleware>();

// Or using endpoint metadata
app.MapGet("/", [EncryptHistory] () => "Hello World!");
```  -->

## Clearing history

To clear the history state, you can call the `Inertia.ClearHistory()` method before returning the response.

```csharp
Inertia.ClearHistory();
```

Once the response has rendered on the client, the encryption key will be rotated, rendering the previous history state unreadable.

You can also clear history on the client site by calling `router.clearHistory()`.
