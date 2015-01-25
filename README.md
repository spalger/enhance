# Enhance

By Team Enhance - part of the [Staticshowdown](staticshowdown.com)

# The Problem


Your project We have a lot of users with a lot of great ideas, and really like seeing people filing issues in to see their feature requests and recommendations, and we

These days, just about everyone doing software development has used Github at least a little. Collectively, I think we can all agree that it's ushered in an incredible shift in the way we maintain our projects, especially open source ones. But of course, it's not without its shortcomings.

One area where Github really falls is managing feature requests. These requests can get overwhelming, especially if you're maintaining a large open source project with a lot of users and a lot of great feedback. Labels are a start, but it's not enough, and it doesn't give you much visibility into what your users really want to see.

Half of our team works on Kibana, an open source project from Elasticsearch. For us, Github fits our workflow almost perfectly, and it's been an indespensible tool. But, we have [over 270 *enhancement* issues](https://github.com/elasticsearch/kibana/issues?q=is%3Aopen+is%3Aissue+label%3Aenhancement) on the project, which is intimidating and really hard to sort through.

# Enter *Enhance*

Enhance leverages the Github API to do its job, and it does so in such a way that your users never even have to interact with it to take advantage of it if they don't want to.

We've taken a convention already being used throughout Github and uses it to provide visibility to the features your users want the most - the `+1`. Enhances uses this valuable feedback to assign a score to your issues, giving your users a way to let you know what features they think are valuable, and you a clear way to see this feedback.

# Github powered

Enhance is a hosted solution, but one you can host yourself. Our intention is to have you fork Enhance and host it as a `gh-pages`, either on the project you would like to track, or as its own repo. Clone it, set a couple settings in a config file, push it up to your own repo, and let it rip.

It even uses Github gists to cache a payload of your project to cut down on the number of API requests needed for users to get up and running.

The only additional dependency is Firebase, which is needed to provide OAuth handling. Firebase was chosen because it's dead simple to set up, and they offer a pretty liberal free usage tier. In the future, we plan to abstract the auth handling and allow you to use any service you'd like, or even roll your own.

# Why did we build this?

We wanted this for use with Kibana, and we wanted to build it in such a way that other maintainers could benefit equally from it as well. After a little planning, we realized that this could be built as a static page with some backend services to handle things we just can't do in the browser.

After sitting on the idea for a bit, decided to build it (or at least start building it) during the 2nd [StaticShowdown](http://www.staticshowdown.com/). The timing was perfect, and we were itching for a big coding session already.

# Interesting implementations

**Caching repo payload in a gist**

In order to cut down on Github API calls, particularly for non-authenticated users, we needed to pre-load existing repo data - we chose Github gists to do this to make it as easy as possible for maintainers.

**Frontend data**

The data is loaded in to [PouchDB](http://pouchdb.com/) giving us a fast, simple way to put data into the site. We also index this data in the browser using [lunr.js](http://lunrjs.com/), to offer basic searching.

**Reactive Web Components**

Web components are being touted as the future of frontend web development, custom elements in particular. Additionally, virtual DOM diffing looks like the future of DOM abstraction - so we thought we'd try combining them. However, [React](https://facebook.github.io/react/) is a bit big for our needs, and [virtual-dom](https://github.com/Matt-Esch/virtual-dom) was a little basic. We settled on using [Deku](https://github.com/segmentio/deku) and some custom wrapper code to achieve what we wanted.

**Javascript Next**

While we're looking towards the future with web components, we thought we should also try building our application in [Javascript 2015](https://esdiscuss.org/topic/javascript-2015), using [Gulp](http://gulpjs.com/) and [webpack](http://webpack.github.io/) to run our code through [6to5](https://6to5.org/) and automate our build process.