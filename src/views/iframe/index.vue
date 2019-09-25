<template>
  <div class="login-container">
    <iframe :src="url" style="height: 100%;width:7.5rem; frameborder=no" frameborder="no" border="0" marginWidth=0
			 marginHeight=0></iframe>
  </div>
</template>

<script>

export default {
  name: "iframe",
  data() {
    return {
      url: 'www.baidu.com'
    };
  },
  mounted() {
  },
  methods: {
  }
};
</script>

<style lang="scss">

</style>
