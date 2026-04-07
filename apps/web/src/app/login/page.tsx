import Link from "next/link";

export default function LoginPage() {
  return (
    <div className="bg-surface font-body text-on-surface flex min-h-screen flex-col">
      <nav className="fixed top-0 z-50 w-full bg-transparent backdrop-blur-xl dark:bg-transparent">
        <div className="mx-auto flex w-full max-w-screen-2xl items-center justify-between px-8 py-6">
          <span className="font-headline text-2xl font-extrabold tracking-tighter text-slate-900 uppercase dark:text-slate-50">
            CURATOR
          </span>
          <div className="flex items-center gap-6">
            <Link
              href="/"
              className="font-headline text-lg font-medium tracking-tight text-slate-600 transition-colors duration-300 hover:text-[#219bf6] dark:text-slate-400"
            >
              Explore
            </Link>
            <button
              type="button"
              className="text-slate-900 flex h-10 w-10 items-center justify-center rounded-full transition-colors hover:bg-slate-100"
              aria-label="Close"
            >
              <span className="material-symbols-outlined">close</span>
            </button>
          </div>
        </div>
      </nav>

      <main className="flex flex-grow flex-col pt-20 md:flex-row">
        <section className="bg-surface-container-lowest flex min-h-[calc(100vh-80px)] w-full items-center justify-center px-6 py-24 md:w-1/2 md:px-20">
          <div className="w-full max-w-md space-y-10">
            <header className="space-y-2">
              <h1 className="font-headline text-on-surface text-4xl font-extrabold tracking-tight">
                Welcome back
              </h1>
              <p className="text-on-surface-variant font-body">
                Access your curated fashion destination.
              </p>
            </header>

            <div className="border-outline-variant/30 flex border-b">
              <button
                type="button"
                className="text-primary border-primary px-6 pb-4 text-sm font-semibold transition-all border-b-2"
              >
                Login
              </button>
              <button
                type="button"
                className="text-on-surface-variant hover:text-on-surface px-6 pb-4 text-sm font-medium transition-all"
              >
                Sign Up
              </button>
            </div>

            <form className="space-y-6">
              <div className="space-y-4">
                <div className="space-y-2">
                  <label className="text-on-surface-variant font-label block text-xs font-semibold tracking-widest uppercase">
                    Email Address
                  </label>
                  <input
                    type="email"
                    placeholder="name@example.com"
                    className="bg-surface-container-high placeholder:text-outline/60 focus:ring-primary focus:bg-surface-container-lowest w-full rounded-lg border-none px-4 py-3 transition-all focus:ring-1"
                  />
                </div>
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <label className="text-on-surface-variant font-label block text-xs font-semibold tracking-widest uppercase">
                      Password
                    </label>
                    <Link
                      href="#"
                      className="text-primary text-xs font-medium hover:underline"
                    >
                      Forgot Password?
                    </Link>
                  </div>
                  <input
                    type="password"
                    placeholder="••••••••"
                    className="bg-surface-container-high placeholder:text-outline/60 focus:ring-primary focus:bg-surface-container-lowest w-full rounded-lg border-none px-4 py-3 transition-all focus:ring-1"
                  />
                </div>
              </div>
              <button
                type="submit"
                className="bg-primary text-on-primary shadow-primary/20 w-full rounded-full py-4 font-bold shadow-lg transition-all duration-300 hover:scale-[1.02] active:scale-95"
              >
                Sign In
              </button>
            </form>

            <div className="space-y-6">
              <div className="relative">
                <div className="absolute inset-0 flex items-center">
                  <span className="border-outline-variant/30 w-full border-t" />
                </div>
                <div className="text-outline bg-surface-container-lowest relative flex justify-center px-4 text-xs tracking-widest uppercase">
                  Or continue with
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <button
                  type="button"
                  className="border-outline-variant/40 hover:bg-surface-container-low flex items-center justify-center gap-3 rounded-full border px-4 py-3 transition-colors"
                >
                  <svg className="h-5 w-5" viewBox="0 0 24 24" aria-hidden="true">
                    <path
                      d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                      fill="currentColor"
                    />
                    <path
                      d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                      fill="currentColor"
                    />
                    <path
                      d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z"
                      fill="currentColor"
                    />
                    <path
                      d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                      fill="currentColor"
                    />
                  </svg>
                  <span className="font-headline text-sm font-semibold">Google</span>
                </button>
                <button
                  type="button"
                  className="border-outline-variant/40 hover:bg-surface-container-low flex items-center justify-center gap-3 rounded-full border px-4 py-3 transition-colors"
                >
                  <svg className="h-5 w-5" viewBox="0 0 24 24" aria-hidden="true">
                    <path
                      d="M17.56 12.75c-.02-2.16 1.77-3.2 1.85-3.25-1.01-1.48-2.57-1.68-3.12-1.71-1.33-.14-2.6.78-3.27.78-.67 0-1.7-.76-2.79-.74-1.44.02-2.76.84-3.5 2.13-1.5 2.6-.38 6.45 1.08 8.57.72 1.04 1.57 2.21 2.69 2.17 1.08-.04 1.49-.7 2.79-.7 1.31 0 1.67.7 2.81.68 1.16-.02 1.89-1.05 2.6-2.1.82-1.19 1.16-2.34 1.18-2.4-.03-.01-2.26-.87-2.28-3.43z"
                      fill="currentColor"
                    />
                    <path
                      d="M15.43 6.39c.59-.71 1-1.7.89-2.69-.85.03-1.88.57-2.49 1.28-.55.64-1.03 1.66-.9 2.63.95.07 1.91-.48 2.5-1.22z"
                      fill="currentColor"
                    />
                  </svg>
                  <span className="font-headline text-sm font-semibold">Apple</span>
                </button>
              </div>
            </div>
          </div>
        </section>

        <section className="bg-surface-container relative hidden min-h-screen w-1/2 overflow-hidden md:block">
          <img
            src="https://lh3.googleusercontent.com/aida-public/AB6AXuCD9RLeXdQifHJAkXgjLVCAPutdHffi_HZYiDFlGxhJ9SmjTLxVjqscurEh3-1WzEOJukfIBkEpINHgF1CnnQa6y1xDVz7aRgRUAMP6v-UC7KJUdhAvb-ozAciwNkls8CQCXgkBCg513DeOZhhvEpAd2xTZD4VKlDMRt1X3aYuTqpNRu76QPOe3bztdLBm036vVYLWTcYV990PMUNUYNWujavXmXj68R2uPVjMocjbJnVReiNJnwUPBgHYKM7f3PgnoWmdl3c4-xy4"
            alt="Editorial fashion visual"
            className="absolute inset-0 h-full w-full object-cover"
          />
          <div className="from-on-surface/80 to-transparent text-on-primary absolute inset-0 flex flex-col justify-end bg-gradient-to-t via-transparent p-20">
            <div className="max-w-xl space-y-6">
              <span className="text-primary text-xs font-bold tracking-[0.2em] uppercase">
                Editorial Perspective
              </span>
              <blockquote className="font-headline text-5xl leading-tight font-extrabold tracking-tighter text-white">
                "Fashion is not just what you wear. It is how you show yourself to the world."
              </blockquote>
              <cite className="font-headline block text-lg opacity-80">
                - Karl Lagerfeld
              </cite>
            </div>
          </div>
        </section>
      </main>

      <footer className="mt-auto w-full border-t border-slate-200/20 bg-slate-50 py-8 dark:bg-slate-900">
        <div className="flex w-full flex-col items-center justify-between px-8 md:flex-row">
          <p className="font-inter text-xs tracking-wide text-slate-500 uppercase dark:text-slate-400">
            COPYRIGHT 2024 THE DIGITAL CURATOR. ALL RIGHTS RESERVED.
          </p>
          <div className="mt-4 flex gap-8 md:mt-0">
            <Link
              href="#"
              className="font-inter text-xs tracking-wide text-slate-500 uppercase opacity-80 transition-opacity hover:text-[#219bf6] hover:opacity-100 dark:text-slate-400"
            >
              Privacy Policy
            </Link>
            <Link
              href="#"
              className="font-inter text-xs tracking-wide text-slate-500 uppercase opacity-80 transition-opacity hover:text-[#219bf6] hover:opacity-100 dark:text-slate-400"
            >
              Terms of Service
            </Link>
            <Link
              href="#"
              className="font-inter text-xs tracking-wide text-slate-500 uppercase opacity-80 transition-opacity hover:text-[#219bf6] hover:opacity-100 dark:text-slate-400"
            >
              Help Center
            </Link>
          </div>
        </div>
      </footer>
    </div>
  );
}
