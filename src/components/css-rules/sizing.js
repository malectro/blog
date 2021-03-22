import * as React from 'react';
import {css} from '@emotion/core';


export function Example1() {
  return (
    <>
      Our fixed-size button
      <Button css={css`
        width: 80px;
        height: 30px;
      `}>Click!</Button>
    </>
  );
}

export function Example2() {
  return (
    <Button>Our ranged-size button</Button>
  );
}

export function Example3() {
  return <>
    RSVP
    <div css={css`
      display: flex;
      & > * + * {
        margin-left: 10px;
      }
      & > * {
        width: 100px;
      }
    `}>
      <Button>Yes</Button>
      <Button>No</Button>
      <Button>Maybe</Button>
    </div>
  </>
}

function Button(props) {
  return <button css={css`
  box-sizing: border-box;
  display: flex;
  align-items: center;
  justify-content: center;
  min-height: 30px;
  min-width: 80px;
  padding: 0 10px;
  border: 1px solid black;
  border-radius: 8px;
  background-color: #eee;
  color: #333;
  cursor: pointer;
  `} {...props} />;
}

