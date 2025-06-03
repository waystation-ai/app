import useCases from '@/app/ai/use-cases.json';

export interface UseCase {
  id: string;
  title: string;
  summary: string;
  call_to_action: string;
  bullet_points: string[];
  integration_recipe: string;
}

export interface AdjacentUseCases {
  previous: UseCase | null;
  next: UseCase | null;
}

/**
 * Get the previous and next use cases for navigation
 */
export function getAdjacentUseCases(currentUseCaseId: string): AdjacentUseCases {
  const currentIndex = useCases.findIndex(useCase => useCase.id === currentUseCaseId);
  
  if (currentIndex === -1) {
    return { previous: null, next: null };
  }

  const previous = currentIndex > 0 ? useCases[currentIndex - 1] : useCases[useCases.length - 1];
  const next = currentIndex < useCases.length - 1 ? useCases[currentIndex + 1] : useCases[0];

  return { previous, next };
}

/**
 * Get all use cases
 */
export function getAllUseCases(): UseCase[] {
  return useCases;
}

/**
 * Get a specific use case by ID
 */
export function getUseCaseById(id: string): UseCase | null {
  return useCases.find(useCase => useCase.id === id) || null;
}
