export default async function GET() {

  return (
    <div className="h-screen flex flex-col relative">
      {/* Hero Section */}
      <main className="flex-1 flex flex-col h-full">
        <div className="grid grid-rows gap-8 lg:gap-12 px-4 sm:px-8 py-8 max-w-7xl mx-auto h-full">
          {/* Left Column - Branding */}
          <div className="flex items-center justify-center h-full">
            <p className="text-3xl lg:text-4xl text-gray-900 font-bold">403</p>
          </div>

          {/* Right Column - Chat Demo */}
          <div className="flex items-center justify-center h-full">
            <p className="text-lg lg:text-xl text-gray-800 leading-relaxed">Access Denied</p>
          </div>
        </div>
      </main>
    </div>
  );
}
