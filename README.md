# Memento

A local flashcard app for creating courses, learning new cards, and reviewing them with spaced repetition (SM-2). Data is stored in a SQLite database on your machine.

## Prerequisites

- [Bun](https://bun.sh/) (latest version recommended)

On Windows, `better-sqlite3` may require [Visual Studio Build Tools](https://visualstudio.microsoft.com/visual-cpp-build-tools/) if prebuilt binaries are not available for your environment.

## Local setup

1. **Clone the repository**

   ```bash
   git clone https://github.com/kualeifarne/memento
   cd memento
   ```

2. **Install dependencies**

   ```bash
   bun install
   ```
3. **Configure environment variables**

   Copy the example env file to `.env` in the project root:

   ```bash
   cp .env.example .env
   ```

   On Windows (PowerShell):

   ```powershell
   Copy-Item .env.example .env
   ```

   The `.env` file must contain:

   ```env
   DATABASE_URL="file:./dev.db"
   ```

   This tells Prisma to use a SQLite database file named `dev.db` in the project root. The file is created automatically when you run migrations.

   > **Note:** `.env` is not committed to git. You must create it on each machine where you run the project.

4. **Set up the database**

   Apply migrations and generate the Prisma client:

   ```bash
   bun run db:migrate
   ```

   If you see `The datasource.url property is required`, your `.env` file is missing or not in the project root. Repeat step 3, then run the command again from the `memento` folder.

5. **Populate the database**

   The seed file at `prisma/seed.ts` loads a **React Cert Prep** course with 64 flashcards across 10 decks (JavaScript, JSX, components, hooks, React Router, TypeScript, and more).

   ```bash
   bun run db:seed
   ```

   Re-running the seed replaces the existing **React Cert Prep** course with a fresh copy from `prisma/seed.ts`. Your learn and review progress for that course is reset.

6. **Start the development server**

   ```bash
   bun run dev
   ```

   Open [http://localhost:3000](http://localhost:3000) in your browser.



## Using the app

- **Home** (`/`) — View your courses and open **Learn** or **Review** sessions.
- **New course** (`/courses/new`) — Create a course with decks and cards.
- **Course detail** (`/courses/[id]`) — Edit decks and cards for a course.
- **Learn** (`/learn`) — Study cards you have not mastered yet.
- **Review** (`/review`) — Review cards due for spaced repetition.

All progress (learn state, review schedules, and review history) is saved to the local SQLite database.

## Useful commands


| Command                   | Description                                |
| ------------------------- | ------------------------------------------ |
| `bun run dev`             | Start the development server               |
| `bun run build`           | Build for production                       |
| `bun run start`           | Run the production build                   |
| `bun run lint`            | Run ESLint                                 |
| `bun run db:migrate`      | Apply schema changes during development    |
| `bun run db:seed`         | Populate the database from `prisma/seed.ts` |
| `bun run db:studio`       | Open a GUI to browse and edit the database |




## Tech stack

- [Next.js](https://nextjs.org/) (App Router)
- [Prisma](https://www.prisma.io/) with SQLite (`better-sqlite3`)
- [React](https://react.dev/) and [Tailwind CSS](https://tailwindcss.com/)
- [Bun](https://bun.sh/) for package management and scripts

