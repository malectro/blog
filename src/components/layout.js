import React from "react"
import { Link } from "gatsby"
import {Global, css} from '@emotion/core';

import { rhythm, scale } from "../utils/typography"

function Layout(props) {
    const { location, title, children } = props
    const rootPath = `${__PATH_PREFIX__}/`
    let header

    if (location.pathname === rootPath) {
      header = (
        <h1
          style={{
            ...scale(1.5),
            marginBottom: rhythm(1.5),
            marginTop: 0,
          }}
        >
          <Link
            style={{
              boxShadow: `none`,
              textDecoration: `none`,
              color: `inherit`,
            }}
            to={`/`}
          >
            {title}
          </Link>
        </h1>
      )
    } else {
      header = (
        <h3
          style={{
            fontFamily: `Montserrat, sans-serif`,
            marginTop: 0,
          }}
        >
          <Link
            style={{
              boxShadow: `none`,
              textDecoration: `none`,
              color: `inherit`,
            }}
            to={`/`}
          >
            {title}
          </Link>
        </h3>
      )
    }
    return (
      <div
        style={{
          marginLeft: `auto`,
          marginRight: `auto`,
          maxWidth: rhythm(24),
          padding: `${rhythm(1.5)} ${rhythm(3 / 4)}`,
        }}
      >
        <Global
          styles={css`
          @media (prefers-color-scheme: dark) {
            body {
              background: linear-gradient(to bottom right, #333, #111);
              color: #ffeebb;
            }

            a {
              color: #ffcc99;
            }

            blockquote {
              color: #ffeedd;
            }
          }
          `}
        />
        <header>{header}</header>
        <main>{children}</main>
        <footer style={
          {color: '#999'}
        }>
          Oof.
        </footer>
      </div>
    )
  }

export default Layout
