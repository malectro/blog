import * as React from 'react';
import {css} from '@emotion/core';

export function Demo({children}) {
  return <div css={css`
    background-color: var(--color-fg);
    padding: var(--space-2);
    margin-bottom: 1em;
    color: var(--color-bg);
    font-family: 'Helvetica Neue', Arial, sans-serif;
    /* font-family: var(--font-sans); */
    border-radius: var(--border-radius-box);

    a {
      color: #00649f;
    }
  `}>
    {children}
  </div>
}
