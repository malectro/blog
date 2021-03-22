import * as React from 'react';
import {css} from '@emotion/core';

export function Demo({children}) {
  return <div css={{backgroundColor: 'white', padding: 20, marginBottom: '1em', color: 'black'}}>
    {children}
  </div>
}
