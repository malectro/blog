import * as React from 'react';
import {css} from '@emotion/core';

export function Example1() {
  return <nav css={css`display: flex;`}>
    <SearchInput />
  </nav>;
}

export function Example2() {
  return <nav css={css`display: flex; flex-flow: column;`}>
    <SearchInput />
    <Link href="/">Home</Link>
    <Link href="/posts">Posts</Link>
  </nav>;
}

export function Example3() {
  return <nav css={css`display: flex; align-items: center;`}>
    <svg viewBox="0 0 20 20" width="20" height="20">
      <path d="M 0,20 L 10,0 L 20,20 z" fill="blue" />
    </svg>
    <SearchInput css={css`margin-left: 10px;`} />
  </nav>;
}

export function Example4() {
  return <nav css={css`display: flex; flex-flow: column;`}>
    <SearchInput css={css`margin-left: 10px;`} />
    <Link href="/">Home</Link>
    <Link href="/posts">Posts</Link>
  </nav>;
}

export function Example5() {
  return <nav css={css`
    display: flex;
    align-items: center;
    & > * + * {
      margin-left: 10px;
    }
  `}>
    <svg viewBox="0 0 20 20" width="20" height="20">
      <path d="M 0,20 L 10,0 L 20,20 z" fill="blue" />
    </svg>
    <SearchInput />
    <Link to="/">Home</Link>
    <Link to="/posts">Posts</Link>
  </nav>;
}

function SearchInput({className}) {
  return <input type="search" className={className} placeholder="Search..." />
}

function Link(props) {
  return <a onClick={event => event.preventDefault()} {...props} />;
}
