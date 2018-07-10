<template>
<q-layout>
<q-page-container>
<q-page padding>
    
  <!-- <q-select 
    class="col-xs-12 q-mb-lg"
    v-model="order.vehicle"
    float-label="车辆类型"
    :options="vehicleOptions"
    :before="[{icon: 'format_list_bulleted'}]"
    clearable
  />

  <div class="row q-mb-lg gutter-sm">
    <q-radio class="col" v-model="order.envCheckType" val="初检(100)" color="amber" left-label label="初检(100)" />
    <q-radio class="col" v-model="order.envCheckType" val="一次复检(0)" color="amber" left-label label="一次复检(0)" />
    <q-radio class="col" v-model="order.envCheckType" val="二次复检(50)" color="amber" left-label label="二次复检(50)" />
    <q-radio class="col" v-model="order.envCheckType" val="三次复检(100)" color="amber" left-label label="三次复检(100)" />
  </div>
  <div class="row q-mb-lg gutter-xl">
    <q-checkbox class="col q-mr-md" v-model="secuAddition" val="路试(30)" color="amber" left-label label="路试(30)" />
    <q-checkbox class="col" v-model="secuAddition" val="称重(60)" color="amber" left-label label="称重(60)" />
  </div>
  <q-btn @click="log">log</q-btn>  

  <q-datetime
    v-model="date"
    type="datetime"
    stack-label="预约时间"
    :min="today"
  /> -->
  <img src="/api/1531117444485admin.png" alt="aaa">
  </q-page>
</q-page-container>
</q-layout>

  
</template>

<script>
const today = new Date()
export default {
  data () {
    return {
      vehicleOptions: [
        { label: '小、微型汽车(10)', value: '小、微型汽车(10)' },
        { label: '轻型汽车(20)', value: '轻型汽车(20)' },
        { label: '中型汽车(30)', value: '中型汽车(30)' },
        { label: '重型、中型、轻型半挂车(60)', value: '重型、中型、轻型半挂车(60)' },
        { label: '危险品挂车(40)', value: '危险品挂车(40)' },
        { label: '大型、重型汽车(60)', value: '大型、重型汽车(60)' }
      ],
      order: {
        vehicle: '',
        envCheckType: ''
      },
      secuAddition: [],
      date: null,
      today
    }
  },
  methods: {
    log() {
      // var type = this.order.vehicle.split('(')[0];
      // var fee = this.order.vehicle.split('(')[1].split(')')[0];
      // var obj = this.keyValueSplit(this.order.envCheckType);
      // console.log('type: ', obj.key);
      // console.log('fee: ', obj.value);
      // var fee = 0;
      // var type = [];
      // for (var i=0; i<this.secuAddition.length; i++) {
      //   fee += this.keyValueSplit(this.secuAddition[i]).value;
      //   type.push(this.keyValueSplit(this.secuAddition[i]).key);
      // }
      // console.log(fee, type.join(","));
      console.log(this.date);
    },
    keyValueSplit(str) {
      var key = str.split('(')[0];
      var value =  parseFloat(str.split('(')[1].split(')')[0]);
      return { key, value };
    }

  }
}
</script>