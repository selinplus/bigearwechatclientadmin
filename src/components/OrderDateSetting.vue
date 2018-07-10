<template>
  <div class="row gutter-md">
    <div class="col-xs-6">
      <q-datetime 
        clearable modal
        float-label="预约起始时间" v-model="orderSetting.startDate" 
        type="datetime" :before="[{icon: 'date_range'}]" 
        :first-day-of-week="1" color="light-blue"
        format-model="number" :min="today"
      />
    </div>
    <div class="col-xs-6">
      <q-datetime 
        clearable modal
        float-label="预约截止时间" v-model="orderSetting.endDate" 
        type="datetime" :before="[{icon: 'date_range'}]" 
        :first-day-of-week="1" color="light-blue"
        format-model="number" :min="today"
      />
    </div>
    <div class="col-xs-3">
      <q-input v-model="orderSetting.hourAmount" type="number" suffix="辆" float-label="每小时内预约上限" :before="[{icon: 'local_shipping'}]"  />
    </div>
    <div class="col-xs-12 text-center">
      <q-btn color="positive" :loading="btnLoading" @click="setOrder">设置</q-btn>
    </div>
  </div>
</template>
<script>
const today = new Date()
export default {
  data: () => ({
    today,
    btnLoading: false,
    orderSetting: {
      id: 'orderSetting',
      startDate: null,
      endDate: null,
      hourAmount: 25
    },
    settingUrl: '/order/setting/add'
  }),
  mounted() {
   this.fetchData();
  },
  methods: {
    fetchData() {
      this.$http.post(process.env.API + '/order/setting/list')
      .then(res => {
        console.log(res.data);
        if (res.data.data.list.length > 0) {
          this.orderSetting = res.data.data.list[0];
          this.settingUrl = '/order/setting/update';
        } else {
          this.settingUrl = '/order/setting/add';
        }
      })
      .catch(err => {
        console.log(err);
      })
    },
    setOrder() {
      // console.log(this.orderSetting.startDate);
      // return;
      this.btnLoading = true;
      this.$http.post(process.env.API + this.settingUrl, this.orderSetting)
      .then(res => {
        this.btnLoading = false;
        console.log(res.data);
        if (res.data.code == 200) {
          this.settingUrl = '/order/setting/update';
          this.$q.notify({
            message :'设置成功！',
            color: 'positive',
            position: 'center',
            timeout: 1000
          });
        }
      })
      .catch(err => {
        console.log(err);
        this.btnLoading = false;
        this.$q.notify({
          message :'设置失败！',
          color: 'negative',
          position: 'center',
          timeout: 1000
        });
      })
    }
  }
}
</script>
