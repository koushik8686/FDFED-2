import { Link } from "react-router-dom";

export default function Component() {
  return (
    <div className="flex flex-col min-h-[100dvh]">
      <header className=" sticky top-0 bg-gradient-to-r from-green-600 via-teal-600 to-blue-600 text-white py-4 px-6 shadow-md flex items-center justify-between">
        <Link to="/" className="flex items-center gap-2">
          <span className="text-lg font-semibold tracking-wide">HEXART</span>
        </Link>
        <nav className="flex items-center gap-6">
          <Link to="/login" className="hover:underline text-sm font-medium">
            Login
          </Link>
          <Link to="/register" className="hover:underline text-sm font-medium">
            Register
          </Link>
          <Link to="/seller" className="hover:underline text-sm font-medium">
            Seller
          </Link>
          <Link to="/admin" className="hover:underline text-sm font-medium">
            Admin
          </Link>
        </nav>
      </header>
      <main className="flex-1">
        <section className="h-screen flex py-20 px-6 items-center justify-center">
          <div className="container mx-auto max-w-4xl space-y-6 text-center">
            <h1 className="text-5xl font-extrabold tracking-tight sm:text-6xl">
              Discover Rare Artifacts at Our Auction House
            </h1>
            <p className="text-lg sm:text-xl">
              Explore a world of mystery and history with our curated selection of items, waiting for the highest bidder.
            </p>
            <Link
              to="/home"
              className="inline-flex h-12 items-center justify-center rounded-full bg-teal-500 text-white px-8 py-3 text-sm font-medium shadow-lg transition-transform hover:scale-110 hover:shadow-2xl focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-teal-500 focus-visible:ring-offset-2 focus-visible:ring-offset-blue-900 disabled:pointer-events-none disabled:opacity-50"
            >
              Browse Auctions
            </Link>
          </div>
        </section>
      </main>

    </div>
  );
}
