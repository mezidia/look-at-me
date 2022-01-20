<template>
  <v-container>
    <v-row justify="start" align="start">
      <v-container id="users-panel" class="fill-height">
      <UserBlock/>
      </v-container>
    </v-row>
  </v-container>
</template>

<script>
import { Vue } from 'nuxt-property-decorator'
import Component from 'nuxt-class-component'
import UserBlock from '../../components/UserBlock.vue'

@Component({
  components: {UserBlock}
})
export default class RoomPage extends Vue {}
</script>