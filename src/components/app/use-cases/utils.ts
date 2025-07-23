import useCases from '@/app/(frontend)/use-cases/use-cases.json';

import configPromise from '@payload-config';
import { getPayload } from 'payload';

import { UseCase as PayloadUseCase } from '@/payload-types';


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
export async function getAdjacentUseCases(currentUseCaseId: string): Promise<AdjacentUseCases> {
  const useCases = await getAllUseCases();

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
export async function getAllUseCases(): Promise<UseCase[]> {
  const payload = await getPayload({ config: configPromise })

  const coll = await payload.find({
    collection: 'use-cases',
    depth: 1,
    overrideAccess: false,
    pagination: false,
  });

  const dbCases = coll.docs.map((doc: PayloadUseCase) => ({
    id: doc.slug,
    title: doc.title,
    summary: doc.summary,
    call_to_action: doc.callToAction,
    integration_recipe: doc.integrationRecipe,
    bullet_points: doc.bulletPoints?.map((item) => item.point) || [],
  }))

  // Merge dbCases and useCases excluding those already in dbCases
  const existingIds = new Set(dbCases.map(useCase => useCase.id));  
  return [...dbCases, ...useCases.filter(useCase => !existingIds.has(useCase.id))];
}

/**
 * Get a specific use case by ID
 */
export async function getUseCaseById(id: string): Promise<UseCase | null> {
  const payload = await getPayload({ config: configPromise });

  const result = await payload.find({
      collection: 'use-cases',
      limit: 1,
      pagination: false,
      where: {
        slug: {
          equals: id,
        },
      },
    })

  if (result.docs?.[0])
    return {
      id: result.docs[0].slug || '',
      title: result.docs[0].title,
      summary: result.docs[0].summary,
      call_to_action: result.docs[0].callToAction,
      integration_recipe: result.docs[0].integrationRecipe,
      bullet_points: result.docs[0].bulletPoints?.map((item) => item.point) || [],
  }

  return useCases.find(useCase => useCase.id === id) || null;
}
