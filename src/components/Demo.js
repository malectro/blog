import * as React from 'react';
import {css} from '@emotion/core';

export function Demo({children}) {
  return <div css={css`
    @media (prefers-color-scheme: dark) {
      background-color: var(--color-fg);

      a {
        color: #00649f;
      }
    }

    @media (prefers-color-scheme: light) {
      box-shadow: 0 0 10px rgba(0, 0, 0, 0.2);
      background: white;
    }

    padding: var(--space-2);
    margin-bottom: 1em;
    color: var(--color-bg);
    font-family: 'Helvetica Neue', Arial, sans-serif;
    /* font-family: var(--font-sans); */
    border-radius: var(--border-radius-box);
  `}>
    {children}
  </div>
}
