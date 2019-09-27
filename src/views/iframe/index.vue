<template>
  <div class="login-container">
    <iframe class="iframe" ref="iframe" v-loading.fullscreen.lock="fullscreenLoading" :src="url" frameborder="no" border="0" marginWidth=0
			 marginHeight=0></iframe>
  </div>
</template>

<script>

export default {
  name: "myiframe",
  data() {
    return {
      url: 'http://youdao.com/',
      fullscreenLoading: false,
    };
  },
  created() {
    this.fullscreenLoading = true
  },
  mounted() {
    this.iframeInit()
    window.onresize = () => {
      this.iframeInit()
    }
  },
methods: {
    iframeInit() {
      const iframe = this.$refs.iframe
      const clientHeight = document.documentElement.clientHeight - 90
      iframe.style.height = `${clientHeight}px`
      if (iframe.attachEvent) {
        iframe.attachEvent('onload', () => {
          this.fullscreenLoading = false
        })
      } else {
        iframe.onload = () => {
          this.fullscreenLoading = false
        }
      }
    },
    getUrlPath: function() {
      let url = window.location.href
      url = url.replace('/iframe', '')
      return url
    }
  }
};
</script>

<style>
.iframe {
  width: 100%;
  height: 100%;
  border: 0;
  overflow: hidden;
  box-sizing: border-box;
}
</style>
