<template>
  <div class="dashboard-container">
    <component :is="currentRole" />
  </div>
</template>

<script>
import { mapGetters } from "vuex";
import adminDashboard from "./admin";
import editorDashboard from "./editor";
import { token } from "@/store/getters";
import { getStore } from "@/store/store";

export default {
  name: "Dashboard",
  components: { adminDashboard, editorDashboard },
  data() {
    return {
      currentRole: "adminDashboard",
      //刷新token锁
      refreshLock: false,
      //刷新token的时间
      refreshTime: "",
      expires_in: getStore({ name: "expires_in" })
    };
  },
  computed: {
    ...mapGetters(["roles"])
  },
  created() {
    this.refreshToken();
    // if (!this.roles.includes('admin')) {
    //   this.currentRole = 'editorDashboard'
    // }
  },
  methods: {
    // 实时检测刷新token

    refreshToken() {
      let self = this;
      self.refreshTime = setInterval(() => {
        const token = token;

        if (self.expires_in <= 10 && !self.refreshLock) {
          self.refreshLock = true;
          self.$store.dispatch("user/RefreshToken").catch(() => {
            clearInterval(self.refreshTime);
          });
          self.refreshLock = false;
        }

        self.$store.commit("user/SET_EXPIRES_IN", --self.expires_in);
      }, 10000);
    }
  }
};
</script>
