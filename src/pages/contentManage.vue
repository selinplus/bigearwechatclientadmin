<template>
  <q-page>
    <q-table
      :data="tableData"
      :columns="columns"
      :filter="filter"
      :separator="separator"
      :visible-columns="visibleColumns"
      selection="multiple"
      :selected.sync="selectedSecond"
      row-key="id"
      color="secondary"
      title="各模块内容管理"
      :rows-per-page-options="rowsPerPageOpts"
      rows-per-page-label="每页显示行数"
      :pagination.sync="paginationControl"
    >
      <q-td slot="body-cell-content" slot-scope="props" :props="props">
        <span class="text-italic cursor-pointer" @click="lookDetail(props)">
          {{ removeHTMLTag(props.value).substr(0, 36) }}
          <q-tooltip anchor="top middle" self="bottom middle" :offset="[10, 10]">点击查看详情</q-tooltip>
        </span>
        
      </q-td>
      <q-td slot="body-cell-createTime" slot-scope="props" :props="props">
        {{ dateFmt(props.value) }}
      </q-td>
      <template slot="top-selection" slot-scope="props" class="col-4">
        <q-btn color="positive" flat round icon="edit" class="q-mr-sm" @click="editRow" />
        <q-btn color="negative" flat round icon="delete" @click="deleteRow" />
      </template>

      <!-- <template slot="top-left" slot-scope="props">
      </template> -->

      <template slot="top-right" slot-scope="props">
        <q-search
          hide-underline
          color="secondary"
          v-model="filter"
          placeholder="搜索"
          class="col-12 q-mb-sm"
        />
        <q-table-columns
          label="筛选"
          color="secondary"
          class="q-mr-sm"
          v-model="visibleColumns"
          :columns="columns"
        />
        <q-select
          color="secondary"
          v-model="separator"
          :options="[
            { label: 'Horizontal', value: 'horizontal' },
            { label: 'Vertical', value: 'vertical' },
            { label: 'Cell', value: 'cell' },
            { label: 'None', value: 'none' }
          ]"
          hide-underline
        />
        <q-btn
          flat round dense
          :icon="props.inFullscreen ? 'fullscreen_exit' : 'fullscreen'"
          @click="props.toggleFullscreen"
        />
        
      </template>
    </q-table>
   <q-modal v-model="editedModal" :content-css="{padding: '50px'}" maximized ref="modalRef">
    <div class="row">
      <q-card inline flat class="col-xs-12">
        <q-card-media>
        </q-card-media>
        <q-card-title>
          {{ editedItem.title }}
        </q-card-title>
        <q-card-main v-html="editedItem.content"></q-card-main>
        <!-- <q-card-actions> -->
          <div class="col-12 text-center">
            <q-btn color="warning" class="q-mr-md" v-close-overlay label="取消" />
            <q-btn color="positive" v-close-overlay label="编辑" @click="save" />
          </div>
        <!-- </q-card-actions> -->
      </q-card>
    </div>
   </q-modal>
  </q-page>
</template>

<script>
import { date } from 'quasar'
const { formatDate } = date
const today = new Date()
import { removeHTMLTag } from '../utils/common'
import { mapGetters, mapActions } from 'vuex'
export default {
  // name: 'PageName',
  data: () => ({
    tableData: [],
    rowsPerPageOpts: [10, 15, 20, 0],
    columns: [
      { name: 'type', required: true, label: '模块类型', align: 'left', field: 'type', sortable: true },
      { name: 'title', label: '标题', align: 'left', field: 'title', sortable: true },
      { name: 'content', label: '内容', align: 'left', field: 'content', sortable: true },
      { name: 'createTime', label: '创建时间', align: 'left', field: 'createTime', sortable: true },
      { name: 'id', label: 'ID', align: 'left', field: 'id', sortable: true }
    ],
    filter: '',
    visibleColumns: ['type', 'title', 'content', 'createTime'],
    separator: 'none',
    // pagination: {
    //   page: 1
    // },
    paginationControl: { rowsPerPage: 10, page: 1 },
    loading: false,
    dark: true,
    selectedSecond: [
    ],
    editedModal: false,
    editedItem: {},
    editedIndex: -1,
    payStatusOpts: [
      { label: '支付成功', value: '支付成功' },
      { label: '未支付', value: '未支付' }
    ],
    disablePayStatus: true,
    today
  }),
  methods: {
    fetchData() {
      this.$http.get(process.env.API + '/module/info/listAll').then(
        res => {
          console.log(res.data);
          this.tableData = res.data.data;
        }
      ).catch(
        err => {
          console.log(err);
        }
      )
    },
    deleteRow () {
      this.$q.notify({
        color: 'negative',
        icon: 'delete',
        message: `确定要删除吗？`,
        position: 'top',
        timeout: 0,
        actions: [
          {
            label: '确定',
            handler: () => {
              // console.log('确认删除', this.selectedSecond);
              var idArray = [];
              for (var i=0; i<this.selectedSecond.length; i++) {
                idArray.push(this.selectedSecond[i].id);
              }
              var ids = idArray.join(',');
              this.$http.post(process.env.API + '/module/info/delete?ids=' + ids)
              .then(res => {
                if (res.data.code == 200) {
                  this.fetchData();
                  this.$q.notify({
                    color: 'positive',
                    icon: 'mood',
                    message: `删除成功！`,
                    position: 'center',
                    timeout: 1000,
                  })
                } else {
                  this.$q.notify({
                    color: 'negative',
                    icon: 'mood_bad',
                    message: `删除失败，请刷新后重试！`,
                    position: 'center',
                    timeout: 1000,
                  })
                }
              })
              .catch(err => {
                console.log(err);
              })
            }
          },
          {
            label: '取消',
            handler: () => {
              console.log('取消');
            }
          }
        ]
      })
    },
    editRow() {
      this.editedIndex = this.tableData.indexOf(this.selectedSecond[0]);
      this.editedItem = Object.assign({}, this.selectedSecond[0]);
      this.$router.push('/main/dataInput');
      this.$store.commit('editModuleInfo', this.editedItem);
    },
    save() {
      console.log(this.editedItem);
      this.$router.push('/main/dataInput');
      this.$store.commit('editModuleInfo', this.editedItem);
    },
    dateFmt(timeStamp) {
      return formatDate(timeStamp, 'YYYY-MM-DD HH:mm:ss')
    },
    removeHTMLTag,
    lookDetail(props) {
      // console.log(props);
      this.editedModal = true;
      this.editedItem = props.row
    }
  },
  mounted() {
    this.fetchData();
  }
}
</script>

<style>
</style>
