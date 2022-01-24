<template>
  <v-card class="ma-3" max-width="344">
    <v-card-text>
      <div class="message-name">{{ name }}</div>
      <div class="text--primary">
        {{ msg }}
      </div>
    </v-card-text>
  </v-card>
</template>

<script>
import { Vue, Prop, Component } from 'nuxt-property-decorator';

@Component({})
export default class Message extends Vue {
  @Prop({ type: String, required: true}) name;
  @Prop({ type: String, required: true}) msg;
}
</script>

<style scoped>
.message-name {
  color: #b5a642;
}
</style>
