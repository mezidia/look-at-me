<template>
  <v-card 
  elevation=2 
  class="user-block-holder ma-5"
  height=150px
  :img="image"
  width=200px>
    <p :style="{'visibility': cameraOn ? 'hidden' : 'visible'}" class="name">{{ name }}</p>
    <video :style="{'visibility': !cameraOn ? 'hidden' : 'visible'}" width="200px" height="150px" :id="'video' + name"></video>
    <OnOffIcon class="devices-onoff" iconName="mdi-microphone" :clicked="micClicked"/>
  </v-card>
</template>

<script>
import { Prop, Vue } from 'nuxt-property-decorator'
import Component from 'nuxt-class-component'
import OnOffIcon from '../components/OnOffIcon.vue'

@Component({
  components: {OnOffIcon}
})

export default class UserBlock extends Vue {
  @Prop({type: String, required: true}) name;
  @Prop({type: Boolean, required: false}) cameraOn;
  @Prop({type: String, required: true}) image;
  @Prop({type: Boolean, required: false}) micClicked;
}
</script>

<style>
.user-block-holder {
  position: relative;
}

.name {
  width: 100%;
  text-align: center;
  position: absolute;
  bottom: 30%;
}

video {
  border-radius: 4px;
}

p {
  text-shadow: 1px 1px 2px black;
}

.devices-onoff {
  position: absolute;
  bottom: 40px;
  left: 10px;
}
</style>
