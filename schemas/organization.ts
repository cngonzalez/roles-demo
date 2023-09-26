import {defineField, defineType} from 'sanity'

export default defineType({
  name: 'organization',
  title: 'Organization',
  type: 'document',
  fields: [
    defineField({
      name: 'name',
      title: 'Organization Name',
      type: 'string',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'orgId',
      title: 'Organization ID',
      type: 'string',
      hidden: ({currentUser}) => !currentUser?.roles?.some((role) => role.name === 'administrator'),
    }),
  ],
})
