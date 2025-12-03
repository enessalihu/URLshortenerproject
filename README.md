# URL Shortener

A sleek URL shortening service built with Next.js and Supabase that transforms long web addresses into elegant, shareable short links.

## Features

- **URL Shortening**: Generate unique, concise short links from long URLs
- **Link Redirection**: Short links seamlessly redirect users to original destinations
- **Expiration Control**: Set custom expiration times (1 hour to 30 days)
- **Click Tracking**: Track and display the number of clicks for each shortened URL
- **Link Management**: Delete short links when no longer needed
- **QR Code Generation**: Generate downloadable QR codes for easy sharing (optional feature)

## Tech Stack

- **Framework**: Next.js 15 (App Router)
- **Database**: Supabase (PostgreSQL)
- **Styling**: Tailwind CSS
- **UI Components**: shadcn/ui
- **QR Code**: qrcode library

## Prerequisites

- Node.js 18+ installed
- npm or pnpm package manager
- Supabase account (free tier available)

## Setup Instructions

### 1. Clone the Repository

\`\`\`bash
git clone https://github.com/your-username/url-shortener.git
cd url-shortener
\`\`\`

### 2. Install Dependencies

    \`\`\`bash
    npm install
    # or
    pnpm install
\`\`\`

### 3. Set Up Supabase

1. Create a new project at [supabase.com](https://supabase.com)
2. Go to **Settings > API** to find your credentials
3. Create a `.env.local` file in the project root:

       \`\`\`env
       NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
       NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
       \`\`\`

### 4. Create Database Table

Run the following SQL in your Supabase SQL Editor (or use the script at `scripts/001_create_urls_table.sql`):

\`\`\`sql
CREATE TABLE IF NOT EXISTS urls (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  original_url TEXT NOT NULL,
  short_code VARCHAR(8) NOT NULL UNIQUE,
  click_count INTEGER DEFAULT 0,
  expires_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX idx_urls_short_code ON urls(short_code);
CREATE INDEX idx_urls_expires_at ON urls(expires_at);

ALTER TABLE urls ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Allow public read access" ON urls
  FOR SELECT USING (true);

CREATE POLICY "Allow public insert" ON urls
  FOR INSERT WITH CHECK (true);

CREATE POLICY "Allow public update for click count" ON urls
  FOR UPDATE USING (true);

CREATE POLICY "Allow public delete" ON urls
  FOR DELETE USING (true);
\`\`\`
    Server Configuration Check



   ## 5. The server is correctly configured in package.json to listen on all network interfaces (0.0.0.0), allowing external network access:

JSON
//package.json
"scripts": {
  "dev": "next dev -H 0.0.0.0 -p 3000", 
  // ...
}
    
   Local IP Override for Testing

 This is the mandatory step to make the QR code work on a mobile device:

Find Your Local IP: In your terminal, find your active network IP address (e.g., 192.168.x.x):
Bash
ifconfig | grep "inet "




### 6. Run the Development Server

       \`\`\`bash
          npm run dev
      # or
     pnpm dev
     \`\`\`

Open "http://[YOUR_LOCAL_IP]:3000"  in your browser.

## Project Structure

\`\`\`
├── app/
│   ├── actions.ts          # Server actions for CRUD operations
│   ├── page.tsx            # Main page component
│   ├── layout.tsx          # Root layout
│   └── r/[shortCode]/      # Redirect route handler
├── components/
│   ├── url-shortener-form.tsx  # URL input form
│   ├── url-list.tsx            # List of shortened URLs
│   ├── url-card.tsx            # Individual URL card
│   └── qr-code-modal.tsx       # QR code display modal
I   I___ QRCodeCanvas.txt       #
├── lib/
│   ├── supabase/           # Supabase client configuration
│   ├── types.ts            # TypeScript type definitions
│   └── utils/              # Utility functions
└── scripts/
    └── 001_create_urls_table.sql  # Database setup script
\`\`\`

## How It Works

1. **Creating Short Links**: Enter a URL and select an expiration time. The system generates a unique 8-character code.

2. **Redirection**: When accessing `/r/{shortCode}`, the system:
   - Looks up the short code in the database
   - Checks if the link has expired
   - Increments the click counter
   - Redirects to the original URL

3. **Click Tracking**: Each redirect increments the click count, displayed as "This link has been clicked X times."

## API Routes

| Route | Method | Description |
|-------|--------|-------------|
| `/r/[shortCode]` | GET | Redirects to original URL |

## Server Actions

- `createShortUrl()` - Creates a new shortened URL
- `deleteShortUrl()` - Deletes a shortened URL
- `getUrlByShortCode()` - Fetches URL and increments click count

## Environment Variables

| Variable | Description |
|----------|-------------|
| `NEXT_PUBLIC_SUPABASE_URL` | Your Supabase project URL |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Your Supabase anonymous key |



