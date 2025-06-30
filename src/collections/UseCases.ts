import type { CollectionConfig } from 'payload'
import { authenticated } from './lib/access/authenticated'
import { authenticatedOrPublished } from './lib/access/authenticatedOrPublished'
import { generatePreviewPath } from '@/components/payload/utilities/generatePreviewPath'
import { slugField } from '@/components/payload/fields/slug'

export const UseCases: CollectionConfig<'use-cases'> = {
  slug: 'use-cases',
  access: {
    create: authenticated,
    delete: authenticated,
    read: authenticatedOrPublished,
    update: authenticated,
  },
  defaultPopulate: {
    title: true,
    slug: true,
  },
  fields:[
    {
      name: 'title',
      type: 'text',
      required: true,
    },
    {
      name: 'summary',
      type: 'textarea',
      required: true,
    },
    {
      name: 'callToAction',
      type: 'text',
      required: true,
    },
    {
      name: 'integrationRecipe',
      type: 'textarea',
      required: true,
    },
    {
      name: 'bulletPoints',
      type: 'array',
      fields: [
        {
          name: 'point',
          type: 'text',
          required: true,
        },
      ],
    },
    {
      name: 'publishedAt',
      type: 'date',
      admin: {
        date: {
          pickerAppearance: 'dayAndTime',
        },
        position: 'sidebar',
      },
      hooks: {
        beforeChange: [
          ({ siblingData, value }) => {
            if (siblingData._status === 'published' && !value) {
              return new Date()
            }
            return value
          },
        ],
      },
    },
    ...slugField(),
  ],
admin: {
    defaultColumns: ['title', 'slug', 'updatedAt'],
    livePreview: {
      url: ({ data, req }) => {
        const path = generatePreviewPath({
          slug: typeof data?.slug === 'string' ? data.slug : '',
          collection: 'use-cases',
          req,
        })

        return path
      },
    },
    preview: (data, { req }) =>
      generatePreviewPath({
        slug: typeof data?.slug === 'string' ? data.slug : '',
        collection: 'use-cases',
        req,
      }),
    useAsTitle: 'title',
  },  
  versions: {
    drafts: {
      autosave: {
        interval: 100, // We set this interval for optimal live preview
      },
      schedulePublish: true,
    },
    maxPerDoc: 50,
  },
}