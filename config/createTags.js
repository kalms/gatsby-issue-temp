/**
 * createTags
 *  Handler to create tags
 * 
 */

const _ = require(`lodash`)
const Promise = require(`bluebird`)
const path = require(`path`)
const config = require(`../src/utils/siteConfig`)
const { paginate } = require(`gatsby-awesome-pagination`)

module.exports = (graphql, actions) => {
    const { createPage } = actions

    return new Promise((resolve, reject) => {
        const tagsTemplate = path.resolve(`./src/templates/tag.js`)
        resolve(
            graphql(`
              {
                  allGhostTag(
                      sort: {order: ASC, fields: name},
                      filter: {
                          slug: {ne: "data-schema"}
                      }
                  ) {
                      edges {
                          node {
                              slug
                              url
                              postCount
                          }
                      }
                  }
              }`
            ).then((result) => {
                if (result.errors) {
                    return reject(result.errors)
                }

                if (!result.data.allGhostTag) {
                    return resolve()
                }

                const items = result.data.allGhostTag.edges
                const postsPerPage = config.postsPerPage

                _.forEach(items, ({ node }) => {
                    const totalPosts = node.postCount !== null ? node.postCount : 0
                    const numberOfPages = Math.ceil(totalPosts / postsPerPage)

                    // This part here defines, that our tag pages will use
                    // a `/:slug/` permalink.
                    node.url = `/${node.slug}/`

                    Array.from({ length: numberOfPages }).forEach((_, i) => {
                        const currentPage = i + 1
                        const prevPageNumber = currentPage <= 1 ? null : currentPage - 1
                        const nextPageNumber = currentPage + 1 > numberOfPages ? null : currentPage + 1
                        const previousPagePath = prevPageNumber ? prevPageNumber === 1 ? node.url : `${node.url}page/${prevPageNumber}/` : null
                        const nextPagePath = nextPageNumber ? `${node.url}page/${nextPageNumber}/` : null

                        createPage({
                            path: i === 0 ? node.url : `${node.url}page/${i + 1}/`,
                            component: path.resolve(tagsTemplate),
                            context: {
                                // Data passed to context is available
                                // in page queries as GraphQL variables.
                                slug: node.slug,
                                limit: postsPerPage,
                                skip: i * postsPerPage,
                                numberOfPages: numberOfPages,
                                humanPageNumber: currentPage,
                                prevPageNumber: prevPageNumber,
                                nextPageNumber: nextPageNumber,
                                previousPagePath: previousPagePath,
                                nextPagePath: nextPagePath,
                            },
                        })
                    })
                })

                return resolve()
            })
        )
    })
}
