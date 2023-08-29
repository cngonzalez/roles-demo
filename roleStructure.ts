import {StructureResolver} from 'sanity/desk'

export const structure: StructureResolver = (S, context) => {
  const {currentUser} = context
  const isAdmin = currentUser?.roles?.some((role) => role.name === 'administrator')
  //if admin, return everything as it was
  if (isAdmin) {
    return S.list()
      .title('Content')
      .items([...S.documentTypeListItems()])
  }
  const role = currentUser?.roles?.[0]?.name
  const itemsWithRoleFilter = S.documentTypeListItems()
    .map((item) => {
      const schemaType = item.getSchemaType()?.name
      console.log('schemaType', schemaType)
      return S.documentTypeListItem(schemaType).child(
        S.documentTypeList(schemaType)
          .filter('_type == $type && orgId == $role')
          .params({type: schemaType, role})
      )
    })
    .filter(Boolean)

  return S.list()
    .title('Content')
    .items([...itemsWithRoleFilter])
}
