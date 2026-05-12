# Contributing

Thank you for considering contributing to this project. Every contribution plays an important role in improving the quality and sustainability of this system. Before contributing, please ensure that your changes align with the project’s structure, follow best practices, and maintain consistency with the existing codebase. Respectful collaboration, clear communication, and thoughtful feedback are highly appreciated.

## Technologies Used
This project uses Supabase as its backend infrastructure, handling:
- Authentication
- Database
- File Storage
- Real-time

On the frontend, the project is built with React, and database access is managed through Prisma ORM for type-safe queries and schema management.
Prisma acts as the bridge between the application and the Supabase PostgreSQL database.

The following are the tech stack used:
- Node.js
- Vite
- React
- Tailwind CSS
- shadcn
  
To contribute please follow the steps:
1. Fork the repository
2. Clone your fork

```bash
git clone https://github.com/your-username/your-repo.git
cd your-repo-name
```

3. Create a .env file in the root directory:

```bash
DATABASE_URL="your_supabase_postgres_connection_string"
```
4. Install the packages
```bash
npm install
```
5. Run prisma client

```bash
npx prisma generate
```
6. Run database migration to your database
```bash
npx prisma migrate dev --name init
```

7. Build the application
```bash
npm run build
```
8. Run the development server
```bash
npm run dev
```


## Branch Naming

Use descriptive branch names:

* `username_feature/feature_name`
* `username_fix/fix_short_description`
* `username_refactor/refactor_shor_description`


## Commit Messages

Write clear commit messages.

Examples:

```bash
feat: add applicant filtering
fix: resolve realtime subscription issue
refactor: simplify dashboard hooks
```

## Pull Requests

Before submitting a pull request:

* Ensure the project builds successfully
* Test your changes
* Keep pull requests focused and small
* Include screenshots for UI changes when applicable


## Code Style

* Use consistent formatting
* Follow existing project structure
* Prefer reusable components
* Keep functions readable and maintainable


## Reporting Issues

When creating an issue, include:

* Steps to reproduce
* Expected behavior
* Actual behavior
* Screenshots or logs if applicable


## Questions

If you have questions or suggestions, feel free to open an issue or discussion.

Thank you for contributing. 🙌
