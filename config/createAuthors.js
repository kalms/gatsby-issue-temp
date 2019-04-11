/**
 * createAuthors
 *  Handler to create authors / user profiles
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
        const authorTemplate = path.resolve(`./src/templates/author.js`)
        resolve(
            graphql(`
                {
                    allGhostAuthor(
                        sort: {order: ASC, fields: name},
                        filter: {
                            slug: {ne: "data-schema-author"}
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

                if (!result.data.allGhostAuthor) {
                    return resolve()
                }

                const items = result.data.allGhostAuthor.edges
                const postsPerPage = config.postsPerPage

                _.forEach(items, ({ node }) => {
                    const totalPosts = node.postCount !== null ? node.postCount : 0
                    const numberOfPages = Math.ceil(totalPosts / postsPerPage)

                    // This part here defines, that our author pages will use
                    // a `/author/:slug/` permalink.
                    node.url = `/author/${node.slug}/`

                    Array.from({ length: numberOfPages }).forEach((_, i) => {
                        const currentPage = i + 1
                        const prevPageNumber = currentPage <= 1 ? null : currentPage - 1
                        const nextPageNumber = currentPage + 1 > numberOfPages ? null : currentPage + 1
                        const previousPagePath = prevPageNumber ? prevPageNumber === 1 ? node.url : `${node.url}page/${prevPageNumber}/` : null
                        const nextPagePath = nextPageNumber ? `${node.url}page/${nextPageNumber}/` : null

                        createPage({
                            path: i === 0 ? node.url : `${node.url}page/${i + 1}/`,
                            component: path.resolve(authorTemplate),
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
