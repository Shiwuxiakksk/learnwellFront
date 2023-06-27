<template>
    <div id="root" class="loginbox"> 
        <div class="c">
        <h5>欢迎登录明学在线学习平台</h5>
        <el-form method="post">
            uid:<input placeholder="请输入uid" type="text" class="input" required="true" v-model="data.uid" > <br>
            姓名：<input placeholder="请输入账号" type="text" class="input" required="true" v-model="data.name" > <br>
            密码：<input placeholder="请输入密码" type="password" class="input" required="true" v-model="data.password"> <br>
            <button type="reset">重置</button>
            <button type="submit" @click.prevent="register()" :disabled="!canSubmit">注册</button>
        </el-form>
    </div>
    </div>
</template>

<script>
import axios from "axios";
export default {
    name:'register',
    data(){
        return{
            data:{
                uid:'',
                name:'',
                password:'',
            }
            
        }
        rulers:{

        }
    },
    computed:{
        canSubmit(){//两者其中一个为空，登录按键不可使用
            const uid = this.data.uid
            const name = this.data.name
            const pass = this.data.password
            return Boolean(uid&&name&&pass)
        }
    },
    methods: {
        register(){
            console.log(this.uid)
            axios.post('/user/register',this.data).then(value =>{
                console.log(value)  
                    if(value.data.code == 200){
                        alert("注册成功，请完成信息完善");
                        console.log(value.data.data)
                        this.$router.push("/login");
                    }else{
                        alert(value.data.msg)
                    }
            })
        }
        
    },       
}
</script>

<style>
.loginbox {
    display: flex;
    position: absolute;
    width: 800px;
    height: 400px;
    top: 40%;
    left: 50%;
    transform: translate(-50%,-50%);
    box-shadow: 0 12px 16px 0 rgba(0, 0, 0, 0.24),0 17px 50px 0 #4E655D;
    background-image: url('../imgs/student.jpg');
}

.input {
 line-height: 28px;
 border: 2px solid transparent;
 border-bottom-color: #777;
 padding: .2rem 0;
 outline: none;
 background-color: transparent;
 color: #0d0c22;
 transition: .3s cubic-bezier(0.645, 0.045, 0.355, 1);
}

.input:focus, input:hover {
 outline: none;
 padding: .2rem 1rem;
 border-radius: 1rem;
 border-color: #7a9cc6;
}

.input::placeholder {
 color: #777;
}

.input:focus::placeholder {
 opacity: 0;
 transition: opacity .3s;
}

button {
 color: #090909;
 padding: 0.3em 1.7em;
 font-size: 12px;
 margin-top: 8px;
 margin-right: 15px;
 margin-left: 20px;
 border-radius: 0.5em;
 background: #e8e8e8;
 border: 1px solid #e8e8e8;
 transition: all .3s;
}
.c{
    margin: auto;
}
</style>