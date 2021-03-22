import * as React from 'react';
import {css} from '@emotion/core';

import {defaultProps, useHighlight, DefaultRenderer} from '@bendtherules/prism-react-renderer';

export function Prism({className, children}) {
  const language = className.replace(/language-/, '') || ""

  const info = useHighlight({
    ...defaultProps,
    code: children.trim(),
    language,
  });

  return <DefaultRenderer css={css`
    padding: 20px;
  `} {...info} />;
}
export default Prism;
