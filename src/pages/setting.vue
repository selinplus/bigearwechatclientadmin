<template>
  <q-page>
    <!-- content -->
    <q-tabs inverted>
      <q-tab name="orderDateSetting" slot="title" label="预约时间设置" default></q-tab>
      <!-- <q-tab name="secu" slot="title" label="安检" default />
      <q-tab name="env" slot="title" label="环检" />
      <q-tab-pane name="secu">
        <secu-price-table></secu-price-table>
      </q-tab-pane>
      <q-tab-pane name="env">
        <env-price-table></env-price-table>
      </q-tab-pane> -->
      <q-tab-pane name="orderDateSetting">
        <order-date-setting></order-date-setting>
      </q-tab-pane>
    </q-tabs>
  </q-page>
</template>

<script>
import SecuPriceTable from '../components/SecuPriceTable'
import EnvPriceTable from '../components/EnvPriceTable'
import OrderDateSetting from '../components/OrderDateSetting'
export default {
  // name: 'PageName',
  components: {
    SecuPriceTable,
    EnvPriceTable,
    OrderDateSetting
  }
}
</script>

<style>
</style>
