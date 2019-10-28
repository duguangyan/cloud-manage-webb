<template>
  <div class="navbar">
    <hamburger :is-active="sidebar.opened" class="hamburger-container" @toggleClick="toggleSideBar" />

    <breadcrumb class="breadcrumb-container" />

    <div class="right-menu">
      <el-dropdown class="avatar-container" trigger="click">
        <div class="avatar-wrapper">
          <img v-if="user.avatar" :src= "user.avatar" size="50" class="user-avatar">
          <img v-else src= "@/assets/img/circle_avatar.png" size="50" class="user-avatar">
          <i class="el-icon-caret-bottom" />
        </div>
        <el-dropdown-menu slot="dropdown" class="user-dropdown">
          <router-link to="/">
            <el-dropdown-item>
              主页
            </el-dropdown-item>
          </router-link>
          <!-- <a target="_blank" href="https://github.com/PanJiaChen/vue-admin-template/">
            <el-dropdown-item>Github</el-dropdown-item>
          </a>
          <a target="_blank" href="https://panjiachen.github.io/vue-element-admin-site/#/">
            <el-dropdown-item>Docs</el-dropdown-item>
          </a> -->
          <el-dropdown-item divided>
            <span style="display:block;" @click="updatePass">修改密码</span>
          </el-dropdown-item>
          <el-dropdown-item divided>
            <span style="display:block;" @click="logout">退出登录</span>
          </el-dropdown-item>
        </el-dropdown-menu>
      </el-dropdown>
    </div>

    <el-dialog :visible.sync="dialogVisible" :closeOnClickModal="false" title="修改密码">
      <el-form ref="userForm" v-loading="diaLoading" :model="user" label-width="120px" label-position="left" :rules="rules">
        <el-form-item prop="name" label="账号">
          {{user.name}}
        </el-form-item>
        <el-form-item prop="phone" label="手机号码">
          {{user.phone}}
        </el-form-item>
        <el-form-item prop="oldPass" label="原密码">
          <el-input
            :key="oldType"
            ref="oldPass"
            v-model.trim="user.oldPass"
            :type="oldType"
            placeholder="请输入原密码"
            name="oldPass"
            tabindex="2"
          />
          <span class="show-pwd" @click="showPwd(1)">
            <svg-icon :icon-class="oldType === 'password' ? 'eye' : 'eye-open'" />
          </span>
        </el-form-item>
         <el-form-item prop="firstPass" label="新密码">
          <el-input
            :key="newType"
            ref="newPass"
            v-model.trim="user.firstPass"
            :type="newType"
            placeholder="请输入新密码"
            name="password"
            tabindex="2"
          />
          <span class="show-pwd" @click="showPwd(2)">
            <svg-icon :icon-class="newType === 'password' ? 'eye' : 'eye-open'" />
          </span>
        </el-form-item>
         <el-form-item prop="secondPass" label="再次输入新密码">
          <el-input
            ref="newPass2"
            @blur="inputBlur"
            v-model.trim="user.secondPass"
            :type="newType"
            placeholder="请再次输入新密码"
            name="password"
            tabindex="2"
          />
          <div v-if="noSame" class="el-form-item__error">
            输入的新密码不一致
          </div>
        </el-form-item>
      </el-form>
      <div style="text-align:right;">
        <el-button type="danger" @click="dialogVisible=false">取消</el-button>
        <el-button type="primary" :disabled="diaDisable" @click="regFun">确定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import Breadcrumb from '@/components/Breadcrumb'
import Hamburger from '@/components/Hamburger'
import { updatePassword } from '@/api/upms/user'

