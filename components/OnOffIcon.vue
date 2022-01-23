<template>
  <div class="icon-holder" @click="onClick" :style="{'cursor': pointer ? 'pointer' : 'auto', 'width': big ? '40px' : '24px'}">
    <v-icon 
    :x-large="big"
    :disabled="!pointer"
    :class="{'ma-3': big}">{{ iconName }}</v-icon>
    <hr v-show="!clicked" :style="{ 'left': big ? '15%' : '-3%', 'opacity': big ? '1' : '0.5'}">
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
  @Prop({type: Boolean, required: false, default: true}) clicked;
  @Prop({type: Boolean, required: false, default: false}) big;
  @Prop({type: Boolean, required: false, default: true}) pointer;
}
</script>

<style scoped>
hr {
  position: absolute;
  border: none;
  bottom: 47%;
  height: 3px;
  background-color: white;
  width: 120%;
  transform: rotate(45deg);
}

div.icon-holder {
  position: relative;
}
</style>

