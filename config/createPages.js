/**
 * createPages
 *  Handler to create pages content type
 * 
 */

const Promise = require(`bluebird`)
const path = require(`path`)
const templateHook = require(`./templateHook`)

module.exports = (graphql, actions) => {
    const { createPage } = actions

    return new Promise((resolve, reject) => {
        graphql(`
        {
            allGhostPage(
                sort: {order: ASC, fields: published_at},
                filter: {
                    slug: {ne: "data-schema-page"}
                }
            ) {
                edges {
                    node {
                        slug
                        url
                        title
                    }
                }
            }
        }`
        ).then((result) => {
            if (result.errors) {
                return reject(result.errors)
            }

            if (!result.data.allGhostPage) {
                return resolve()
            }

            const items = result.data.allGhostPage.edges

            items.map(({ node }) => {
                // This part here defines, that our pages will use
                // a `/:slug/` permalink.
                node.url = `/${node.slug}/`

                return createPage({
                    path: node.url,
                    component: templateHook(`page`, node.slug),
                    context: {
                        // Data passed to context is available
                        // in page queries as GraphQL variables.
                        slug: node.slug,
                        title: node.title,
                    },
                })
            })

            return resolve()
        })
    })
}
