import {getCliClient} from 'sanity/cli'

const client = getCliClient({apiVersion: '2021-08-21'})

client.patch({query: `*[_type == 'sanity.imageAsset']`}).setIfMissing({orgId: 'global'}).commit()
