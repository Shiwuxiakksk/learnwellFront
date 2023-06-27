<template>
  <RichTextComponent>
  </RichTextComponent>
</template>
<script>
import RichTextComponent from "@/views/teacher/RichTextComponent";
export default {
  name: 'TestView',
  components: {RichTextComponent},
  data(){
    return{
      place: null,
    }
  },
  methods:{
    setUrl(str){
      this.place = str;
      console.log(this.place)
    }
  }
}
</script>
<style scoped>

</style>
