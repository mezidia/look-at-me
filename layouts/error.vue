<template>
  <v-app dark>
    <v-row justify="center">
      <v-col 
      align-self="center"
      justify="center"
      cols=2>
        <v-row justify="center">
          <h1>404 Not Found</h1>
        </v-row>
        <v-row justify="center">
          <RedirectButton to="/" text="Create Room" color="red"/>
        </v-row>
      </v-col>
    </v-row>
  </v-app>
</template>

<script>
import { Component, Vue } from "nuxt-property-decorator";
import RedirectButton from '../components/RedirectButton.vue'

@Component({
  components: { RedirectButton }
})
export default class EmptyLayout extends Vue {}

</script>

<style scoped>
</style>
