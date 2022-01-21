<template>
  <v-app dark>
    <v-main>
      <Nuxt />
    </v-main>
  </v-app>
</template>

<script>
import { Vue } from 'nuxt-property-decorator'
import Component from 'nuxt-class-component'

Component({
  name: 'default'
})

export default class DefaultPage extends Vue {
  
}
</script>
