/**
 * createPosts
 *  Handler to create posts
 * 
 */

const _ = require(`lodash`)
const Promise = require(`bluebird`)
const path = require(`path`)
const config = require(`../src/utils/siteConfig`)
const { paginate } = require(`gatsby-awesome-pagination`)
const templateHook = require(`./templateHook`)

module.exports = (graphql, actions) => {
    const { createPage } = actions

    return new Promise((resolve, reject) => {
        const indexTemplate = path.resolve(`./src/templates/index.js`)

        resolve(
            graphql(`
                {
                    allGhostPost(
                        sort: {order: ASC, fields: published_at},
                        filter: {
                            slug: {ne: "data-schema"}
                        }
                    ) {
                        edges {
                            node {
                                slug
                                title
                                tags {
                                    name
                                    slug
                                }
                            }
                        }
                    }
                }`
            ).then((result) => {
                if (result.errors) {
                    return reject(result.errors)
                }
        
                if (!result.data.allGhostPost) {
                    return resolve()
                }
        
                const items = result.data.allGhostPost.edges
        
                _.forEach(items, ({ node }) => {
                    const isFeedback = _.find(node.tags, tag => tag.name === `#feedback`)

                    if (!isFeedback) {
                        // This part here defines, that our posts will use
                        // a `/:slug/` permalink.
                        node.url = `/${node.slug}/`

                        const hashTags = _.find(node.tags, tag => tag.name.match(/^#.+$/))
            
                        createPage({
                            path: node.url,
                            component: path.resolve(hashTags ? templateHook(`post`, hashTags.name.substring(1)) : templateHook(`post`)),
                            context: {
                                // Data passed to context is available
                                // in page queries as GraphQL variables.
                                slug: node.slug,
                                title: node.title,
                            },
                        })
                    }
                })
        
                // Pagination for posts, e.g., /, /page/2, /page/3
                paginate({
                    createPage,
                    items: items,
                    itemsPerPage: config.postsPerPage,
                    component: indexTemplate,
                    pathPrefix: ({ pageNumber }) => {
                        if (pageNumber === 0) {
                            return `/`
                        } else {
                            return `/page`
                        }
                    },
                })
        
                return resolve()
            })
        )
    })
}