export default {
  data() {
    const validateLen = (rule, value, callback) => {
      if (!value) {
        callback(new Error(rule.des))
      } else if (value.length < 5 || value.length > 64) {
        callback(new Error(rule.lenDes))
      } else if (!/^[a-zA-Z0-9]*$/.test(value)) {
        callback('密码只能由字母、数字数字组成')
      } else {
          callback()
      }
    }
    return {
      dialogVisible: false,
      diaLoading: false,
      noSame: false,
      user: {
        id: '',
        name: '',
        phone: '',
        avatar: '',
        oldPass: '',
        firstPass: '',
        secondPass: ''
      },
      oldType: "password",
      newType: "password",
      rules: {
        oldPass: [{
            required: true,
            trigger: 'blur',
            message: '请填写原密码'
        }],
        firstPass: [{
            required: true,
            trigger: 'blur',
            validator: validateLen,
            lenDes: '密码下限为5，上限为64',
            des: '请填写新密码'
        }],
        secondPass: [{
            required: true,
            trigger: 'blur',
            validator: validateLen,
            lenDes: '密码长度下限为5，上限为64',
            des: '请再次填写新密码'
        }]
      },
      diaDisable: false,
    }
  },
  components: {
    Breadcrumb,
    Hamburger
  },
  created() {
    this.user.id = this.$store.getters.userId
    this.user.name = this.$store.getters.name
    this.user.phone = this.$store.getters.phone
    this.user.avatar = this.$store.getters.avatar
  },
  computed: {
    ...mapGetters([
      'sidebar',
      'avatar'
    ])
  },
  methods: {
    toggleSideBar() {
      this.$store.dispatch('app/toggleSideBar')
    },
    async logout() {
      await this.$store.dispatch('user/logout')
      this.$router.push(`/login?redirect=${this.$route.fullPath}`)
    },
    inputBlur() {
      this.noSame = false
    },
    regFun() {
      this.$refs.userForm.validate(valid => {
        if(valid) {
          if(this.user.firstPass === this.user.secondPass) {
            this.noSame = false
            this.confirm()
          } else {
            this.noSame = true
          }
        }
      })
    },
    showPwd(type) {
      if(type === 1) {
        if (this.oldType === "password") {
          this.oldType = ""
        } else {
          this.oldType = "password"
        }
        this.$nextTick(() => {
          this.$refs.oldPass.focus()
        })
      } else {
        if (this.newType === "password") {
          this.newType = ""
        } else {
          this.newType = "password"
        }
      }
    },
    updatePass() {
      this.noSame = false
      this.dialogVisible = true
      this.$nextTick(() => {
        this.$refs.userForm.clearValidate()
      })
    },
    confirm() {
      this.diaLoading = true
      this.diaDisable = true
      updatePassword({
        id: this.user.id,
        oldPassword: this.user.oldPass,
        password: this.user.secondPass
      }).then(res => {
        this.diaLoading = false
        this.diaDisable = false
        this.dialogVisible = false
        this.$notify({
          title: '密码修改成功',
          type: 'success'
        })
      }).catch(err => {
        this.diaLoading = false
        this.diaDisable = false
      })
    }
  }
}
</script>

<style lang="scss" scoped>
$dark_gray: #889aa4;

.show-pwd {
  position: absolute;
  right: 10px;
  top: 0;
  font-size: 16px;
  color: $dark_gray;
  cursor: pointer;
  user-select: none;
}

.navbar {
  height: 50px;
  overflow: hidden;
  position: relative;
  background: #fff;
  box-shadow: 0 1px 4px rgba(0,21,41,.08);

  .hamburger-container {
    line-height: 46px;
    height: 100%;
    float: left;
    cursor: pointer;
    transition: background .3s;
    -webkit-tap-highlight-color:transparent;

    &:hover {
      background: rgba(0, 0, 0, .025)
    }
  }

  .breadcrumb-container {
    float: left;
  }

  .right-menu {
    float: right;
    height: 100%;
    line-height: 50px;

    &:focus {
      outline: none;
    }

    .right-menu-item {
      display: inline-block;
      padding: 0 8px;
      height: 100%;
      font-size: 18px;
      color: #5a5e66;
      vertical-align: text-bottom;

      &.hover-effect {
        cursor: pointer;
        transition: background .3s;

        &:hover {
          background: rgba(0, 0, 0, .025)
        }
      }
    }

    .avatar-container {
      margin-right: 30px;

      .avatar-wrapper {
        margin-top: 5px;
        position: relative;

        .user-avatar {
          cursor: pointer;
          width: 40px;
          height: 40px;
          border-radius: 10px;
        }

        .el-icon-caret-bottom {
          cursor: pointer;
          position: absolute;
          right: -20px;
          top: 25px;
          font-size: 12px;
        }
      }
    }
  }
}
</style>
