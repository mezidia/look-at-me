<template>
  <v-row justify="center">
    <v-col 
    align-self="center"
    justify="center"
    cols=2>
      <v-row justify="center">
        <BasicButton
        text="Create Room"
        :onClick="onCreateRoomClick"/> 
      </v-row>
      <v-row justify="center">
        <BasicButton 
        text="Find Room"
        :onClick="onFindRoomClick"/>
      </v-row>
      
    </v-col>
    
  </v-row>
  
</template>

<script>
import { Vue } from 'nuxt-property-decorator'
import Component from 'nuxt-class-component'
import BasicButton from '../components/BasicButton.vue'

@Component({
  components: {BasicButton}
})
export default class IndexPage extends Vue {
  onCreateRoomClick() {
    console.log('createRoom');
  }

  onFindRoomClick() {
    console.log('findRoom');
  }
}
</script>

<style scoped>
</style>
