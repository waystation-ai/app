import Link from "next/link";
import RichText from "./RichText";
import { UseCase } from "./utils";
import { processUseCaseAppLinks } from "@/lib/utils/appLinkProcessor";
import UseCaseNavigation from "./UseCaseNavigation";

interface UseCasePageProps {
  useCase: UseCase;
}

export default function UseCasePage({ useCase }: UseCasePageProps) {
  const processedUseCase = processUseCaseAppLinks(useCase);
  
  return (
    <div className="flex flex-col relative">
      {/* Hero Section */}
      <main className="flex-1 flex flex-col">
        {/* Title and Summary - Centered */}
        <div className="text-center px-4 sm:px-8 py-8 max-w-4xl mx-auto">
          <h1 className="text-3xl lg:text-4xl font-bold mb-6">{processedUseCase.title}</h1>
          <div className="text-lg lg:text-xl leading-relaxed text-gray-700">
            <RichText segments={processedUseCase.summary} links={true}/>
          </div>
        </div>

        {/* Hero Sections - Two Columns */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 px-4 sm:px-8 max-w-7xl mx-auto mb-8">
          {/* Left Column - Bullet Points */}
          <div className="flex flex-col space-y-4">
            <h2 className="text-xl lg:text-2xl font-semibold mb-4">Key Benefits</h2>
            <ul className="space-y-3">
              {processedUseCase.bullet_points.map((pointSegments, index) => (
                <li key={index} className="flex items-start">
                  <span className="text-aurora-green mr-3 mt-1 text-lg">•</span>
                  <span className="text-gray-700 leading-relaxed">
                    <RichText segments={pointSegments} links={true} />
                  </span>
                </li>
              ))}
            </ul>
          </div>

          {/* Right Column - Integration Recipe */}
          <div className="flex flex-col h-full">
            <div className="bg-gradient-to-r from-green-50 to-white p-6 rounded-lg border border-gray-200 shadow-sm flex-1 flex items-center relative overflow-hidden border-l-4 border-l-aurora-green">
              {/* Large quote marks in background */}
              <div className="absolute top-4 left-4 text-green-100 opacity-50 text-6xl font-serif">&ldquo;</div>
              <div className="absolute bottom-4 right-4 text-green-100 opacity-50 text-6xl font-serif rotate-180">&rdquo;</div>
              
              <div className="text-gray-700 leading-relaxed text-lg relative z-10">
                <RichText segments={processedUseCase.integration_recipe} links={true} />
              </div>
            </div>
          </div>
        </div>

        {/* Call to Action Section */}
        <div className="w-full mt-12 backdrop-blur-md bg-white/30 text-center px-4 sm:px-8 py-8 mx-auto">
          <div className="text-lg lg:text-xl mb-6 text-gray-700">
            <RichText segments={processedUseCase.call_to_action} />
          </div>
          <Link href="/playground" className="aurora-btn inline-flex items-center justify-center gap-2 px-8 py-4 text-lg font-semibold text-white rounded-lg">
            Try it in Playground
          </Link>
        </div>

        {/* Navigation to Previous/Next Use Case */}
        <UseCaseNavigation currentUseCaseId={processedUseCase.id} />
      </main>
    </div>
  );
}
