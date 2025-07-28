# Streak Trackr

An elegant and minimalist application designed to help you build and maintain positive habits by tracking your streaks. Built on the science of consistency, this tool helps you visualize your progress and understand the power of small, daily actions.

## Understanding the Engine of Personal Growth

Lasting change begins with understanding the hidden engine that drives our behavior: our habits. This tool is built upon the foundational ideas from psychology and bestselling authors that explain how consistency transforms us over time. It's designed to help you apply these principles and see them work in your own life.

## Core Features

- **Create & Manage Streaks:** Easily add new habits you want to track.
- **Daily Check-ins:** Mark your habit as complete for the day with a single click.
- **Visual Progress:** See your current streak and longest streak for each habit.
- **Streak History:** A calendar view (/history/[id]) shows your day-by-day consistency for each habit.
- **Forgiveness Included:** Life happens. A built-in 3-day cushion means your streak won't break if you miss a day or two.
- **Secure Authentication:** Uses NextAuth.js for secure sign-in, keeping your data private.
- **The "Why" Page:** A dedicated page (/why) explaining the psychological principles (The Compound Effect, Atomic Habits, etc.) that make streak tracking effective.
- **Light & Dark Mode:** A sleek, modern UI that adapts to your system's theme.

## Technology Stack

This project is built with a modern, type-safe stack:

- Framework: Next.js (with App Router)
- Language: TypeScript
- API Layer: tRPC (for end-to-end type-safe APIs)
- ORM: Drizzle
- Authentication: NextAuth.js
- Database: Designed for PostgreSQL, but adaptable via ORM.
- Styling: Tailwind CSS
- UI Components: shadcn/ui

## Getting Started

To get a local copy up and running, follow these simple steps.

### Prerequisites

- Node.js v22
- pnpm
- A PostgreSQL database (or you can adapt schema.prisma for another database like SQLite)

### Installation & Setup

1. Clone the repository:
   ```
   bash git clone https://github.com/ARoyyanF/streak-trackr.git
   cd streak-trackr
   ```
2. Install dependencies:
   ```bash
   pnpm install
   ```
3. Set up environment variables:  
   Create a `.env` file in the root of the project referring to `.env`.example file

4. Push the database schema:  
   This command will sync your schema with your database.
   ```bash
   pnpm db:push
   ```
5. Run the development server:
   ```bash
   pnpm dev
   ```
6. Open http://localhost:3000 with your browser to see the result.

## Acknowledgements

This project's philosophy is heavily inspired by the work of:

- James Clear, "Atomic Habits"
- Darren Hardy, "The Compound Effect"
- Charles Duhigg, "The Power of Habit"
