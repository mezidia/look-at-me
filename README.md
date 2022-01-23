# look-at-me

## About application
Look-at-me is a platform for meetings that uses the WebRTC standard.
Look-at-me-api is located in this [repository](https://github.com/mezidia/look-at-me-api).
Tech stack: fastify, socket.io and Nuxt.js for ui.

## Usage 
When you are at the home page, there are two options. The upper button is responsible for creating the room for meeting. For this you have to enter your nickname which will be shown to the other users. The first user to join the conference is automatically assigned as an owner.
After creating the room, platform generates a unique link (you can copy this link by clicking the appropriate button at the downpage). This link may be shared with other users to join them to the current room. The platform supports audio, video and screen sharing. 

As a member you are able to:
- turn on/off these options by clicking a corresponding buttons
- change your nickname (the seetings at the up-right corner)
- scale up member's video/screen view by double-clicking at it
- leave room at any moment (red button).

As the owner of room your additional ability is removing other users.


## Build Setup

```bash
# install dependencies
$ npm install

# serve with hot reload at localhost:3000
$ npm run dev

# build for production and launch server
$ npm run build
$ npm run start

# generate static project
$ npm run generate
```

For detailed explanation on how things work, check out the [documentation](https://nuxtjs.org).

## Special Directories

You can create the following extra directories, some of which have special behaviors. Only `pages` is required; you can delete them if you don't want to use their functionality.

### `assets`

The assets directory contains your uncompiled assets such as Stylus or Sass files, images, or fonts.

More information about the usage of this directory in [the documentation](https://nuxtjs.org/docs/2.x/directory-structure/assets).

### `components`

The components directory contains your Vue.js components. Components make up the different parts of your page and can be reused and imported into your pages, layouts and even other components.

More information about the usage of this directory in [the documentation](https://nuxtjs.org/docs/2.x/directory-structure/components).

### `layouts`

Layouts are a great help when you want to change the look and feel of your Nuxt app, whether you want to include a sidebar or have distinct layouts for mobile and desktop.

More information about the usage of this directory in [the documentation](https://nuxtjs.org/docs/2.x/directory-structure/layouts).


### `pages`

This directory contains your application views and routes. Nuxt will read all the `*.vue` files inside this directory and setup Vue Router automatically.

More information about the usage of this directory in [the documentation](https://nuxtjs.org/docs/2.x/get-started/routing).

### `plugins`

The plugins directory contains JavaScript plugins that you want to run before instantiating the root Vue.js Application. This is the place to add Vue plugins and to inject functions or constants. Every time you need to use `Vue.use()`, you should create a file in `plugins/` and add its path to plugins in `nuxt.config.js`.

More information about the usage of this directory in [the documentation](https://nuxtjs.org/docs/2.x/directory-structure/plugins).

### `static`

This directory contains your static files. Each file inside this directory is mapped to `/`.

Example: `/static/robots.txt` is mapped as `/robots.txt`.

More information about the usage of this directory in [the documentation](https://nuxtjs.org/docs/2.x/directory-structure/static).

### `store`

This directory contains your Vuex store files. Creating a file in this directory automatically activates Vuex.

More information about the usage of this directory in [the documentation](https://nuxtjs.org/docs/2.x/directory-structure/store).

## Docker
There is a docker-compose.yml file. It can be used to run application locally. For that you have to download [docker-compose.yml](https://github.com/mezidia/look-at-me-api/blob/main/docker-compose.yml). In file's directory run command:
``` 
$ docker-compose up -d
```
After that, the app will be running on port 3000, so the platform will be available at http://localhost:3000/

## Team members
[la7rodectus](https://github.com/La7rodectus).
[lizardynx](https://github.com/lizardlynx).
[tr1ckste](https://github.com/tr1ckste).
[zavad4](https://github.com/zavad4).
