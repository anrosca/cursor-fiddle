import { Feed } from "./components/Feed";

export default function App() {
  return (
    <div className="mx-auto min-h-screen max-w-xl px-4 py-8 sm:max-w-2xl lg:max-w-3xl">
      <header className="mb-8 text-center">
        <h1 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-white sm:text-3xl">
          Feed
        </h1>
        <p className="mt-1 text-sm text-slate-600 dark:text-slate-400">
          Connect, react, and share — demo experience
        </p>
      </header>
      <Feed />
    </div>
  );
}
