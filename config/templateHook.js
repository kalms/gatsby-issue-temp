/**
 *  templateHook
 *  Handler to create posts
 * 
 * @author Rasmus Kalms <rkalms@vertic.com>
 */

const _ = require(`lodash`)
const fs = require(`fs`)
const path = require(`path`)

module.exports = (template, type) => {
    const dir = fs.readdirSync(`./src/templates/overrides`)

    // Return the captured match
    const re = new RegExp(`${template}--${type}.js`, `g`)
    const match = _.find(dir, tpl => tpl.match(re))

    if (match) {
        return path.resolve(`./src/templates/overrides/${match}`)
    } else {
        return path.resolve(`./src/templates/${template}.js`)
    }
}