<template>
  <div>
    <AuditView :description="description" :chart-type="chartType" ></AuditView>
  </div>
</template>

<script>

import AuditView from "@/views/teacher/AuditView";
import axios from "axios";
export default {
  components: {AuditView},
  data() {
    return {
      chartType: false,
      description: {
        maximum: 0,
        minimum: 0,
        average: 0,
        median: 0,
        graph: {
          chart: {
            columns: ['日期', '访问用户', '下单用户'],
            rows: [
              { '日期': '2018-05-22', '访问用户': 32371, '下单用户': 19810 },
              { '日期': '2018-05-23', '访问用户': 12328, '下单用户': 4398 },
              { '日期': '2018-05-24', '访问用户': 92381, '下单用户': 52910 }
            ]
          },
          data: null
        }
      }
    }
  },

  methods: {

  },
  mounted() {
    axios.get("/api/audit//student/description?courseId=200000&studentId=100000")
    .then(resp=>{
      if(resp.data.code === 200){
        alert(resp.data.data)
        console.log(resp.data.data)
        this.description = resp.data.data
      } else {
        alert("err");
      }
    })
  }
};
</script>

<style>

</style>
