export default function Header() {
  return (
    <header className="bg-white border-b border-gray-200 h-16 flex items-center justify-between px-6 w-full">
      <h1 className="text-lg font-semibold text-gray-800">Overview Keuangan</h1>
      <div className="flex items-center gap-3">
        <div className="w-9 h-9 bg-blue-600 rounded-full flex items-center justify-center text-white font-bold shadow-sm">
          A
        </div>
      </div>
    </header>
  );
}