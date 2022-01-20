<template>
  <div class="icon-holder">
    <v-icon 
    :x-large="big"
    @click="onClick"
    :disabled="!big"
    :class="{'ma-3': big}">{{ iconName }}</v-icon>
    <hr v-if="!clicked" :style="{'width': big ? '120%' : big ? '100%' :  '20%', 'left': big ? '-9%' : '-3%'}">
  </div>
</template>

<script>
import { Prop, Vue } from 'nuxt-property-decorator'
import Component from 'nuxt-class-component'

@Component({
  components: {}
})

export default class OnOffIcon extends Vue {
  @Prop({type: String, required: true}) iconName;
  @Prop({type: Function, required: false, default: () => {}}) onClick;
  @Prop({type: Boolean, required: true}) clicked;
  @Prop({type: Boolean, required: false, default: false}) big;
}
</script>

<style scoped>
hr {
  position: absolute;
  background-color: rgb(145, 143, 143);
  border: none;
  bottom: 47%;
  height: 3px;
  transform: rotate(45deg);
}

div.icon-holder {
  position: relative;
}

.v-icon.v-icon::after {
  height: 0%;
}
</style>

