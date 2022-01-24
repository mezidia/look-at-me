<template>
  <v-card 
  style="{ position: relative }"
  elevation=2 
  class="user-block-holder ma-5"
  :height="height + 'px'"
  :img="image"
  :width="width + 'px'">
    <p :style="{'visibility': cameraOn || pageLoading ? 'hidden' : 'visible'}" class="name">{{ name }}</p>
    <video :style="{'visibility': !cameraOn ? 'hidden' : 'visible'}" autoplay :width="width + 'px'" :height="height + 'px'" :id="'video' + id" :muted="muted"></video>
    <v-row class="user-options">
      <OnOffIcon iconName="mdi-microphone" :pointer="false" :clicked="micClicked"/>
      <OnOffIcon v-show="admin" class="ml-3" iconName="mdi-exit-to-app" :onClick="removePersonFromRoom"/>
    </v-row>
    <div
      :id="'muted' + id"
      v-show="id !== '1'"
      class="mute-button"
      @click.stop="changeMutedStatus"
      v-bind:class="{'font-yellow': mutedStatus === 'Mute', 'font-green': mutedStatus === 'Unmute'}"
    >
        {{ mutedStatus }}
    </div>
  </v-card>
</template>

<script>
import { Prop, Vue, Watch } from 'nuxt-property-decorator'
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
  @Prop({type: String, required: false }) userMutedStatus;

  mutedStatus = 'Mute';

  @Watch('userMutedStatus')
  setMutedStatus() {
    this.mutedStatus = this.userMutedStatus;
    console.log('updated Uset Muted status', this.mutedStatus)
  }

  @Emit('removePersonFromRoom')
  removePersonFromRoom() {
    return this.id;
  }


  changeMutedStatus() {
    console.log('lol');
    console.log(this.mutedStatus)
    if (this.mutedStatus === 'Mute') {
      this.muteUser()
      return;
    }
    this.unmuteUser();
  }

  @Emit('userMuted')
  muteUser() {
    console.log('muteUser')
    this.mutedStatus = 'Unmute';
  }

  @Emit('userUnmuted')
  unmuteUser() {
    this.mutedStatus = 'Mute';
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

.font-green {
  color: #40826d;
}

.font-yellow {
  color: #b5a642;
}

.mute-button {
  width: 70px;
  text-align: center;
  background: #121212;
  border-radius: 5px;
  padding: 5px;
  position: absolute;
  right: 5px;
  bottom: 5px;
}

</style>
