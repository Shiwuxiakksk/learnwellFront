<template>
  <div>
    <el-input v-model="name" placeholder="输入标题"/>
    <el-tiptap
        v-model="content"
        :extensions="extensions"
        lang="zh"
    />
    <el-button type="primary" @click="submit">提交</el-button>
  </div>
</template>

<script>
import {
  ElementTiptap,
  // 需要的 extensions
  Doc,
  Text,
  Paragraph,
  Heading,
  Bold,
  Underline,
  Italic,
  Strike,
  ListItem,
  BulletList,
  OrderedList,
  Link,
  Image,
  CodeBlock,
  Blockquote,
  TodoItem,
  TodoList,
  TextAlign,
  FontSize,
  FontType,
  Fullscreen,
  TextHighlight,
  TextColor,
  FormatClear,
  Table,
  TableHeader,
  TableCell,
  TableRow,
  History,
  TrailingNode,
  HardBreak,
  HorizontalRule,
  LineHeight,
  Indent
} from 'element-tiptap';
import axios from "axios";

export default {
  name: 'RichTextComponent',
  data () {
    // 编辑器的 extensions
    // 它们将会按照你声明的顺序被添加到菜单栏和气泡菜单中
    return {
      extensions: [
        new Doc(), // 必须项
        new Text(), // 必须项
        new Paragraph(), // 必须项
        new Heading({ level: 6 }), // 标题
        new Bold({ bubble: true }), // 加粗 bubble: true 在气泡菜单中渲染菜单按钮
        new Underline({ bubble: true, menubar: false }), // 下划线 bubble: true, menubar: false 在气泡菜单而不在菜单栏中渲染菜单按钮
        new Italic({ bubble: true }), // 斜体
        new Strike({ bubble: true }), // 删除线
        new ListItem(), // 使用列表必须项
        new BulletList({ bubble: true }), // 无序列表
        new OrderedList({ bubble: true }), // 有序列表
        new Link(), // 链接
        new Image(), // 图片
        new CodeBlock({ bubble: true }), // 代码块
        new Blockquote(), // 引用
        new TodoItem(), // 任务列表必须项
        new TodoList(), // 任务列表
        new TextAlign({ bubble: true }), // 文本对齐方式
        new FontSize({ bubble: true }), // 字号
        new FontType({ bubble: true }), // 字体
        new Fullscreen(), // 全屏
        new TextHighlight({ bubble: true }), // 文本高亮
        new TextColor({ bubble: true }), // 文本颜色
        new FormatClear({ bubble: true }), // 清除格式
        new Table({ resizable: true }), // 表格
        new TableHeader(), // 表格必须项
        new TableCell(), // 表格必须项
        new TableRow(), // 表格必须项
        new History(), // 撤销
        new TrailingNode(), // 重做
        new HardBreak(), // 分割线
        new HorizontalRule(), // 行距
        new LineHeight(), // 增加缩进
        new Indent() // 减少缩进
      ],
      // 编辑器的内容
      content: '',
      name: '',
    };
  },
  methods: {
    submit(){
      let content = `<!DOCTYPE html>
            <html lang="">
            <head title="${this.name}"> <meta charset="UTF-8"> </head>
            <body>
                ${this.content}
            </body>
            </html>`
      const blob = new Blob([content], { type: 'text/html'});
      const file = new File([blob], 'richtext.html', { type: 'text/html' });
      let formData = new FormData();
      formData.append('file',file);
      formData.append('bucketName', 'resourcebucket');
      axios.post('/api/file/upload',formData)
          .then(resp=>{
            if(resp.data.code === 200){
              this.$message.success('操作成功！');
              this.$parent.setUrl(this.name, resp.data.data);
            } else {
              this.$message.error('发送了错误：'+resp.data.msg)
            }
          })
    }
  }
}
</script>
