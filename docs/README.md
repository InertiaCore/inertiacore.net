# Installation

Use the following steps to install [InertiaCore](https://github.com/kapi2289/InertiaCore) on your machine.

## Prerequisites

- .NET 6.0 or higher
- Node.js 18.0 or higher

## New Project

You can use one of our starter kits to get started quickly.

```bash
npx @inertiacore/create@latest
```

You will be asked to enter a project name and to select the front-end library you want to use.

This will create a new project with the name you provide.

You can choose between a React, Vue, or Svelte project.

### Run the project

Once you have created the project, you can run it using the following commands.

Run the following command to start the dotnet development server:

```bash
dotnet run
```

In another terminal, run the following command to start the React or Vue development server:

```bash
cd ClientApp
npm run dev
```

This will start the development server and you can access the application at `http://localhost:5266` or `https://localhost:7266` if you are using HTTPS.

## Existing Project

You need to add few lines to the `Program.cs` or `Starup.cs` file.

```csharp
using InertiaCore.Extensions;

[...]

builder.Services.AddInertia();

[...]

app.UseInertia();
```

Create a file `/Views/App.cshtml`.

```html
@using InertiaCore
<!DOCTYPE html>
<html>
  <head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title inertia>My App</title>
  </head>
  <body>
    @await Inertia.Html(Model)

    <script src="/js/app.js"></script>
  </body>
</html>
```

You can change the root view file using:

```csharp
builder.Services.AddInertia(options =>
{
    options.RootView = "~/Views/Main.cshtml";
});
```
