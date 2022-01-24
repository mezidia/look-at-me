# look-at-me

## About application
Look-at-me is a platform for meetings that uses the WebRTC standard.
Look-at-me-api is located in this [repository](https://github.com/mezidia/look-at-me-api).
Tech stack: fastify, socket.io and Nuxt.js for ui.

## Usage 
When you are at the home page, there are two options. The upper button is responsible for creating the room for meeting. For this you have to enter your nickname which will be shown to the other users. The first user to join the conference is automatically assigned as an owner.
After creating the room, platform generates a unique link (you can copy this link by clicking the appropriate button at the downpage). This link may be shared with other users to join them at the current room. The platform supports audio, video and screen sharing. 

As a member you are able to:
- turn on/off these options by clicking a corresponding buttons
- change your nickname (the seetings at the up-right corner)
- scale up member's video/screen view by double-clicking at it
- leave room at any moment (red button).

As the owner of room your additional ability is removing other users.

Also you are able to see a surprise from the developers by clicking the other button.

## Docker
There is a docker-compose.yml file. It can be used to run application locally. For that you have to download [docker-compose.yml](https://github.com/mezidia/look-at-me-api/blob/main/docker-compose.yml). In file's directory run command:
``` 
$ docker-compose up -d
```
After that, the app will be running on port 3000, so the platform will be available at http://localhost:3000/

## Team members
* [la7rodectus](https://github.com/La7rodectus).
* [lizardynx](https://github.com/lizardlynx).
* [tr1ckste](https://github.com/tr1ckste).
* [zavad4](https://github.com/zavad4).
