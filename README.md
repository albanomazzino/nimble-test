# Nimble Test Challenge

React app for Nimble's coding challenge.

## What it does

- Fetches candidate data with `GET /api/candidate/get-by-email` using `albimazzino@gmail.com`.
- Fetches open jobs with `GET /api/jobs/get-list`.
- Renders each job with:
  - title
  - GitHub repository URL input
  - `Submit` button
- Sends application data with `POST /api/candidate/apply-to-job`.
- Handles loading, success and error states.

## Run locally

```bash
npm install
npm run dev
```

## Build

```bash
npm run build
```
