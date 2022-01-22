<template>
  <v-snackbar
      v-model="snackbar"
      :timeout="timeout"
      :color="color"
    >
      {{ text }}

      <template v-slot:action="{ attrs }">
        <v-btn
          text
          v-bind="attrs"
          @click="snackbar = false"
        >
          Close
        </v-btn>
      </template>
    </v-snackbar>
</template>
<script>
import { Vue, Prop } from 'nuxt-property-decorator'
import Component from 'nuxt-class-component'

@Component()
export default class NotificationSnackbar extends Vue {
  @Prop({ type: String, required: true }) text
  @Prop({ type: Boolean, required: true }) snackbar
  @Prop({ type: Number, required: true }) timeout
  @Prop({ type: String, required: false }) color
}
</script>
