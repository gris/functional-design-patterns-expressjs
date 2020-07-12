# Impressions

The book is strucutred in a bottom-up way. You start the book with nothing but an empty folder and you keep adding the code to the project as you progress in along the chapters.

I really liked the pedagogy. The author doesn't use an npm package without first trying to achieve the same objective writing a piece of code.
Also he doesn't create abstractions without first trying to go without it.

For me this really makes this book stand out from a simple distilling of documentation for express.js and most used packages.
The author focuses on grasping the why's instead of just trying to teach you how.

Here is a brief description of the chapters:

1. How Servers Talk
The book starts explaining how the HTTP protocol works. It uses the good ol' `telnet` command line application to make the point clearer.

2. Responding to Requests
In this chapter the author shows how a web server would be without using express. Just using the native Node.js capabilities.

3. Express Router
This chapter explains the router pattern, and then uses the express router.

4. Working with Request Bodies
As the title says, this one focuses on parsing request bodies, using the body-parser package.

5. Middleware
This one teaches the middleware pattern to reuse code and separate responsibilities.

6. Common Middleware
This one focuses on common middlewares used alongside express.js

7. Basic Authentication
Teaches the difference between authentication and authorization, and how to use the Basic authentication method

8. Authentication with JSON Web Tokens
Teaches how to use JWT to reduce payload size and reduce vulnerability surface area.

9. Authorization Design Patterns
The book ends by teaching a few patterns to use authorization, separating between policies and enforcers.

Conclusions: If you already are familiar with Node.js, this book will be interesting to learn more about the underlying design patterns.
Front-end developers that are starting to use Node.js now will really benefit from this book.
