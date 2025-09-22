# Authentication

One of the benefits of using Inertia is that you don't need a special authentication system such as OAuth to connect to your data provider (API). Also, since your data is provided via your controllers, and housed on the same domain as your JavaScript components, you don't have to worry about setting up CORS.

Rather, when using Inertia, you can simply use whatever authentication system your server-side framework ships with. Typically, this will be a session-based authentication system such as ASP.NET Core Identity, or cookie-based authentication systems built into ASP.NET Core.

ASP.NET Core provides several authentication options including ASP.NET Core Identity, JWT tokens, and OAuth providers. The Inertia.NET adapter works seamlessly with these authentication systems, automatically handling user context and authentication state across your application.