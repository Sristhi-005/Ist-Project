This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

## Getting Started

First, install dependencies and run the development server:

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `src/app/page.tsx`. The page auto-updates as you edit the file.

## GitHub repository

This project is published at:

https://github.com/Sristhi-005/Ist-Project

To push future changes from this folder:

```bash
git add .
git commit -m "Describe your change"
git push
```

## OpenAI setup

Create a `.env.local` file in the project root with your OpenAI API key:

```bash
OPENAI_API_KEY=your-openai-api-key
```

Then run the app locally:

```bash
npm run preview
```

## Local live demo

To run a local preview and share it publicly, install a tunneling tool such as LocalTunnel and forward port `3000`:

```bash
npm run preview
npx localtunnel --port 3000
```

Then share the public URL shown by LocalTunnel.

## Premium version

This project includes a premium upgrade flow inside the app. After logging in, click **Upgrade to Premium** to unlock:

- priority AI remediation and premium issue guidance
- deeper security analysis and risk flags
- premium PDF report export details
- release-ready improvement checklists

The premium state is stored locally in your browser.

## Deployment

### Deploy on Vercel

Vercel is the recommended host for this Next.js app because it supports serverless API routes and environment variables.

1. Push the repo to GitHub.
2. Create a new Vercel project and connect it to `Sristhi-005/Ist-Project`.
3. Set `OPENAI_API_KEY` in Vercel Project Settings > Environment Variables.
4. Deploy.

### GitHub Pages

This app uses a server-side API route (`/api/analyze`), so GitHub Pages cannot host the complete app directly.

If you want a static frontend preview only, you can export the site after building:

```bash
npm run build
npx next export
```

Then deploy the generated `out/` folder to GitHub Pages, but note that the analyzer backend will not work in this mode.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.
