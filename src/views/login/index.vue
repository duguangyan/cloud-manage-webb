<template>
  <div class="login-container">
    <el-form
      ref="loginForm"
      :model="loginForm"
      :rules="loginRules"
      class="login-form"
      label-position="left"
    >
      <div class="title-container">
        <h3 class="title">上上农夫后台管理系统</h3>
      </div>

      <el-form-item prop="username">
        <span class="svg-container">
          <svg-icon icon-class="user" />
        </span>
        <el-input
          ref="username"
          v-model="loginForm.username"
          placeholder="用户名"
          name="username"
          type="text"
          tabindex="1"
          @keyup.enter.native="handleLogin"
        />
      </el-form-item>

      <el-form-item prop="password">
        <span class="svg-container">
          <svg-icon icon-class="password" />
        </span>
        <el-input
          :key="passwordType"
          ref="password"
          v-model="loginForm.password"
          :type="passwordType"
          placeholder="密码"
          name="password"
          tabindex="2"
          @keyup.enter.native="handleLogin"
        />
        <span class="show-pwd" @click="showPwd">
          <svg-icon :icon-class="passwordType === 'password' ? 'eye' : 'eye-open'" />
        </span>
      </el-form-item>
      <el-form-item prop="authcode">
        <span class="svg-container">
          <svg-icon icon-class="form" />
        </span>
        <el-input
          ref="authcode"
          v-model="loginForm.authcode"
          placeholder="验证码"
          name="authcode"
          type="text"
          tabindex="3"
          maxlength="16"
          @keyup.enter.native="handleLogin"
        />
        <div class="authcode">
          <img :src="authImg" alt />
          <i title="刷新验证码" class="el-icon-refresh" @click="refreshAuthcode" />
        </div>
      </el-form-item>
      <el-button
        :loading="loading"
        type="primary"
        style="width:100%;margin-bottom:30px;"
        @click.native.prevent="handleLogin"
      >登录</el-button>
    </el-form>
  </div>
</template>

<script>
import { validUsername } from "@/utils/validate";
import { getUuid, setUuid } from "@/utils/auth";
import { getSystem } from "@/api/upms/systemList";
import { getAuthCode } from "@/api/oauth/auth";

export default {
  name: "Login",
  data() {
    const validateUsername = (rule, value, callback) => {
      if (!validUsername(value)) {
        callback(new Error("Please enter the correct user name"));
      } else {
        callback();
      }
    };
    // const validatePassword = (rule, value, callback) => {
    //     if (value.length < 6) {
    //         callback(new Error('The password can not be less than 6 digits'))
    //     } else {
    //         callback()
    //     }
    // }
    return {
      loginForm: {
        username: "",
        password: ""
      },
      loginRules: {
        username: [
          {
            required: true,
            trigger: "blur",
            message: "请输入用户名"
            // validator: validateUsername
          }
        ],
        password: [
          {
            required: true,
            trigger: "blur",
            message: "请输入密码"
            // validator: validatePassword
          }
        ],
        authcode: [
          {
            required: true,
            trigger: "blur",
            message: "请输入验证码"
            // validator: validatePassword
          }
        ]
      },
      loading: false,
      authImg: "",
      passwordType: "password",
      redirect: undefined
    };
  },
  watch: {
    $route: {
      handler: function(route) {
        this.redirect = route.query && route.query.redirect;
      },
      immediate: true
    }
  },
  mounted() {
    this.getAuthcode();
  },
  methods: {
    getAuthcode() {
      let uuid = getUuid();
      if (!uuid) {
        setUuid(this.getUUID(location.origin));
        uuid = getUuid();
      }
      getAuthCode({ deviceId: uuid, returnType: "json" }).then(res => {
        this.authImg = "data:image/png;base64," + res.data;
      });
    },
    refreshAuthcode() {
      this.getAuthcode();
    },
    getUUID(domain) {
      let canvas = document.createElement("canvas");
      let ctx = canvas.getContext("2d");
      let txt = domain;
      ctx.textBaseline = "top";
      ctx.font = "14px 'Arial'";
      ctx.textBaseline = "mrleecom";
      ctx.fillStyle = "#f60";
      ctx.fillRect(125, 1, 62, 20);
      ctx.fillStyle = "#069";
      ctx.fillText(txt, 2, 15);
      ctx.fillStyle = "rgba(102, 204, 0, 0.7)";
      ctx.fillText(txt, 4, 17);
      let b64 = canvas.toDataURL().replace("data:image/png;base64,", "");
      let bin = atob(b64);
      let crc = this.bin2hex(bin.slice(-16, -12));
      return crc;
    },
    bin2hex(s) {
      let i;
      let l;
      let o = "";
      let n;
      s += "";
      for (i = 0, l = s.length; i < l; i++) {
        n = s.charCodeAt(i).toString(16);
        o += n.length < 2 ? "0" + n : n;
      }
      return o;
    },
    showPwd() {
      if (this.passwordType === "password") {
        this.passwordType = "";
      } else {
        this.passwordType = "password";
      }
      this.$nextTick(() => {
        this.$refs.password.focus();
      });
    },
    handleLogin() {
      let self = this;
      // Cookies.set('vue_admin_template_token', 'admin-token')
      this.$refs.loginForm.validate(valid => {
        if (valid) {
          this.loading = true;
          this.$store
            .dispatch("user/login", this.loginForm)
            .then(() => {
              self.$router.push('/')

              this.loading = false;
            })
            .catch(() => {
              this.loading = false;
              this.getAuthcode();
            });
        } else {
          console.log("error submit!!");
          return false;
        }
      });
    }
  }
};
</script>

