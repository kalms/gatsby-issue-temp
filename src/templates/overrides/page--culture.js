import React from 'react'
import PropTypes from 'prop-types'
import { graphql } from 'gatsby'

import { Layout } from '../../components/common'
import { MetaData } from '../../components/common/meta'
import { Hero, BasicPage, SliderList } from '../../components/organisms'

/**
* Single page (/:slug)
*
* This file renders a single page and loads all the content.
*
*/
const Page = ({ data, location }) => {
    const page = data.ghostPage
    const slug = page.primary_tag ? page.primary_tag.slug : ``

    function renderSliderList() {
        const output = {
            title: `Vertic Moments`,
            text: `A glimpse into what it means to be a Vertic Hero`,
            list: data.allFile.edges,
        }

        return (
            <SliderList data={output} />
        )
    }

    return (
        <>
            <MetaData
                data={data}
                location={location}
                type="website"
            />
            <Layout theme="dark">
                <Hero post={page} type={slug} />
                <BasicPage post={page} theme="white" />

                {renderSliderList()}
                
            </Layout>
        </>
    )
}

Page.propTypes = {
    data: PropTypes.shape({
        ghostPage: PropTypes.shape({
            title: PropTypes.string,
            html: PropTypes.string,
            feature_image: PropTypes.string,
        }),
        allFile: PropTypes.object,
    }),
    location: PropTypes.object,
}

export default Page

export const postQuery = graphql`
    query($slug: String!) {
        allFile(filter: {
            extension: {regex: "/(jpg)/"},
            relativeDirectory: {eq: "moments"}
        }) {
            edges {
                node {
                    childImageSharp {
                        sizes(maxWidth: 400, quality: 100) {
                            ...GatsbyImageSharpSizes
                        }
                    }
                }
            }
        }
        ghostPage(slug: { eq: $slug }) {
            ...GhostPageFields
        }
    }
`
