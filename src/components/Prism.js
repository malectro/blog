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

  return <DefaultRenderer {...info} />;
}
export default Prism;
