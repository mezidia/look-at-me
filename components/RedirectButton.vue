<template>
  <v-btn
  :loading="loading"
  class="mb-4"
  :color="color"
  :to="to">{{ text }}</v-btn>
</template>

<script>
import { Prop, Vue } from 'nuxt-property-decorator'
import Component from 'nuxt-class-component'

@Component({})
export default class RedirectButton extends Vue {
  @Prop({type: String, required: true}) text;
  @Prop({type: Boolean, default: false}) loading;
  @Prop({type: String, required: false}) color;
  @Prop({type: String, required: false}) to;
}
</script>
