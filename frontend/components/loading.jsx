export default function LoadingSpinner() {
  return (
    <div className="text-center mt-6">
      <div className="animate-spin w-10 h-10 border-4 border-indigo-600 border-t-transparent rounded-full mx-auto"></div>
      <p className="mt-2 text-gray-600">Processing...</p>
    </div>
  );
}
