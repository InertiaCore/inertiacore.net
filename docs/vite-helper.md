# Vite Helper

A Vite helper class is available to automatically load your generated styles or scripts by simply using the `@Vite.Input("src/main.tsx")` helper. You can also enable HMR when using React by using the `@Vite.ReactRefresh()` helper. This pairs well with the `laravel-vite-plugin` npm package.

To get started with the Vite Helper, you will need to add one more line to the `Program.cs` or `Starup.cs` file.

```csharp
using InertiaCore.Extensions;

[...]

builder.Services.AddViteHelper();

// Or with options (default values shown)

builder.Services.AddViteHelper(options =>
{
    options.PublicDirectory = "wwwroot";
    options.BuildDirectory = "build";
    options.HotFile = "hot";
    options.ManifestFilename = "manifest.json";
});
```

## Examples

---

Here's an example for a TypeScript React app with HMR:

```html
@using InertiaCore @using InertiaCore.Utils
<!DOCTYPE html>
<html>
  <head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title inertia>My App</title>
  </head>
  <body>
    @* This has to go first, otherwise preamble error *@ @Vite.ReactRefresh()
    @await Inertia.Html(Model) @Vite.Input("src/main.tsx")
  </body>
</html>
```

with the corresponding `vite.config.js`, which is recommended to create in the `ClientApp` directory:

```js
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import laravel from "laravel-vite-plugin";

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    laravel({
      input: ["src/main.tsx"],
      publicDirectory: "../wwwroot/",
    }),
    react(),
  ],
  build: {
    emptyOutDir: true,
  },
});
```

---

Here's an example for a TypeScript Vue app with Hot Reload:

```html
@using InertiaCore @using InertiaCore.Utils
<!DOCTYPE html>
<html>
  <head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title inertia>My App</title>
  </head>
  <body>
    @await Inertia.Html(Model) @Vite.Input("src/app.ts")
  </body>
</html>
```

with the corresponding `vite.config.js`, which is recommended to create in the `ClientApp` directory:

```js
import { defineConfig } from "vite";
import vue from "@vitejs/plugin-vue";
import laravel from "laravel-vite-plugin";

export default defineConfig({
  plugins: [
    laravel({
      input: ["src/app.ts"],
      publicDirectory: "../wwwroot/",
      refresh: true,
    }),
    vue({
      template: {
        transformAssetUrls: {
          base: null,
          includeAbsolute: false,
        },
      },
    }),
  ],
  build: {
    emptyOutDir: true,
  },
});
```

---

Here's an example that just produces a single CSS file:

```html
@using InertiaCore @using InertiaCore.Utils
<!DOCTYPE html>
<html>
  <head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  </head>
  <body>
    @await Inertia.Html(Model) @Vite.Input("src/main.scss")
  </body>
</html>
```
