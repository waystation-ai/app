import Link from "next/link";
import { getAdjacentUseCases } from "./utils";

interface UseCaseNavigationProps {
  currentUseCaseId: string;
}

export default function UseCaseNavigation({ currentUseCaseId }: UseCaseNavigationProps) {
  const { previous, next } = getAdjacentUseCases(currentUseCaseId);

  return (
    <div className="border-t border-gray-200 px-4 sm:px-8 py-8 max-w-7xl mx-auto w-full">
      <div className="flex justify-between items-center">
        {/* Previous Use Case */}
        <div className="flex-1">
          {previous ? (
            <Link 
              href={`/ai/${previous.id}`}
              className="group flex items-center text-left hover:text-blue-600 transition-colors"
            >
              <div className="mr-4 text-2xl group-hover:transform group-hover:-translate-x-1 transition-transform">
                ←
              </div>
              <div>
                <div className="text-sm text-gray-500 mb-1">Previous</div>
                <div className="font-semibold text-gray-900 group-hover:text-blue-600">
                  {previous.title}
                </div>
              </div>
            </Link>
          ) : (
            <div></div>
          )}
        </div>

        {/* Next Use Case */}
        <div className="flex-1">
          {next ? (
            <Link 
              href={`/ai/${next.id}`}
              className="group flex items-center justify-end text-right hover:text-blue-600 transition-colors"
            >
              <div>
                <div className="text-sm text-gray-500 mb-1">Next</div>
                <div className="font-semibold text-gray-900 group-hover:text-blue-600">
                  {next.title}
                </div>
              </div>
              <div className="ml-4 text-2xl group-hover:transform group-hover:translate-x-1 transition-transform">
                →
              </div>
            </Link>
          ) : (
            <div></div>
          )}
        </div>
      </div>
    </div>
  );
}
