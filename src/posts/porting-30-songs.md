---
title: Porting 30 Songs
date: "2021-04-07T22:12:03.284Z"
description: for posterity
type: UI
---

A lifetime and presidency ago, I volunteered to design and build [30 Days, 30 Songs](https://kylejwarren.com/30-days-30-songs), a dynamic playlist of songs written in protest of Trump's candidacy. I loved working on this project, but in retrospect I do wonder if I should have just been canvasing during those critical days.

Regardless, after a while the songs stopped being posted and I let the site sit on the Heroku free tier. This worked until late 2020 when my MongoDB provider closed up shop – deleting my database. I might have taken an "all things pass" attitude here and moved on, but something about the site made we want to preserve it. Maybe it was because it was the only app where I'd completely owned design? Maybe I just didn't think websites that worked had to die? I decided to press on.

First off, what form should it take? I could archive the site by copying every page and saving each as an HTML file. This would be fine, but it would make editing it or reviving it (if I ever wanted to do that) much harder.

On the other hand, the CMS admin was no longer necessary since I would be the only person editing it going forward. Moving to a new database provider and web host to run a server no one was using would be pointlessly expensive.

This brought me to the world of Static Site Generators, and because I was writing React professionally, I arbitrarily settled on Gatsby. I want to outline how I went about porting my site because even though the CMS I used is long since deprecated, the general process of moving from a CMS to an SSG is not uncommon and could be applicable to anyone trying go get cheaper hosting for their blog.

## A Note on Keystone
The CMS I originally chose was [Keystone](https://www.keystonejs.com). It met all of my base requirements:
- was written in JS
- handled session and auth out of the box
- had a rich CMS admin and ORM
- had a simple view layer that supported [Pug](https://pugjs.org)
- was SEO compliant
- was easily deployable to Heroku

But I lied about it being deprecated – sorta. The version I used was `0.3.19`, and Keystone is in the process of releasing `6.0.0`, which is now a headless CMS and ORM. So Keystone is still around, but it isn't at all what it once was.

By default Keystone worked with MongoDB, which is what I used in production.

## A Note on Gatsby
Gatsby isn't just a Static Site Generator. It's a full-featured front-end built on top of React. React itself does not include a router, build system, or data management system, so frameworks like Gatsby (and [Next](https://nextjs.org)) have taken upon themselves to rectify this.

Gatsby has an extensive plugin system that allows developers to declare all sorts of data sources and then import this data into their applications. This blog uses `gatsby-plugin-mdx` to generate blog post pages for each markdown file I put in a certain folder.

## How I Ported It

### Templates and Components
My Keystone app used Pug, but Gatsby pages are written in React. There's probably a pug-to-react tool out there, but there's no way it would have been perfect, and my site only had 3 pages. I decided to edit the files by hand.

First off, each one of my pages extended a default layout template.
```pug
extends ../layouts/default

block title
  My Song

block content
  Song content goes here
```

React components do not extend other components. They import them. This is actually more flexible because there is no limit to the amount of components you can use.

```jsx
import Layout from './layout.jsx';


export default function Song() {
  return <Layout title="My Song">
    Song content goes here
  </Layout>;
}
```

### SEO, Open Graph, and React Helmet
My layout template allowed extending templates to override and insert tags into the document's `head` tag. This is extremely important for SEO and share-ability, which were primary concerns of the original site.

Gatsby recommends using `react-helmet` to manage the content of the `head` tag. It provides a component that works like a regular `head` tag, but allows it to be placed anywhere in the document tree.

```jsx
import {Helmet} from 'react-helmet';
import Layout from './layout.jsx';


export default function Song() {
  return <Layout>
    <Helmet>
      <title>My Song</title>
      <meta name="description" content="my description" />
    </Helmet>
    Song content goes here
  </Layout>;
}
```

### Linking
One of the advantages of the Gatsby Static Site Generator vs a Single-page App framework like [create-react-app](https://create-react-app.dev/) is that browsers do not need to run JavaScript to render the initial page. This means that even without JS, all the links on my site would continue to work without any refactoring. 

But Gatsby comes with built-in support for [reach-router](https://reactrouter.com/), which allows the user to navigate between pages without hitting the server. To enable this, I had to update all the anchor tags that weren't pointed to external sites so that they used the `Link` component. Note that the `href` attribute changes to `to`.

```jsx
// Before
<a href="/about">About</a>
<a href="https://kylejwarren.com">My Site</a>

// After
import {Link} from 'gatsby';

<Link to="/about">About</Link>
<a href="https://kylejwarren.com">My Site</a>
```

### Images
There were two types of images on my site: static images like the logo and hero, and dynamic images uploaded by the content manager for each song.

Ignoring the dynamic images (which I'll get to later), the static images did not work out of the box. Gatsby recommends using a pair of plugins called `gatsby-plugin-image` and `gatsby-plugin-sharp` when using static images on a site. These plugins will resolve image file paths and optimize them for the web. Most of my images were optimized already, but I figured I'd do things the Gatsby way by importing their `StaticImage` component.

```jsx
// Before
<img src="/images/logo.svg" />

// After
import {StaticImage} from 'gatsby-plugin-image';

<StaticImage src="../images/logo.svg" />
```

There are a couple things to note about `StaticImage`:
- It does not allow you to resolve the path to the image at runtime. This means the `src` must be a hard coded string.
- It considers your images to be relative to your component so in this case I had to prefix my `src` with `..`.

One weird thing: Gatsby also allows you to import images as src strings (as in `create-react-app`), but this will bypass image optimization. Most of my images were SVGs, which don't generally need to be optimized, so this worked fine.

```jsx
import myImageSrc from '../images/my-image.svg';

<img src={myImageSrc} />
```

### What About The Data?
You probably remember me saying that my database was "deleted". This was annoying, but I'd used `mongodump` fairly frequently to back it up. This meant I still had my data – just in an un-queryable, binary form.

My db had 4 tables:
- pages, various site pages written in markdown like the About and Masthead pages
- songs, links to the songs on spotify and youtube as well as information and artists notes
- navlinks, links to pages in the side navigation
- users, account information for the CMS users

But how would I source data into my app? The simplest option would probably be to create an account with a new MongoDB provider and `mongorestore` the dump. Then I could use a mongo-to-graphql adapter and source my data from there.

I didn't go down this road for a few reasons. Mainly, I'd been burned by a db provider before, and since the site was no longer being updated by anyone but me, it didn't need a database. Everything could be managed by the filesystem and git.

Gatsby excels at sourcing data from the filesystem. As mentioned before, this blog uses `gatsby-source-filesystem` and `gatsby-plugin-mdx` to generate posts. I considered using markdown files for all my data, and this would have made particular sense for `pages` which were just an identifier `slug` string and a bunch of markdown, but it kinda broke down for things like `navlinks` which had no markdown at all.

Instead, I decided to go with `gatsby-transformer-json`, which would allow me to read json files as data sources. I started experimenting with this by manually adding json. I created 3 files in a folder called `src/cms`: `navlinks.json`, `songs.json`, and `pages.json`. Each contained an array of objects like so.

```json
[
  {"url": "/about", "name": "About"},
  {"url": "/masthead", "name": "Masthead"}
]
```
_When will JSON allow trailing commas?!_

#### Loading With graphql
Gatsby uses `graphql` to load data from its sources. It comes with a console that allows you to easily inspect your current data and run test queries. Since I don't know `graphql` that well, this was invaluable to me. (I still don't really understand what `edges` are for, but whatever.)

The `useStaticQuery` hook allows a component to query data. Note that the word "Static" here means these queries are solved at build time when the site is generated. This means there are a few restrictions in practice that I didn't really run into.

To query the `navlinks`. I wrote the following. Note that `gatsby-transformer-json` allows developers to query files using `allFilenameJson` as the top-level resource name.

```jsx
import {useStaticQuery, graphql, Link} from 'gatsby';

export default function Navigation() {
  const {
    allNavlinksJson: {
      nodes,
    },
  } = useStaticQuery(query);

  return (
    nodes.map(node => (
      <Link key={node.url} to={node.url}>{node.name}</Link>
    ))
  );
}

const query = graphql`
  query NavigationQuery {
    allNavlinksJson {
      nodes {
        url
        name
      }
    }
  }
`;
```

#### Making Pages
By default Gatsby will generate pages for any components in the folder `/src/pages`, but because my data is dictating whether or not pages exist, I had to instruct Gatsby to generate them at build time.

Just for redundancy's sake, Gatsby generates actual files for each page. It does not determine the existence of a page at runtime. You can chock up all the weirdness in Gatsby to this fact.

To make pages based on data, I had to edit the `gatsby-node.js` file in my project root.

```javascript
exports.createPages = async ({actions, graphql}) => {
  const {createPage} = actions;

  const songComponent = path.resolve(`src/components/song.jsx`);

  const songs = await graphql(`
    {
      allSongsJson(
        limit: 1000
      ) {
        edges {
          node {
            id
            number
          }
        }
      }
    }
  `);

  if (songs.errors) {
    throw songs.errors;
  }

  songs.data.allSongsJson.edges.forEach(({node}) => {
    createPage({
      path: String(node.number),
      component: songComponent,
      context: {id: node.id},
    });
  });
};
```

It exports a `createPages` function that queries my data for songs and then creates a page for each one. The `song.jsx` file that it references is considered a "page". A Gatsby page file consists of a `default` export, the component, and optional `query` export, which is the graphql query that automatically supplies data to the component. Both the `query` and the component get access to the `context` that was supplied when the page was created. This allows the page to query for individual songs using their node id.

```jsx
import {graphql} from 'gatsby';
import Layout from './layout.jsx';

export default function Song({data: {songsJson}}) {
  return (
    <Layout>
      <div>{songsJson.title}</div>
      <div>{songsJson.artist}</div>
      <img src={songsJson.image.url} />
      <iframe src={`https://embed.spotify.com/?uri=${songsJson.spotifyUrl}`} />
    </Layout>
  );
}

export const query = graphql`
  query SongQuery($id: String!) {
    songsJson(id: {eq: $id}) {
      title
      artist
      spotifyUrl
      image {
        url
      }
    }
  }
`;
```

_Note that I'm using another resource supplied by the plugin, `songsJson`, which is similar to `allSongsJson` or `allNavlinksJson` but only queries for a single item._


#### But What About The Real Data?
At this point I had a working website, but I was using dummy data that I'd hard coded. I needed to transform the binary data in my backup to JSON.

My first thought was to spin up a local Mongo server and run `mongorestore` to recreate all my collections. Then I could write a script to extract the data and generate JSON. But it turns out that Mongo also provides a `mongoexport` command, which outputs json representations of your collections into files. This would be far simpler.

I ran mongoexport.
```sh
mongoexport --db=my_db --collection=navlinks --out=navlinks.json
```

And got this.
```json
{"_id":{"$oid":"57eeb263194c0d03009fc901"},"url":"/about","name":"About","__v":0}
{"_id":{"$oid":"57fafa932510f803000e3aad"},"url":"/masthead","name":"Masthead","__v":0}
```

Neat! But it wasn't JSON parseable. Instead, it was a list of objects separated by line breaks – something Gatsby couldn't read. I did a little more research and again considered writing a script before I found this flag `--jsonArray`.

I reran mongoexport.
```sh
mongoexport --db=my_db --collection=navlinks --out=navlinks.json --jsonArray
```

And got this.
```json
[
  {"_id":{"$oid":"57eeb263194c0d03009fc901"},"url":"/about","name":"About","__v":0},
  {"_id":{"$oid":"57fafa932510f803000e3aad"},"url":"/masthead","name":"Masthead","__v":0}
]
```
_Note that `mongoexport` didn't actually add linebreaks to this file. I did for readability._

Hooray! Turns out that transforming my binary mongo backup files into something that Gatsby could read was less than 5 minutes of work. At this point, my site was done.


## But Why Though?
In retrospect, archiving this site as HTML files could have been a much better use of my time. In fact, the internet archive has great snapshots of it already.

But porting a CMS-built site to one built with an SSG was actually kinda fun? And it helped round out my understanding of what tools like Gatsby actually do – and why they're so particular about everything being "static".

Interestingly enough, because the latest iteration of Keystone is now a headless CMS, and Gatsby is a front-end framework, I could have used Keystone as a Gatsby data source if I'd wanted. This would have meant running them both together and possibly on separate machines.

Until next time!