<style lang="scss">
/* 修复input 背景不协调 和光标变色 */
/* Detail see https://github.com/PanJiaChen/vue-element-admin/pull/927 */

$bg: #283443;
$light_gray: #fff;
$cursor: #fff;
@supports (-webkit-mask: none) and (not (cater-color: $cursor)) {
  .login-container .el-input input {
    color: $cursor;
  }
}
/* reset element-ui css */
.login-container {
  .el-input {
    display: inline-block;
    height: 47px;
    width: 85%;
    input {
      background: transparent;
      border: 0px;
      -webkit-appearance: none;
      border-radius: 0px;
      padding: 12px 5px 12px 15px;
      color: $light_gray;
      height: 47px;
      caret-color: $cursor;
      &:-webkit-autofill {
        box-shadow: 0 0 0px 1000px $bg inset !important;
        -webkit-text-fill-color: $cursor !important;
      }
    }
  }
  .el-form-item {
    border: 1px solid rgba(255, 255, 255, 0.1);
    background: rgba(0, 0, 0, 0.1);
    border-radius: 5px;
    color: #454545;
  }
}
</style>

<style lang="scss" scoped>
$bg: #2d3a4b;
$dark_gray: #889aa4;
$light_gray: #eee;
.login-container {
  min-height: 100%;
  width: 100%;
  background-color: $bg;
  overflow: hidden;
  .login-form {
    position: relative;
    width: 520px;
    max-width: 100%;
    padding: 160px 35px 0;
    margin: 0 auto;
    overflow: hidden;
  }
  .tips {
    font-size: 14px;
    color: #fff;
    margin-bottom: 10px;
    span {
      &:first-of-type {
        margin-right: 16px;
      }
    }
  }
  .svg-container {
    padding: 6px 5px 6px 15px;
    color: $dark_gray;
    vertical-align: middle;
    width: 30px;
    display: inline-block;
  }
  .title-container {
    position: relative;
    .title {
      font-size: 26px;
      color: $light_gray;
      margin: 0px auto 40px auto;
      text-align: center;
      font-weight: bold;
    }
  }
  .show-pwd {
    position: absolute;
    right: 10px;
    top: 7px;
    font-size: 16px;
    color: $dark_gray;
    cursor: pointer;
    user-select: none;
  }
  .authcode {
    position: absolute;
    right: 10px;
    top: 11px;
    height: 30px;

    img {
      width: auto;
      height: 30px;
      border-radius: 5px;
      vertical-align: top;
    }
    i {
      display: inline-block;
      color: #fff;
      font-size: 20px;
      cursor: pointer;
    }
  }
}
</style>
