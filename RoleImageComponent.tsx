import {FormPatch, ImageInputProps, PatchEvent, set, unset, useClient, useCurrentUser} from 'sanity'

export const RoleImageComponent = (props: ImageInputProps) => {
  const {renderDefault, onChange, value} = props
  const user = useCurrentUser()
  const client = useClient({apiVersion: 'v2023-08-22'})
  const userRoles = user?.roles || []
  const orgId = userRoles.find((role) => role.name == 'administrator')
    ? 'global'
    : userRoles[0]?.name

  //overwrite the default onChange function
  const handleChange = (patches: FormPatch | FormPatch[] | PatchEvent) => {
    //first, just do the default action given to us by the component
    onChange(patches)
    //always handle patches as an array
    const patchesToImage = Array.isArray(patches) ? patches : [patches]
    const assetId = patchesToImage.find(
      //@ts-ignore for the type overload
      (patch: FormPatch) => patch.path[0] == 'asset' && patch.type == 'set' && patch?.value?._ref
    )?.value?._ref
    //don't do anything if there is no asset
    if (!assetId) return
    //then, patch the asset with the user role so the user can see it -- it could be "global" or the orgId
    client.patch(assetId).setIfMissing({orgId}).commit()
  }
  return renderDefault({...props, onChange: handleChange})
}
