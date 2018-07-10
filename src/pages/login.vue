<template>
  <q-layout>
    <q-page-container>
      <q-page class="row justify-center content-center my-login">
        <div class="col-xs-10 text-center q-mb-lg" style="color: white; font-size: 3em; margin-top: -150px;">Admin</div>
        <div class="col-xs-10 col-md-4">
          <q-input color="loginInput" inverted v-model="username" placeholder="用户名" :before="[{icon: 'person'}]" />
          <q-input class="q-mb-lg" color="loginInput" inverted v-model="password" placeholder="密码" type="password" :before="[{icon: 'vpn_key'}]" />
          <q-btn :loading="btnLoading" color="positive" class="full-width self-stretch" size="14px" @click="login" label="登录" />
        </div>
      </q-page>
    </q-page-container>
  </q-layout>
</template>

<script>
import { required } from 'vuelidate/lib/validators'
export default {
  // name: 'PageName',
  data: () => ({
    username: '',
    password: '',
    btnLoading: false
  }),
  methods: {
    login() {
      if (!this.$v.username.required) {
        this.$q.notify('用户名不能为空！');
      } else if (!this.$v.password.required) {
        this.$q.notify('密码不能为空！');
      } else {
        this.btnLoading = true;
        this.$http.post(process.env.API + '/admin/user/login', { username: this.username, password: this.password })
        .then(res => {
          this.btnLoading = false;
          if (res.data.code == "200") {
            this.$router.push('/main/dataInput');
          } else {
            this.$q.notify(res.data.message);
          }
          
        })
        .catch(err => {
          // this.btnLoading = false;
        })
      }
    }
  },
  validations: {
    username: { required },
    password: { required }
  }
}
</script>

<style>
  .text-loginInput {
    color: #fff;
  }
  .bg-loginInput {
    background: rgb(112, 105, 113, 0.4)
  }
  .my-login {
    background: url(~assets/bg.jpg) no-repeat;
    background-size:100% 100%;  
  }
</style>
