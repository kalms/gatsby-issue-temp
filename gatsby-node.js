/**
 * Gatsby node creation
 *  Loops through and create individual content pieces based templates
 */

const Promise = require(`bluebird`)

const { createPosts, createTags, createAuthors, createPages } = require(`./config`)

/**
* Here is the place where Gatsby creates the URLs for all the
* posts, tags, pages and authors that we fetched from the Ghost site.
*/
exports.createPages = ({ graphql, actions }) => {
    /**
    * Posts
    */
    const posts = createPosts(graphql, actions)

    /**
    * Tags
    */
    const tags = createTags(graphql, actions)

    /**
    * Authors
    */
    const authors = createAuthors(graphql, actions)

    /**
    * Pages
    */
    const pages = createPages(graphql, actions)

    return Promise.all([posts, tags, authors, pages])
}
