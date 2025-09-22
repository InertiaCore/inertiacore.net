# Quick Start

Use the following steps to get up and running with a fresh project using [InertiaCore](https://github.com/kapi2289/InertiaCore). If you would like to install InertiaCore into an existing project, please refer to the [installation instructions](/server-side-setup.md).

If you are unfamiliar with InertiaCore, please refer to the [Introduction](/index.md) page.

## Prerequisites

- .NET 6.0 or higher
- Node.js 18.0 or higher

## New Project

You can use one of our starter kits to get started quickly.

```bash
npm create inertiacore@latest
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

If you are looking to install InertiaCore into an existing project, please refer to the [installation instructions](/server-side-setup.md).
