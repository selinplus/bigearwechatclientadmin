<template>
  <q-page>
    <q-table
      :data="tableData"
      :columns="columns"
      :filter="filter"
      :separator="separator"
      :visible-columns="visibleColumns"
      selection="single"
      :selected.sync="selectedSecond"
      row-key="orderNum"
      color="secondary"
      title="预约管理"
      :rows-per-page-options="rowsPerPageOpts"
      rows-per-page-label="每页显示行数"
      :pagination.sync="paginationControl"
    >
      <q-td slot="body-cell-orderDate" slot-scope="props" :props="props">
        {{ dateFmt(props.value) }}
      </q-td>
      <template slot="top-selection" slot-scope="props" class="col-4">
        <q-btn color="positive" flat round icon="edit" class="q-mr-sm" @click="editRow" />
        <!-- <q-btn color="negative" flat round icon="delete" @click="deleteRow" /> -->
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
   <q-modal v-model="editedModal" :content-css="{padding: '50px'}" ref="modalRef">
    <div class="row gutter-sm">
      <div class="col-12">
        <q-select 
          v-model="editedItem.payStatus"
          float-label="支付状态"
          :options="payStatusOpts"
          :disable="disablePayStatus"
          clearable
        />
      </div>
      <div class="col-12">
        <q-datetime 
          class="col-xs-12 q-mb-lg" clearable 
          float-label="预约时间" v-model="editedItem.orderDate" 
          type="datetime" :before="[{icon: 'date_range'}]" 
          :first-day-of-week="1" color="light-blue"
          format-model="date" :min="today"
        />
      </div>
      <div class="col-12 row">
        <div class="col-12 text-center">
          <q-btn color="warning" class="q-mr-md" size="13px" v-close-overlay label="取消" />
          <q-btn color="positive" size="13px" v-close-overlay label="确定" @click="save" />
        </div>
      </div>
    </div>
   </q-modal>
  </q-page>
</template>

<script>
import { date } from 'quasar'
const { formatDate } = date
const today = new Date()
export default {
  // name: 'PageName',
  data: () => ({
    tableData: [],
    rowsPerPageOpts: [10, 15, 20, 0],
    columns: [
      { name: 'name', required: true, label: '联系人', align: 'left', field: 'name', sortable: true },
      { name: 'phone', label: '手机号', align: 'left', field: 'phone', sortable: true },
      { name: 'platenum', label: '车牌号', align: 'left', field: 'platenum', sortable: true },
      { name: 'vehicleType', label: '车辆类型', align: 'left', field: 'vehicleType', sortable: true },
      { name: 'vehicleTypeFee', label: '车辆安检费', align: 'left', field: 'vehicleTypeFee', sortable: true },
      { name: 'secuAddition', label: '附加项', align: 'left', field: 'secuAddition', sortable: true },
      { name: 'secuAdditionFee', label: '附加费', align: 'left', field: 'secuAdditionFee', sortable: true },
      { name: 'fuelType', label: '燃油类型', align: 'left', field: 'fuelType', sortable: true },
      { name: 'envCheckType', label: '环检类型', align: 'left', field: 'envCheckType', sortable: true },
      { name: 'envCheckTypeFee', label: '环检费', align: 'left', field: 'envCheckTypeFee', sortable: true },
      { name: 'totalFee', label: '总费用', align: 'left', field: 'totalFee', sortable: true },
      { name: 'orderNum', label: '订单号', align: 'left', field: 'orderNum', sortable: true },
      { name: 'orderDate', label: '预约时间', align: 'left', field: 'orderDate', sortable: true },
      { name: 'paymentMethod', label: '支付方式', align: 'left', field: 'paymentMethod', sortable: true },
      { name: 'payStatus', label: '支付状态', align: 'left', field: 'payStatus', sortable: true }
    ],
    filter: '',
    visibleColumns: ['name', 'phone', 'platenum', 'vehicleType', 'vehicleTypeFee', 'secuAddition', 'secuAdditionFee', 'fuelType', 'envCheckType', 'envCheckTypeFee', 'totalFee', 'orderDate', 'paymentMethod', 'payStatus'],
    separator: 'none',
    selection: 'multiple',
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
      this.$http.get(process.env.API + '/check/order/list').then(
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
              this.$http.post(process.env.API + '/check/order/deleteByIds?ids=' + ids)
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
      this.editedModal = true;
      this.editedIndex = this.tableData.indexOf(this.selectedSecond[0]);
      this.editedItem = Object.assign({}, this.selectedSecond[0]);
      if (this.editedItem.paymentMethod == '现场缴费') {
        this.disablePayStatus = false;
      } else {
        this.disablePayStatus = true;
      }
    },
    save() {
      this.$http.post(process.env.API + '/check/order/update', this.editedItem)
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
    },
    dateFmt(timeStamp) {
      return formatDate(timeStamp, 'YYYY-MM-DD HH:mm:ss')
    },
  },
  mounted() {
    this.fetchData();
  }
}
</script>

<style>
</style>
