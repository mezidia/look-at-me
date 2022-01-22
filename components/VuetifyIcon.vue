<template>
  <div>
    <v-icon
      x-large
      class="icon"
    >
      {{ iconName }}
    </v-icon>
  </div>
</template>
<script>
import { Component, Vue, Prop } from 'nuxt-property-decorator'
@Component()
export default class IconButton extends Vue {
  @Prop({ type: String, required: true }) iconName
}
</script>

<style>
.icon:hover {
  cursor: pointer;
}
</style>
