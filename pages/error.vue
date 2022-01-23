<template>
  <div id="main-not-found-div" class="d-flex justify-center align-center">
    <v-col 
    align-self="center"
    justify="center"
    cols=2>
      <v-row justify="center">
        <h1>Room not found</h1>
      </v-row>
      <v-row justify="center">
        <RedirectButton to="/" text="Create Room" color="red"/>
      </v-row>
    </v-col>
  </div>
</template>

<script>
import { Component, Vue } from "nuxt-property-decorator";
import RedirectButton from '../components/RedirectButton.vue'

@Component({
  components: RedirectButton
})

export default class ErrorPage extends Vue {}

</script>

<style scoped>
div#main-not-found-div {
  width: 100%;
  height: 100%;
}
</style>

