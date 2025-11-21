export default function Scholarships() {
  return (
    <div
      className="min-h-screen flex flex-col items-center justify-center"
      style={{
        background:
          'linear-gradient(to bottom right, rgb(255,220,230), rgb(210,255,220))',
        fontFamily: 'Arial, sans-serif'
      }}
    >
      <div
        className="p-10 rounded-lg shadow-xl max-w-2xl w-full"
        style={{ backgroundColor: 'rgba(255,255,255,0.7)' }}
      >
        <h1
          className="text-4xl font-bold mb-6 text-center"
          style={{ color: 'black' }}
        >
          Scholarships
        </h1>

        <p className="text-center text-lg" style={{ color: 'black' }}>
          Your documents were uploaded successfully.  
          This page will display your scholarship matches.
        </p>
      </div>
    </div>
  )
}
