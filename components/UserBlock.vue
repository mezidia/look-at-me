<template>
  <v-card 
  elevation=2 
  class="user-block-holder ma-5"
  :height="height + 'px'"
  :img="image"
  :width="width + 'px'">
    <p :style="{'visibility': cameraOn || pageLoading ? 'hidden' : 'visible'}" class="name">{{ name }}</p>
    <video :style="{'visibility': !cameraOn ? 'hidden' : 'visible'}" autoplay :width="width + 'px'" :height="height + 'px'" :id="'video' + id" :muted="muted"></video>
    <v-row class="user-options">
      <OnOffIcon iconName="mdi-microphone" :pointer="false" :clicked="micClicked"/>
      <OnOffIcon v-if="admin" class="ml-3" iconName="mdi-exit-to-app" :onClick="removePersonFromRoom"/>
    </v-row>
  </v-card>
</template>

<script>
import { Prop, Vue } from 'nuxt-property-decorator'
import Component from 'nuxt-class-component'
import OnOffIcon from '../components/OnOffIcon.vue'
import { Emit } from 'vue-property-decorator'

@Component({
  components: {OnOffIcon}
})

export default class UserBlock extends Vue {
  @Prop({type: String, required: true}) name;
  @Prop({type: String, required: true}) id;
  @Prop({type: Boolean, required: false}) cameraOn;
  @Prop({type: String, required: true}) image;
  @Prop({type: Boolean, required: false}) micClicked;
  @Prop({type: Number, required: true}) width;
  @Prop({type: Number, required: true}) height;
  @Prop({type: Boolean, required: false, default: false}) muted;
  @Prop({type: Boolean, required: false, default: false}) pageLoading;
  @Prop({type: Boolean, required: false, default: false}) admin;

  @Emit('removePersonFromRoom')
  removePersonFromRoom() {
    return id;
  }
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

.user-options {
  position: absolute;
  bottom: 20px;
  left: 20px;
}

</style>
