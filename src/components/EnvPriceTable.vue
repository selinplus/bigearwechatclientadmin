<template>
  <div>
    <!-- content -->
    <q-table
      :data="tableData"
      :columns="columns"
      :filter="filter"
      :separator="separator"
      :visible-columns="visibleColumns"
      selection="multiple"
      :selected.sync="selectedSecond"
      row-key="fuelType"
      color="secondary"
      title="环检收费标准"
    >
      <template slot="top-selection" slot-scope="props" class="col-4">
        <q-btn color="positive" flat round icon="edit" class="q-mr-sm" @click="editRow()" />
        <q-btn color="negative" flat round icon="delete" @click="deleteRow" />
      </template>

      <template slot="top-right" slot-scope="props">
        <q-search
          hide-underline
          color="secondary"
          v-model="filter"
          placeholder="搜索"
          class="col-12 q-mb-sm"
        />
        <q-btn color="positive" flat round icon="add" dense class="q-mr-xs" @click="addRow" />
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
    <q-modal v-model="editedModal" :content-css="{padding: '50px'}" ref="modalRef">
      <!-- <div class="q-display-1 q-mb-md">Minimized Modal</div> -->
      <div class="row gutter-sm">
        <div class="col-6">
          <q-input v-model="editedItem.fuelType" float-label="燃油类型" 
            class="no-margin">
          </q-input>
        </div>
        <div class="col-6">
          <q-input v-model="editedItem.comments" float-label="备注(单选、多选等)" 
            class="no-margin">
          </q-input>
        </div>
        <div class="col-3">
          <q-input v-model="editedItem.initialCheck" float-label="初检" 
            class="no-margin">
          </q-input> 
        </div>
        <div class="col-3">
          <q-input v-model="editedItem.firstRecheck" float-label="一次复检" 
            class="no-margin">
          </q-input>
        </div>
        <div class="col-3">
          <q-input v-model="editedItem.secondRecheck" float-label="二次复检" 
            class="no-margin">
          </q-input>
        </div>
        <div class="col-3">
          <q-input v-model="editedItem.thirdRecheck" float-label="三次复检" 
            class="no-margin">
          </q-input>
        </div>
        <div class="col-12 row">
          <div class="col-12 text-center">
            <q-btn color="warning" class="q-mr-md" size="13px" v-close-overlay label="取消" @click="cancel" />
            <q-btn color="positive" size="13px" v-close-overlay label="确定" @click="save" />
          </div>
        </div>

      </div>
    </q-modal>
  </div>
</template>

<script>
export default {
  // name: 'PageName',
  data: () => ({
    tableData: [],
    columns: [
      { name: 'fuelType', label: '燃油类型', align: 'left', field: 'fuelType', sortable: true },
      { name: 'initialCheck', label: '初检', align: 'left', field: 'initialCheck', sortable: true },
      { name: 'firstRecheck', label: '一次复检', align: 'left', field: 'firstRecheck', sortable: true },
      { name: 'secondRecheck', label: '二次复检', align: 'left', field: 'secondRecheck', sortable: true },
      { name: 'thirdRecheck', label: '三次复检', align: 'left', field: 'thirdRecheck', sortable: true },
      { name: 'comments', label: '备注(单选、多选等)', align: 'left', field: 'comments', sortable: true }
    ],
    filter: '',
    visibleColumns: ['fuelType', 'initialCheck', 'firstRecheck', 'secondRecheck', 'thirdRecheck', 'comments'],
    separator: 'none',
    selection: 'multiple',
    pagination: {
      page: 1
    },
    paginationControl: { rowsPerPage: 3, page: 1 },
    loading: false,
    dark: true,
    selectedSecond: [
    ],
    editedModal: false,
    editedIndex: -1,
    editedItem: {
      fuelType: '',
      initialCheck: '',
      firstRecheck: '',
      secondRecheck: '',
      thirdRecheck: '',
      comments: ''
    },
    defaultItem: {
      fuelType: '',
      initialCheck: '',
      firstRecheck: '',
      secondRecheck: '',
      thirdRecheck: '',
      comments: ''
    }
  }),
  methods: {
    fetchData() {
      this.$http.get(process.env.API + '/env/check/list').then(
        res => {
          // console.log(res.data);
          this.tableData = res.data.data;
        }
      ).catch(
        err => {
          console.log(err);
        }
      )
    },
    addRow() {
      this.editedModal = true;
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
              var idArray = [];
              for (var i=0; i<this.selectedSecond.length; i++) {
                idArray.push(this.selectedSecond[i].id);
              }
              var ids = idArray.join(',');
              // console.log('确认删除', ids);
              this.$http.post(process.env.API + '/env/check/delete?ids=' + ids)
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
             
            }
          }
        ]
      })
    },
    editRow() {
      this.editedModal = true;
      this.editedIndex = this.tableData.indexOf(this.selectedSecond[0]);
      this.editedItem = Object.assign({}, this.selectedSecond[0]);
    },
    save() {
      if (this.editedIndex == -1) {
        this.$http.post(process.env.API + '/env/check/add', this.editedItem)
        .then(res => {
          console.log(res.data);
          if (res.data.code == 200) {
            this.$q.notify({
              color: 'positive',
              icon: 'mood',
              message: `添加成功！`,
              position: 'center',
              timeout: 1000,
            })
            this.tableData.push(this.editedItem);
            console.log(this.editedItem, this.tableData);
          } else {
            this.$q.notify({
              color: 'negative',
              icon: 'mood_bad',
              message: res.data.message,
              position: 'center',
              timeout: 1000,
            })
          }
          
        })
        .catch(err => {
          console.log(err);
        });
      } else {
        this.$http.post(process.env.API + '/env/check/update', this.editedItem)
        .then(res => {
          console.log(res.data);
          if (res.data.code == 200) {
            this.$q.notify({
              color: 'positive',
              icon: 'mood',
              message: `修改成功！`,
              position: 'center',
              timeout: 1000,
            })
            Object.assign(this.tableData[this.editedIndex], this.editedItem);
          } else {
            this.$q.notify({
              color: 'negative',
              icon: 'mood_bad',
              message: res.data.message,
              position: 'center',
              timeout: 1000,
            })
          }
        })
        .catch(err => {
          console.log(err);
        })
      }
      this.cancel();
    },
    cancel() {
      setTimeout(() => {
        this.editedItem = Object.assign({}, this.defaultItem);
        this.editedIndex = -1;
      }, 300);
    }
  },
  mounted() {
    this.fetchData();
  }
}
</script>

<style>
</style>