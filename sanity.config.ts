import {ImageInputProps, InputProps, defineConfig} from 'sanity'
import {deskTool} from 'sanity/desk'
import {visionTool} from '@sanity/vision'
//import {googleMapsInput} from '@sanity/google-maps-input'
import {schemaTypes} from './schemas'
import {RoleImageComponent} from './RoleImageComponent'
// import {media} from 'sanity-plugin-media'
import {structure} from './roleStructure'

export default defineConfig({
  name: 'default',
  title: 'Roles Demo',

  projectId: 'mpnns2jz',
  dataset: 'production',

  plugins: [
    deskTool({structure}),
    visionTool(),
    // media(),
    //googleMapsInput(),
  ],
  schema: {
    types: schemaTypes,
    templates: (prev, context) => {
      const typesUsersCanCreate = ['movie']
      const {currentUser} = context
      const isAdmin = currentUser?.roles?.some((role) => role.name === 'administrator')
      //if it's an admin, just give the regular functionality
      if (isAdmin) {
        return prev
      }
      const orgId = currentUser?.roles?.[0]?.name
      //if they're in an org, filter out the "default" templates, so we ALWAYS
      //create documents with our org id
      const filteredTemplates = prev.filter((template) => {
        return !typesUsersCanCreate.includes(template.id)
      })

      return [
        ...filteredTemplates,
        ...typesUsersCanCreate.map((type) => {
          return {
            id: `${type}-with-org`,
            schemaType: type,
            title: `New ${type}`,
            value: {orgId},
          }
        }),
      ]
    },
  },
  form: {
    components: {
      input: (props: InputProps) => {
        if (props.schemaType.name === 'image') {
          return RoleImageComponent(props as ImageInputProps)
        }
        //if we're not in an image, just do the default action
        return props.renderDefault(props)
      },
    },
  },
})
