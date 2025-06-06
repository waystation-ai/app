import UseCaseCard from './UseCaseCard';
import { getAllUseCases } from './utils';

export default function UseCaseGrid() {
  const useCases = getAllUseCases();

  return (
    <div className="px-4 sm:px-8 pb-12 max-w-7xl mx-auto w-full">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
        {useCases.map((useCase) => (
          <UseCaseCard key={useCase.id} useCase={useCase} />
        ))}
      </div>
    </div>
  );
}
