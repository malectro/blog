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
          :root {
            --font-serif: 'Merriweather', 'Georgia', serif;
            --font-sans: Montserrat, sans-serif;

            --space-2: 20px;

            --border-radius-box: 10px;

            --color-fg: #333;
            --color-bg: #f7edd2;
            --color-link: #bf6c18;
            --color-emph: #01957e;;
          }

          body {
            background: linear-gradient(to bottom right, #eee, #ccc);
            color: var(--color-fg);
          }

          code {
            font-size: inherit;
            line-height: inherit;
            padding: 0.2em;
          }

          pre {
            padding: var(--space-2);
            font-size: inherit;
            overflow-y: auto;
            border-radius: var(--border-radius-box);
          }

          a {
            color: var(--color-link);
          }

          strong {
            font-weight: 800;
          }

          strong, em {
            color: var(--color-emph);
          }

          code {
            background: #ccc;
          }

          @media (prefers-color-scheme: dark) {
            :root {
              --color-fg: #f7edd2;
              --color-bg: #333;
              --color-link: #ffcc99;
              --color-emph: #b5fff5;
            }

            body {
              background: linear-gradient(to bottom right, #333, #111);
            }

            hr {
              background: #eeaa55;
            }

            code {
              background: #444;
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
