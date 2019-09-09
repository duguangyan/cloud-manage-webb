<template>
  <div id="app">
    <router-view />
  </div>
</template>

<script>
import { token } from "@/store/getters";
import { getStore } from "@/store/store";
export default {
  name: "App",
  data() {
    return {
      //刷新token锁
      refreshLock: false,
      //刷新token的时间
      refreshTime: "",
      "expires_in": getStore({ name: "expires_in" })
    };
  },
  mounted() {
    this.refreshToken();
  },
  methods: {
    // 实时检测刷新token
    refreshToken() {
      let self = this;
      self.refreshTime = setInterval(() => {
        const token = token;

        if (self.expires_in <= 10 && !self.refreshLock) {
          self.refreshLock = true;
          self.$store.dispatch("RefreshToken").catch(() => {
            clearInterval(self.refreshTime);
          });
          self.refreshLock = false;
        }
        debugger
        self.$store.commit("SET_EXPIRES_IN", self.expires_in - 10);
      }, 10000);
    }
  }
};
</script>
