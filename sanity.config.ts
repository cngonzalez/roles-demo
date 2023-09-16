import {ImageInputProps, InputProps, defineConfig} from 'sanity'
import {deskTool} from 'sanity/desk'
import {visionTool} from '@sanity/vision'
//import {googleMapsInput} from '@sanity/google-maps-input'
import {schemaTypes} from './schemas'
import {RoleImageComponent} from './RoleImageComponent'
// import {media} from 'sanity-plugin-media'
import {structure} from './roleStructure'
import {createClient} from '@sanity/client'

const config = {
  projectId: 'mpnns2jz',
  dataset: 'production',
}

const client = createClient({
  ...config,
  apiVersion: '2023-09-05',
  useCdn: false,
})
//unfortunately, this doesn't work in Safari.
//Safari users will be limited to the initial config
const currentUser = await client.request({
  uri: '/users/me',
  withCredentials: true,
})

const rolesForUser = currentUser?.roles?.map((role) => role.name)
const orgForUser = await client.fetch(`*[_type == "organization" && orgId in $roles][0]._id`, {
  roles: rolesForUser ?? [],
})

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
      const orgId = orgForUser
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
            value: {
              orgReference: {_type: 'organization', _ref: orgId},
            },
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
