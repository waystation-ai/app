import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import UseCasePage from '@/components/app/use-cases/UseCasePage';
import useCases from '../use-cases.json';
import { getUseCaseById } from '@/components/app/use-cases/utils';

export async function generateStaticParams() {
  return useCases.map((useCase) => ({
    usecase: useCase.id,
  }));
}

export async function generateMetadata({ params }: { params: Promise<{ usecase: string }> }): Promise<Metadata> {
  const { usecase } = await params;
  const useCaseData = await getUseCaseById(usecase);
  
  if (!useCaseData) {
    return {
      title: 'Use Case Not Found',
      description: 'The requested AI use case could not be found.'
    };
  }

  return {
    title: `${useCaseData.title} | WayStation AI`,
    description: useCaseData.summary,
    openGraph: {
      type: 'article',
      title: useCaseData.title,
      description: useCaseData.summary,
      siteName: "WayStation",
      url: `/use-cases/${usecase}`,
      images: {
        url: '/images/promo-wide.png'
      }
    }
  };
}

export default async function Page({ params }: { params: Promise<{ usecase: string }> }) {
  const { usecase } = await params;
  const useCaseData = await getUseCaseById(usecase);
  
  if (!useCaseData) {
    notFound();
  }

  return <UseCasePage useCase={useCaseData} />;
}
