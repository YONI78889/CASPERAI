# CASPER AI — fixed Vercel version

## Upload to GitHub

Replace the files in your GitHub repository with the contents of this folder and commit the changes.

## Vercel environment variable

In Vercel:

1. Open the `casperai` project.
2. Open **Environment Variables**.
3. Add:
   - Name: `OPENAI_API_KEY`
   - Value: your complete OpenAI API key
4. Enable it for Production, Preview, and Development.
5. Save it.
6. Open **Deployments** and redeploy the newest commit.

Do not put your API key in GitHub or inside `server.js`.

## Test

- `/` should show the CASPER AI page.
- `/api/health` should return JSON.
- The `hasApiKey` value should be `true`.
