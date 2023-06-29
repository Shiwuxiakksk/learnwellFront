<template>
    <div id="root" class="loginbox">
        <div class="c">
        <h5>欢迎登录明学在线学习平台</h5>
        <form method="post">
            uid：<input placeholder="请输入uid" type="text" class="input" required="true" v-model="uid" > <br>
            密码：<input placeholder="请输入密码" type="password" class="input" required="true" v-model="password"> <br>
            <button type="submit" @click.prevent="login()" :disabled="!canSubmit">登录</button>
            <button  @click.prevent="register()">注册</button>

        </form></div>
    </div>
</template>

<script>
import axios from "axios";
export default {
    name:'login',
    data(){
        return{
            password:"",
            uid:"",
            }
    },
    computed:{
        canSubmit(){//两者其中一个为空，登录按键不可使用
            const uidd = this.uid
            const pass = this.password
            return Boolean(uidd&&pass)
        }
    },
    methods: {
        login(){
            console.log(this.password)
            let mydate = new Date()
            console.log(mydate.getDate())
            console.log(mydate.getHours())
            localStorage.setItem("date",mydate.getDate()*24+mydate.getHours());
            axios({
                method: "POST",
                url: `/user/login`,
                data:{
                    uid:this.uid,
                    password:this.password,
                },
            }).then(response=> {
                console.log(response.data);
                if(response.data.code >= 200 && response.data.code < 300){
                    if(response.data.code == 200){
                        alert("登录成功");
                        console.log(response.data.data);
                        localStorage.setItem("token",response.data.data.token);
                        localStorage.setItem("id",response.data.data.id);
                        if(response.data.data.type == "0"){
                            localStorage.setItem("Id",response.data.data.id);
                        }else if(response.data.data.type == "2"){
                            localStorage.setItem("teacherId",response.data.data.id);
                        }
                        else{
                            localStorage.setItem("studentId",response.data.data.id);
                        }

                        localStorage.setItem("type",response.data.data.type);
                        console.log()
                        if(response.data.data.type ==0)this.$router.push("/admin");
                        else this.$router.push("/");
                    }
                    else{alert(response.data.msg)}
                }
                else{alert("登录失败")}
            })
        },
        register(){
            this.$router.push('/register')
        }
    }
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
