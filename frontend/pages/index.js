export default function Welcome() {
  return (  
    <div
      className="min-h-screen bg-cover bg-center flex flex-col"
      style={{ backgroundImage: "url('/background.jpg')" , fontFamily: "Arial, sans-serif" }}
    >
      <nav className="bg-white/70 backdrop-blur-md py-4 px-6 shadow-sm flex justify-between items-center">
        <h1
          className="text-2xl font-semibold tracking-wide"
          style={{ color: "black" }}
        >
          Bloomfund
        </h1>

        <div className="space-x-8 text-lg">
          <a href="/" className="hover:underline" style={{ color: "black" }}>
            Home
          </a>
          <a href="/signin" className="hover:underline" style={{ color: "black" }}>
            Get Started
          </a>
        </div>
      </nav>

      <div className="flex flex-col grow items-center justify-center text-center px-6">

        {/* transparent white box at 0.5 */}
        <div
          className="p-10 rounded-lg shadow-xl max-w-2xl w-full"
          style={{
            backgroundColor: "rgba(255, 255, 255, 0.5)",
            backdropFilter: "blur(4px)"
          }}
        >
          <h2
            className="text-5xl font-bold mb-4 leading-tight"
            style={{ color: "black" }}
          >
            Discover Scholarships Made For You
          </h2>

          <p
            className="text-xl mb-6"
            style={{ color: "black" }}
          >
            Upload your resume or transcript and let our AI find scholarships that match your background, goals, and experiences!
          </p>

          <a
            href="/signin"
            className="px-8 py-3 text-lg rounded-full shadow-lg hover:bg-gray-200 transition"
            style={{ backgroundColor: "white", color: "black", border: "2px solid black" }}
          >
            Get Started
          </a>
        </div>
      </div>
    </div>
  )
}
