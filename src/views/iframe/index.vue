<template>
  <div v-loading="fullscreenLoading" class="login-container">
    <iframe class="iframe" ref="iframe" :src="url" frameborder="no" border="0" marginWidth=0
			 marginHeight=0></iframe>
  </div>
</template>

<script>

export default {
  name: "myiframe",
  data() {
    return {
      url: '',
      fullscreenLoading: false,
    };
  },
  created() {
    // console.log('create')
    // this.url = this.$route.meta.url
    // console.log(this.url)
  },
  
  mounted() {
     console.log('mounted')
    this.url = this.$route.meta.url
    console.log(this.url)
    this.fullscreenLoading = true
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
