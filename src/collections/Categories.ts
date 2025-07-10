import type { CollectionConfig } from 'payload'

import { anyone } from './lib/access/anyone'
import { authenticated } from './lib/access/authenticated'
import { slugField } from '@/components/payload/fields/slug'

export const Categories: CollectionConfig = {
  slug: 'categories',
  access: {
    create: authenticated,
    delete: authenticated,
    read: anyone,
    update: authenticated,
    admin: authenticated,
  },
  admin: {
    useAsTitle: 'title',
  },
  fields: [
    {
      name: 'title',
      type: 'text',
      required: true,
    },
    ...slugField(),
  ],
}
