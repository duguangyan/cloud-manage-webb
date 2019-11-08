<template>
  <div :class="{fullscreen:fullscreen}" class="tinymce-container" :style="{width:containerWidth}">
    <textarea :id="tinymceId" class="tinymce-textarea" />
  </div>
</template>

<script>
import plugins from './plugins'
import toolbar from './toolbar'
import load from './dynamicLoadScript'
import { fileUpload } from '@/api/goods/upload'

const tinymceCDN = 'https://cdn.jsdelivr.net/npm/tinymce-all-in-one@4.9.3/tinymce.min.js'
// import Editor from '@tinymce/tinymce-vue';
//import TN from '@/assets/js/tinymce.min.js'

export default {
  name: 'Tinymce',
  props: {
    id: {
      type: String,
      default: function() {
        return 'vue-tinymce-' + +new Date() + ((Math.random() * 1000).toFixed(0) + '')
      }
    },
    value: {
      type: String,
      default: ''
    },
    toolbar: {
      type: Array,
      required: false,
      default() {
        return []
      }
    },
    menubar: {
      type: String,
      default: 'edit insert view format table'
    },
    height: {
      type: [Number, String],
      required: false,
      default: 360
    },
    width: {
      type: [Number, String],
      required: false,
      default: 'auto'
    }
  },
  data() {
    return {
      hasChange: false,
      hasInit: false,
      tinymceId: this.id,
      fullscreen: false,
      languageTypeList: {
        'en': 'en',
        'zh': 'zh_CN',
        'es': 'es_MX',
        'ja': 'ja'
      }
    }
  },
  computed: {
    containerWidth() {
      const width = this.width
      if (/^[\d]+(\.[\d]+)?$/.test(width)) { // matches `100`, `'100'`
        return `${width}px`
      }
      return width
    }
  },
  watch: {
    value(val) {
      if (!this.hasChange && this.hasInit) {
        this.$nextTick(() =>
          window.tinymce.get(this.tinymceId).setContent(val || ''))
      }
    }
  },
  mounted() {
    this.init()
  },
  activated() {
    if (window.tinymce) {
      this.initTinymce()
    }
  },
  deactivated() {
    this.destroyTinymce()
  },
  destroyed() {
    this.destroyTinymce()
  },
  methods: {
    init() {
      load(tinymceCDN, (err) => {
        if (err) {
          this.$message.error(err.message)
          return
        }
        this.initTinymce()
      })
    },
    initTinymce() {
      const _this = this
      console.log(window.tinymce)
      window.tinymce.init({
        selector: `#${this.tinymceId}`,
        language: this.languageTypeList['zh'],
        height: this.height,
        body_class: 'panel-body ',
        object_resizing: false,
        toolbar: this.toolbar.length > 0 ? this.toolbar : toolbar,
        menubar: this.menubar,
        plugins: plugins,
        end_container_on_empty_block: true,
        powerpaste_word_import: 'clean',
        code_dialog_height: 450,
        code_dialog_width: 1000,
        file_picker_types: 'media',
        advlist_bullet_styles: 'square',
        advlist_number_styles: 'default',
        default_link_target: '_blank',
        link_title: false,
        nonbreaking_force_tab: true, // inserting nonbreaking space &nbsp; need Nonbreaking Space Plugin
        init_instance_callback: editor => {
          if (_this.value) {
            editor.setContent(_this.value)
          }
          _this.hasInit = true
          editor.on('NodeChange Change KeyUp SetContent', () => {
            this.hasChange = true
            this.$emit('input', editor.getContent())
          })
        },
        setup(editor) {
          editor.on('FullscreenStateChanged', (e) => {
            _this.fullscreen = e.state
          })
        },
        images_upload_handler(blobInfo, success, failure, progress) {
          // 图片上传事件
          let file = blobInfo.blob()
          if(file.type !== 'image/jpeg' && file.type !== 'image/jpg' && file.type !== 'image/png' && file.type !== 'image/gif') {
            failure('上传图片只能是jpg、jpeg、gif、png格式!')
          }
          if(file.size / 1024 / 1024 > 3) {
            failure('上传图片大小不能超过 3MB!')
          }
          const formData = new FormData()
          formData.append('file', file)
          progress(0)
          fileUpload(formData).then(response => {
            success(response.data.url)
            progress(100)
          }).catch(err => {
            failure('图片上传失败！')
            console.log(err);
          });
        },
        file_picker_callback(cb, value, meta) {
          //当点击meidia图标上传时,判断meta.filetype == 'media'有必要，因为file_picker_callback是media(媒体)、image(图片)、file(文件)的共同入口
          if (meta.filetype == 'media') {
            let input = document.createElement('input')
            input.setAttribute('type', 'file')
            input.onchange = function(){
              let file = this.files[0];//只选取第一个文件。如果要选取全部，后面注意做修改
              if(file.type !== 'video/mp4') {
                tinymce.activeEditor.windowManager.open({
                  title: '上传视频只能是MP4格式!',
                  buttons: [],
                })
                return false
              }
              if(file.size / 1024 / 1024 > 10) {
                tinymce.activeEditor.windowManager.open({
                  title: '上传视频大小不能超过 10MB!',
                  buttons: [],
                })
                return false
              } 
              let formData = new FormData()
              formData.append('file', file)
              tinymce.activeEditor.setProgressState(true)
              fileUpload(formData).then(response => {
                tinymce.activeEditor.setProgressState(false)
                let mediaLocation=response.data.url
                //cb()回调函数，将mediaLocation显示在弹框输入框中
                cb(mediaLocation, { title: file.name });
              }).catch(err => {
                tinymce.activeEditor.setProgressState(false)
                _this.$message.error('视频上传失败！')
                console.log(err)
              })
            }
            input.click()
          }
        }
      })
    },
    destroyTinymce() {
      const tinymce = window.tinymce.get(this.tinymceId)
      if (this.fullscreen) {
        tinymce.execCommand('mceFullScreen')
      }

      if (tinymce) {
        tinymce.destroy()
      }
    },
    setContent(value) {
      window.tinymce.get(this.tinymceId).setContent(value)
    },
    getContent() {
      window.tinymce.get(this.tinymceId).getContent()
    },
    imageSuccessCBK(arr) {
      const _this = this
      arr.forEach(v => {
        window.tinymce.get(_this.tinymceId).insertContent(`<img class="wscnph" src="${v.url}" >`)
      })
    }
  }
}
</script>

<style scoped>
.tinymce-container {
  position: relative;
  line-height: normal;
}
.tinymce-container>>>.mce-fullscreen {
  z-index: 10000;
}
.tinymce-textarea {
  visibility: hidden;
  z-index: -1;
}
.editor-custom-btn-container {
  position: absolute;
  right: 4px;
  top: 4px;
  /*z-index: 2005;*/
}
.fullscreen .editor-custom-btn-container {
  z-index: 10000;
  position: fixed;
}
.editor-upload-btn {
  display: inline-block;
}
</style>
