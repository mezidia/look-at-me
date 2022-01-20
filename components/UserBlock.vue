<template>
  <v-card 
  elevation=2 
  class="user-block-holder"
  height=150px
  color="red"
  width=200px>
    <video width="200px" height="150px" id="video"></video>
  </v-card>
</template>

<script>
import { Vue } from 'nuxt-property-decorator'
import Component from 'nuxt-class-component'

@Component({
  components: {}
})

export default class UserBlock extends Vue {}
</script>

<style>
.play-icon-row {
  position: absolute;
  bottom: 20px;
  left: 20px;
  background-color: rgba(0, 0, 0, 0.3);
}

.user-block-holder {
  position: relative;
}
</style>
