<template>
  <div class="row">
    <span style="flex: 1">{{ propName }}</span>
    <el-input-number v-model="model[propKey]" :precision="2" size="small" controls-position="right" style="flex: 1"
      v-if="getPropType() == 'number'" />
    <el-input size="small" v-model="model[propKey]" style="flex: 1" v-else-if="getPropType() == 'string'" />
    <el-checkbox v-model="model[propKey]" size="small" style="margin-left: 10px"
      v-else-if="getPropType() == 'boolean'" />
    <el-color-picker v-model="CustomModel.color" size="small" style="flex: 1" color-format="hex" show-alpha
      v-else-if="getPropType() == 'cc.Color'" />
  </div>
</template>

<script setup lang="ts">
const props = defineProps<{
  model: any;
  propName: string;
  propKey: string;
  updateKey: number;
}>();

function getPropType() {
  const data = props.model[props.propKey];
  const dataType = typeof data;
  if (dataType === "object" && data.__classname__) {
    return data.__classname__;
  }
  return dataType;
}

class CustomModel {
  static get color() {
    const origin = props.model[props.propKey];
    const hexA = origin.a.toString(16);
    return `#${origin.toHEX()}${hexA.length === 1 ? "0" + hexA : hexA}`;
  }

  static set color(v: string) {
    // @ts-ignore
    props.model[props.propKey] = new cc.Color().fromHEX(v);
  }
}
</script>
