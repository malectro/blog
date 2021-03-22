import * as React from 'react';
import {css} from '@emotion/core';

export function Button({className, children}) {
  return <button className={className} css={css`
  box-sizing: border-box;
  display: flex;
  align-items: center;
  justify-content: center;
  height: 30px;
  padding: 0 10px;
  border: 1px solid black;
  border-radius: 8px;
  background-color: blue;
  color: white;
  cursor: pointer;
  `}>{children}</button>;
}

export function Button2() {
  return <div css={css`color: black; & button {background-color: #aa0000;}`}>
    Press this button.
    <Button>Click!</Button>
  </div>;
}

export function Button3({children}) {
  return <Button css={css`
  background-color: #eee;
  color: #333;
  `}>{children}</Button>;
}

export function Button4() {
  return <div css={css`color: black; & button {background-color: #aa0000;}`}>
    Gross
    <Button3>Click!</Button3>
  </div>;
}

const destructive = css`
  color: #aa0000;
`;
export function Button5({type, children}) {
  return <Button css={css`
  background-color: #eee;
  color: #333;
  ${type === 'destructive' && destructive}
  `}>{children}</Button>;
}

export function Button6() {
  return <>
    Press this button.
    <Button5 type="destructive">Click!</Button5>
  </>;
}
