# EBookVerse - Frontend

A comprehensive React-based digital library application allowing users to search, read, upload, and download PDF books. This project uses the Google Books API for public data and includes a mock implementation for user features.

## Project Overview

- **Framework**: React 19 (ES Modules)
- **Styling**: Tailwind CSS
- **Routing**: React Router DOM
- **Icons**: Lucide React
- **Data Source**: Google Books API (Public), Local State (User Data)

## Running the Application

This application uses ES Modules and can be served directly by any static file server.

1. **Serve the root directory**:
   You can use `http-server`, `live-server`, or the VS Code "Live Server" extension.
   ```bash
   npx http-server .
   ```
2. **Open in Browser**:
   Navigate to `http://localhost:8080` (or the port provided by your server).

## Backend Integration Guide

The application currently uses mock data and `localStorage` for persistence. To connect it to your backend, follow these steps:

### 1. Authentication (`context/AppContext.tsx`)

Currently, the `login` function simulates a successful login for any email provided.

**To Connect Backend:**
- Update the `login` function in `context/AppContext.tsx`.
- Replace the mock logic with a `fetch` or `axios` call to your login endpoint (e.g., `POST /api/login`).
- Store the returned JWT/Session token in `localStorage` or a secure cookie.

```typescript
// context/AppContext.tsx example change
const login = async (email: string, password: string) => {
  try {
    const response = await fetch('/api/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email, password })
    });
    const data = await response.json();
    setAuth({ user: data.user, isAuthenticated: true });
    // Store token...
  } catch (err) {
    console.error("Login failed", err);
  }
};
```

### 2. File Upload (`pages/UploadBook.tsx`)

Currently, file uploads create a temporary `blob:` URL that only exists in the browser's memory for the current session.

**To Connect Backend:**
- In `pages/UploadBook.tsx`, find the `handleSubmit` function.
- Create a `FormData` object and append the `selectedFile`.
- Send a `POST` request to your upload endpoint (e.g., `/api/books/upload`).
- The backend should return the permanent URL of the stored PDF, which you then save to the application state.

```typescript
// pages/UploadBook.tsx example change
const formData = new FormData();
formData.append('file', selectedFile);
formData.append('title', title);
formData.append('author', author);

await fetch('/api/books/upload', {
  method: 'POST',
  body: formData
});
```

### 3. Data Persistence (`context/AppContext.tsx`)

The `myBooks` and `recentlyViewed` arrays are currently stored in React state and lost on refresh (except for the mocked `localStorage` user).

**To Connect Backend:**
- Use `useEffect` in `AppProvider` to fetch the user's library and history when the app loads or when the user logs in.
- Endpoint examples: `GET /api/user/books`, `GET /api/user/history`.

### 4. External Book Data (`services/bookService.ts`)

The app currently queries the Google Books API directly.

**Optional Backend Proxy:**
- If you want to cache results or hide API keys, you can route these requests through your backend (e.g., `GET /api/books/search?q=...`) instead of calling Google directly from the client.

## Folder Structure

- **`components/`**: Reusable UI components (Navbar, Footer, BookCard).
- **`context/`**: Global state management (Auth, Library data).
- **`pages/`**: Application routes/screens.
- **`services/`**: API interaction logic.
- **`types.ts`**: TypeScript interfaces.