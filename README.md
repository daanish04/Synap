# Synap - Knowledge Management Platform

> **Capture. Bundle. Share.** - A modern knowledge management platform that helps you organize, learn, and share information effectively using spaced repetition and intelligent content organization.

## 🎯 Overview

Synap is a comprehensive knowledge management platform designed to help users capture, organize, and retain information through an intelligent system of content cards, collections, and spaced repetition learning. The platform combines traditional knowledge management with modern learning science to create an effective personal knowledge base.

## ✨ Key Features

### 📚 Content Management

- **Smart Content Cards**: Capture links, notes, and ideas with rich metadata
- **Intelligent Tagging**: Organize content with flexible tagging system
- **Favorites & Pinning**: Mark important content for quick access (up to 5 pinned items)
- **Full CRUD Operations**: Create, read, update, and delete content seamlessly

### 📁 Collections System

- **Dynamic Collections**: Group related content into organized bundles
- **Public Sharing**: Share collections with unique, secure links
- **Collection Management**: Create, edit, and organize collections
- **Cross-Collection Content**: Add content to multiple collections simultaneously

### 🧠 Spaced Repetition Learning

- **SM-2 Algorithm**: Implemented SuperMemo SM-2 spaced repetition algorithm
- **Adaptive Scheduling**: Content review intervals adjust based on performance
- **Review Dashboard**: Track due items and learning progress
- **Quality-Based Learning**: Rate recall quality to optimize review timing

### 🔐 Authentication & Security

- **Clerk Integration**: Secure user authentication and session management
- **Route Protection**: Middleware-based authentication for protected routes
- **Public Content Access**: Secure sharing without authentication requirements

### 🎨 Modern UI/UX

- **Responsive Design**: Mobile-first design with Tailwind CSS
- **Dark/Light Mode**: Theme switching with next-themes
- **Interactive Animations**: GSAP-powered smooth animations and transitions
- **Component Library**: Custom UI components built with ShadCN UI

## 🛠️ Tech Stack

### Frontend

- **Next.js** - React framework with App Router
- **React** - Latest React with concurrent features
- **TypeScript** - Type-safe development
- **Tailwind CSS** - Utility-first CSS framework
- **GSAP** - High-performance animations
- **ShadCN UI** - Accessible component primitives
- **Lucide React** - Beautiful icon library

### Backend & Database

- **Prisma ORM** - Type-safe database ORM
- **PostgreSQL** - Robust relational database
- **Next.js Server Actions** - Type-safe server-side operations
- **Clerk** - Authentication and user management

## 🏗️ Architecture

### Database Schema

```sql
Users → Contents (1:many)
Users → Collections (1:many)
Contents ↔ Collections (many:many via ContentCollection)
Contents ↔ Tags (many:many via ContentTag)
Contents → SpacedRepetition (1:1 optional)
```

### Key Models

- **User**: Authentication and profile management
- **Content**: Core content items with metadata
- **Collection**: Organized content groups
- **Tag**: Flexible content categorization
- **SpacedRepetition**: Learning algorithm data

### File Structure

```
├── app/                    # Next.js App Router
│   ├── (auth)/            # Authentication routes
│   ├── (main)/            # Protected main application
│   └── brain/             # Public shared content
├── components/            # Reusable UI components
├── actions/               # Server actions for data operations
├── lib/                   # Utilities and configurations
└── prisma/               # Database schema and migrations
```

## 🚀 Getting Started

### Prerequisites

- Node.js 18+
- PostgreSQL database
- Clerk account for authentication

### Installation

1. **Clone the repository**

   ```bash
   git clone https://github.com/daanish04/Synap.git
   cd synap
   ```

2. **Install dependencies**

   ```bash
   npm install
   ```

3. **Environment Setup**
   Create a `.env.local` file:

   ```env
   DATABASE_URL="postgresql://username:password@localhost:5432/synap"
   NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY="your_clerk_publishable_key"
   CLERK_SECRET_KEY="your_clerk_secret_key"
   ```

4. **Database Setup**

   ```bash
   npx prisma migrate dev
   npx prisma generate
   ```

5. **Start Development Server**

```bash
npm run dev
```

6. **Open Application**
   Navigate to localhost

## 📊 Core Algorithms

### Spaced Repetition Implementation

The platform implements the SuperMemo SM-2 algorithm for optimal learning:

```typescript
// Review quality affects interval calculation
enum ReviewQuality {
  FORGOT = 0, // Reset to 1 day
  HARD = 1, // Reset to 1 day
  GOOD = 2, // Continue progression
  EASY = 3, // Increase interval
  VERY_EASY = 4, // Significant increase
}
```

**Key Features:**

- Adaptive ease factor (1.3 - 2.5+)
- Interval progression: 1 → 6 → 6 → (interval × easeFactor)
- Maximum interval cap (365 days)
- Performance-based adjustments

## 🎯 Performance Optimizations

- **Database Indexing**: Strategic indexes on frequently queried fields
- **Transaction Safety**: Atomic operations for data consistency
- **Caching**: Next.js revalidation for optimal data freshness
- **Component Optimization**: Client/server component separation
- **Image Optimization**: Next.js Image component with lazy loading

## 🔮 Future Enhancements

- **AI Integration**: Content summarization, quiz generation, tag suggestions and connection discovery
- **Pagination**: Efficient handling of large content datasets
- **Browser Extension**: User friendly content addition and sharing
- **Advanced Search**: Full-text search across content and metadata
- **Export/Import**: Data portability features
- **Blog-like Environment**: Users able to follow other's profiles and save collections, with visible likability and views for each content/collection. More personalized user profile page (Bio, Social Links, Followers/Following List, Avatar, Achievements) [Low]
