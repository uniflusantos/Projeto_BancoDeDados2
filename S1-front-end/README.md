This is an [Next.js](https://nextjs.org) e-commerce application that integrates with a FastAPI backend.

## Features

- User authentication (login/register)
- Product catalog browsing
- Add products to catalog
- Shopping cart functionality
- Checkout with payment methods
- Purchase history
- Payment method management

## Getting Started

### Environment Setup

Create a `.env.local` file in the root directory with the following variable:

```env
NEXT_PUBLIC_API_BASE_URL=http://localhost:8000
```

Replace `http://localhost:8000` with your actual API base URL.

### Install Dependencies

```bash
bun install
```

### Run the Development Server

```bash
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.
