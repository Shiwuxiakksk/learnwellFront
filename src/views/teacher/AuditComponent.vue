<template>
  <div class="container">
    <el-card class="card">
      <div slot="header" class="title">统计数据</div>
      <div class="data">
        <div class="item">
          <div class="label">平均分：</div>
          <div class="value">{{ description.average }}</div>
        </div>
        <div class="item">
          <div class="label">中位数：</div>
          <div class="value">{{ description.median }}</div>
        </div>
        <div class="item">
          <div class="label">最高分：</div>
          <div class="value">{{ description.maximum }}</div>
        </div>
        <div class="item">
          <div class="label">最低分：</div>
          <div class="value">{{ description.minimum }}</div>
        </div>
      </div>
      <el-switch style="float: right;z-index: 1"
          v-model="type"
          active-text="折线图"
          inactive-text="柱状图">
      </el-switch>
      <ve-line v-if="type" :data="description.graph.chart" style="width: 520px"></ve-line>
      <ve-histogram v-else :data="description.graph.chart" style="width: 520px"></ve-histogram>
    </el-card>

  </div>
</template>
<script>

export default {
  name: "AuditComponent",
  props: {
    description: {
      type: Object,
      required: true
    },
  },
  data(){
    return {
      type: true
    }
  }
}
</script>
<style scoped>
.container {
  flex-direction: column;
  align-items: center;
}
.card {
  margin-bottom: 20px;
  width: 600px;
}
.title {
  font-size: 18px;
}
.data {
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  padding: 20px;
}
.item {
  display: flex;
  flex-direction: column;
  align-items: center;
}
.label {
  font-size: 16px;
  color: #999;
}
.value {
  font-size: 20px;
  font-weight: bold;
}

</style>
