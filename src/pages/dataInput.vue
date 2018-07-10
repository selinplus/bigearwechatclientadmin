<template>
  <q-page padding>
    <!-- content -->
    <div class="row gutter-sm">
      <div class="col-xs-12 col-sm-2">
        <q-select v-model="moduleInfo.type" :options="types" 
          float-label="模块选择" 
          class="no-margin"
          :before="[{icon: 'format_list_bulleted'}]"
          clearable >
        </q-select>
      </div>
      <div class="col-xs-12 col-sm-10">
        <q-input v-model="moduleInfo.title" float-label="标题" 
          :before="[{icon: 'format_list_bulleted'}]"
          class="no-margin">
        </q-input>
      </div>
      <div class="col-xs-12" v-if="moduleInfo.type != '行业资讯'" >
        <q-uploader class="q-mb-lg" multiple ref="carouselUploader"
          stack-label="轮播图上传" 
          :url="uploadUrl" auto-expand
          @uploaded="fileUploaded" 
        /> 
      </div>
      <div class="col-xs-12 col-sm-12 q-mt-md">
        <div class="q-mb-sm" style="color: rgb(153, 153, 153)">内容</div>
        <q-editor v-model="moduleInfo.content"
          min-height="360px"
          :toolbar="toolbarOptions"
          :fonts="fonts"
        >
        </q-editor>
      </div>
      <div class="col-12">
        <div class="row justify-center">
          <q-btn class="col-1" :loading="btnLoading" color="positive" no-wrap @click="save" label="录入" />
          <q-btn class="col-1 q-ml-md" color="warning" no-wrap @click="cancel" label="重置" />
        </div>
      </div>
      

    </div>
  </q-page>
</template>

<script>
import { getRandomArbitrary } from '../utils/common'
import { mapGetters, mapActions} from 'vuex'
export default {
  // name: 'PageName',
  data() {
    return {
      btnLoading: false,
      // type: '',
      types: [ 
        { label: "关于我们", value: "关于我们" },
        { label: "服务特色", value: "服务特色" }, 
        { label: "客户之声", value: "客户之声" },
        { label: "检车流程", value: "检车流程" },
        { label: "行业资讯", value: "行业资讯" }
      ],
      // title: '',
      // content: '',
      toolbarOptions: [
        ['bold', 'italic', 'strike', 'underline', 'subscript', 'superscript'],
        ['token', 'hr'],
        ['fullscreen'],
        [
          {
            label: this.$q.i18n.editor.formatting,
            icon: this.$q.icon.editor.formatting,
            list: 'no-icons',
            options: ['p', 'h1', 'h2', 'h3', 'h4', 'h5', 'h6', 'code']
          },
          {
            label: this.$q.i18n.editor.fontSize,
            icon: this.$q.icon.editor.fontSize,
            fixedLabel: true,
            fixedIcon: true,
            list: 'no-icons',
            options: ['size-1', 'size-2', 'size-3', 'size-4', 'size-5', 'size-6', 'size-7']
          },
          {
            label: this.$q.i18n.editor.defaultFont,
            icon: this.$q.icon.editor.font,
            fixedIcon: true,
            list: 'no-icons',
            options: ['default_font', 'arial', 'arial_black', 'comic_sans', 'courier_new', 'impact', 'lucida_grande', 'times_new_roman', 'verdana']
          },
          'removeFormat'
        ],
        ['quote', 'unordered', 'ordered', 'outdent', 'indent'],
        [
          {
            label: this.$q.i18n.editor.align,
            icon: this.$q.icon.editor.align,
            fixedLabel: true,
            list: 'only-icons',
            options: ['left', 'center', 'right', 'justify']
          },
          {
            label: this.$q.i18n.editor.align,
            icon: this.$q.icon.editor.align,
            fixedLabel: true,
            options: ['left', 'center', 'right', 'justify']
          }
        ],
        ['undo', 'redo']
      ],
      fonts: {
        arial: 'Arial',
        arial_black: 'Arial Black',
        comic_sans: 'Comic Sans MS',
        courier_new: 'Courier New',
        impact: 'Impact',
        lucida_grande: 'Lucida Grande',
        times_new_roman: 'Times New Roman',
        verdana: 'Verdana'
      },
      uploadUrl: process.env.API + '/upload',
      moduleInfo: {
        id: Date.now() + getRandomArbitrary(100000, 999999),
        type: '',
        title: '',
        content: ''
      },
      carousels: []
    }
    
  },
  computed: {
    ...mapGetters([
      'dataInput'
    ])
  },
  mounted() {
    console.log(this.dataInput);
    if (this.dataInput.moduleInfo) {
      // console.log('%%%%%%%%');
      this.moduleInfo = this.dataInput.moduleInfo;
    }
  },
  methods: {
    save() {
      console.log(this.moduleInfo);
      // console.log(Date.now());
      // console.log(getRandomArbitrary(100000, 999999));
      // console.log(Date.now() + getRandomArbitrary(100000, 999999));
      this.btnLoading = true;
      if (this.dataInput.moduleInfo) {
        this.update();
      } else {
        this.add();
      }
      
    },
    add() {
      this.$http.post(process.env.API + "/module/info/add",
        {
          moduleInfo: this.moduleInfo,
          carousels: this.carousels
        }
      ).then(res => {
        this.btnLoading = false;
        if (res.data.code == 200) {
          this.moduleInfo.id = Date.now() + getRandomArbitrary(100000, 999999);
          this.moduleInfo.type = "";
          this.moduleInfo.title = "";
          this.moduleInfo.content = "";
          if (this.$refs.carouselUploader) {
            this.$refs.carouselUploader.reset();
          }
          this.$q.notify({
            message :'录入成功！',
            color: 'positive',
            position: 'center',
            timeout: 1000
          });
        } else {
          this.btnLoading = false;
          this.$q.notify({
            message :'录入失败！',
            color: 'negative',
            position: 'center'
          });
        }
      })
      .catch(err => {
        console.log(err);
        this.btnLoading = false;
        this.$q.notify({
          message :'录入失败！',
          color: 'negative',
          position: 'center'
        });
      })
    },
    update() {
      console.log(this.moduleInfo.id);
      this.$http.post(process.env.API + "/module/info/update", this.moduleInfo
      ).then(res => {
        this.btnLoading = false;
        if (res.data.code == 200) {
          this.$store.commit('clear');
          this.moduleInfo.id = Date.now() + getRandomArbitrary(100000, 999999);
          this.moduleInfo.type = "";
          this.moduleInfo.title = "";
          this.moduleInfo.content = "";
          if (this.$refs.carouselUploader) {
            this.$refs.carouselUploader.reset();
          }
          this.$q.notify({
            message :'修改成功！',
            color: 'positive',
            position: 'center',
            timeout: 1000
          });
        } else {
          this.btnLoading = false;
          this.$q.notify({
            message :'修改失败！',
            color: 'negative',
            position: 'center'
          });
        }
      })
      .catch(err => {
        console.log(err);
        this.btnLoading = false;
        this.$q.notify({
          message :'修改失败！',
          color: 'negative',
          position: 'center'
        });
      })
    },
    cancel() {
      this.moduleInfo.title = '',
      this.moduleInfo.type = '',
      this.moduleInfo.content = ''
    },
    fileUploaded(file, xhr) {
      var carousel = {};
      carousel.moduleInfoId = this.moduleInfo.id;
      carousel.realname = JSON.parse(xhr.response).path;
      this.carousels.push(carousel);
    }
  }
}
</script>

<style>
</style>
