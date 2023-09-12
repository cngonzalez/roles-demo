//run with `sanity exec --with-user-token ./populateOrgs.ts`
//or from an environment / callback where you can run with a token

import {getCliClient} from 'sanity/cli'

const client = getCliClient({apiVersion: '2023-02-15'})

const orgs = [
  {_id: 'frist', name: 'Frist'},
  {_id: 'parthenon', name: 'Parthenon'},
]

orgs.forEach(async (org) => {
  const doc = await client.create({
    _type: 'organization',
    ...org,
    orgId: org._id,
  })
  console.log(`Created ${doc._id}`)
})
