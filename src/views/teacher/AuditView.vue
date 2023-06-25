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
      <ve-histogram :data="description.graph.chart" style="width: 520px"></ve-histogram>
    </el-card>

  </div>
</template>
<script>

export default {

  props: {
    description: {
      type: Object,
      required: true
    },
    chartType: {
      type: Boolean,
      required: true
    }
  },
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
