/**
 * Build factory
 * 
 */

const createPosts = require(`./createPosts`)
const createTags = require(`./createTags`)
const createAuthors = require(`./createAuthors`)
const createPages = require(`./createPages`)

module.exports = {
    createPosts,
    createPages,
    createTags,
    createAuthors,
}