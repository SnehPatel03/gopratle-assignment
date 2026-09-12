# GoPratle – Requirement Posting Flow

A multi-step requirement posting form built with **Next.js**, **MongoDB** (via Mongoose), and **Zod** validation as part of the GoPratle Full-Stack Developer Intern assignment.

## Features

- **3-step wizard form** — Category → Event details → Category-specific preferences
- **Dynamic fields** — Step 3 adapts based on the selected category (Planner / Performer / Crew)
- **Server-side validation** — Request payloads validated with Zod schemas before saving
- **MongoDB storage** — Requirements stored with auto-generated IDs, categorised by type
- **Requirements dashboard** — List all submitted requirements with detail view
- **Responsive UI** — Fully responsive design that works across desktop, tablet, and mobile
- **Card-based layouts** — Modern card UI for requirement details and list items
- **Smooth transitions** — Entrance animations and micro-interactions across all pages

## Tech Stack

| Layer        | Technology                              |
| ------------ | --------------------------------------- |
| Framework    | Next.js 16 (App Router, Turbopack)      |
| Language     | TypeScript                              |
| Database     | MongoDB Atlas + Mongoose                |
| Validation   | Zod (server) + React Hook Form (client) |
| Styling      | Vanilla CSS + Poppins font              |

## Project Structure

```
src/
├── app/
│   ├── page.tsx                    # Home — renders the wizard form
│   ├── layout.tsx                  # Root layout with metadata
│   ├── globals.css                 # Global styles, animations, responsive rules
│   ├── Types/
│   │   └── types.ts                # Shared types, constants, and category options
│   ├── api/
│   │   ├── requierment/
│   │   │   ├── route.ts            # POST (create) + GET (list all)
│   │   │   └── [id]/route.ts       # GET (single requirement)
│   │   └── health/                 # Health check endpoint
│   └── requirements/
│       ├── page.tsx                # Requirements list page
│       └── [id]/page.tsx           # Requirement detail page
├── components/
│   ├── RequirementWorkspace.tsx    # Router component + shared Input/Select
│   ├── RequirementForm.tsx         # Multi-step wizard form
│   ├── RequirementList.tsx         # Requirements dashboard list
│   └── RequirementDetail.tsx       # Single requirement detail view
├── models/
│   ├── Requirement.ts              # Base requirement schema
│   ├── Planner.ts                  # Planner category model
│   ├── Performer.ts                # Performer category model
│   └── Crew.ts                     # Crew category model
└── lib/
    ├── db.ts                       # MongoDB connection helper
    └── validations/
        ├── requirement.schema.ts   # Base Zod schema
        ├── planner.schema.ts       # Planner-specific validation
        ├── performer.schema.ts     # Performer-specific validation
        └── crew.schema.ts          # Crew-specific validation
```

## Getting Started

### Prerequisites

- Node.js 18+
- A MongoDB Atlas cluster (or local MongoDB instance)

### Setup

```bash
# Clone the repository
git clone https://github.com/SnehPatel03/gopratle-assignment.git
cd gopratle-assignment

# Install dependencies
npm install

# Create .env file with your MongoDB credentials
touch .env
```

Add the following to `.env`:

```env
MONGODB_URI=mongodb+srv://<username>:<password>@<cluster>.mongodb.net/<dbname>
```

### Run

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to use the form.

## API Endpoints

| Method | Endpoint               | Description              |
| ------ | ---------------------- | ------------------------ |
| POST   | `/api/requierment`     | Create a new requirement |
| GET    | `/api/requierment`     | List all requirements    |
| GET    | `/api/requierment/:id` | Get a single requirement |
| GET    | `/api/health`          | Health check             |

## Form Flow

1. **Step 1 — Category** — Select Planner, Performer, or Crew (card-based selection with illustrations)
2. **Step 2 — Event Details** — Event name, type, dates, location, venue, budget
3. **Step 3 — Preferences** — Fields adapt based on category:
   - **Planner** — Services needed, guest count, event scale, experience level
   - **Performer** — Performance type, genre, performer count, set duration, equipment
   - **Crew** — Role, crew count, experience level, working hours
4. **Submission** — Data is validated and saved to MongoDB under the selected category

## UI / UX Highlights

- **Staggered entrance animations** — Cards and list items slide in with sequential delays
- **Step transitions** — Form steps animate in with a slide-up fade effect on navigation
- **Hover micro-interactions** — Buttons lift with shadow, list rows shift right, cards scale on hover
- **Mobile-first category cards** — On mobile, category cards switch to a compact horizontal layout with the illustration on the left
- **Card-based detail view** — Requirement details are displayed in distinct cards with icon-accented section headers
- **Colored category badges** — Planner (green), Performer (purple), Crew (brown) pills in the list view
- **Skeleton loading states** — Spinner with descriptive loading text while data is being fetched
