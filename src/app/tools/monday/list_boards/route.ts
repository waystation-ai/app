import { NextResponse } from 'next/server';

export async function GET() {
  const mockResponse = [
    {
      "id": "8369731021",
      "name": "Subitems of Single Project"
    },
    {
      "id": "8369730972",
      "name": "Single Project"
    },
    {
      "id": "7851649481",
      "name": "Subitems of Campaign Planning & Status"
    },
    {
      "id": "7851649418",
      "name": "Subitems of Marketing Launch Plan"
    },
    {
      "id": "7851649282",
      "name": "Marketing Launch Plan"
    },
    {
      "id": "7851649278",
      "name": "Campaign Planning & Status"
    },
    {
      "id": "7851649272",
      "name": "Marketing product launch plan"
    }
  ];

  return NextResponse.json(mockResponse);
}
