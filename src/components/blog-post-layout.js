import React from 'react';
import { Link, graphql, useStaticQuery} from 'gatsby';
import { css } from '@emotion/core';
import { MDXProvider } from "@mdx-js/react";

import Bio from '../components/bio';
import Layout from '../components/layout';
import SEO from '../components/seo';
import Prism from '../components/Prism';
import { rhythm, scale } from '../utils/typography';

const shortcodes = {
  pre: (props) => <div {...props} />,
  code: Prism,
};

export function BlogPostLayout({
  location,
  description,
  pageContext,
  children,
}) {
  const { previous, next, frontmatter } = pageContext;
  const data = useStaticQuery(
    graphql`
      query BlogLayoutQuery {
        site {
          siteMetadata {
            title
            author
          }
        }
      }
    `
  );
  const siteTitle = data.site.siteMetadata.title;

  return (
    <Layout location={location} title={siteTitle}>
      <SEO title={frontmatter.title} description={description} />
      <h1>{frontmatter.title}</h1>
      <p
        style={{
          ...scale(-1 / 5),
          display: `block`,
          marginBottom: rhythm(1),
          marginTop: rhythm(-1),
        }}
      >
        {frontmatter.date}
      </p>
      <div
        css={css`
          /* TODO (kyle): merge this with the global styles? */
          & hr {
            background: #eeaa55;
          }

          & code {
            background: #444;
            padding: 0.2em;
          }

          & strong {
            font-weight: 800;
          }
        `}
      >
        <MDXProvider components={shortcodes}>{children}</MDXProvider>
      </div>
      <hr
        style={{
          marginBottom: rhythm(1),
        }}
      />
      <Bio />

      <ul
        style={{
          display: `flex`,
          flexWrap: `wrap`,
          justifyContent: `space-between`,
          listStyle: `none`,
          padding: 0,
        }}
      >
        <li>
          {previous && (
            <Link to={previous.fields.slug} rel="prev">
              ← {previous.frontmatter.title}
            </Link>
          )}
        </li>
        <li>
          {next && (
            <Link to={next.fields.slug} rel="next">
              {next.frontmatter.title} →
            </Link>
          )}
        </li>
      </ul>
    </Layout>
  );
}

export default BlogPostLayout;
