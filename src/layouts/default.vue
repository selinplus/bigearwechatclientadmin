<template>
  <q-layout view="lHh Lpr lFf">
    <q-layout-header>
      <q-toolbar
        color="primary"
        :glossy="$q.theme === 'mat'"
        :inverted="$q.theme === 'ios'"
      >
        <q-btn
          flat
          dense
          round
          @click="leftDrawerOpen = !leftDrawerOpen"
          aria-label="Menu"
        >
          <q-icon name="menu" />
        </q-btn>

        <q-toolbar-title>
          钉钉admin
          <!-- <div slot="subtitle">Running on Quasar v{{ $q.version }}</div> -->
        </q-toolbar-title>
      </q-toolbar>
    </q-layout-header>

    <q-layout-drawer
      v-model="leftDrawerOpen"
      :content-class="$q.theme === 'mat' ? 'bg-grey-2' : null"
    >
      <q-list
        no-border
        link
        inset-delimiter
      >
        <q-list-header>admin</q-list-header>
        <div  @click="clear">
          <q-item to="/main/dataInput">
            <q-item-side icon="school" />
            <q-item-main label="内容录入" sublabel="按模块录入客户端内容" />
          </q-item>
        </div>
        
        <q-item to="/main/contentManage">
          <q-item-side icon="chat" />
          <q-item-main label="内容管理" sublabel="客户端各模块内容管理" />
        </q-item>
        <q-item to="/main/orderManage">
          <q-item-side icon="code" />
          <q-item-main label="预约管理" sublabel="客户端年审预约模块管理" />
        </q-item>
       
        <q-item to="/main/setting">
          <q-item-side icon="settings" />
          <q-item-main label="设置" sublabel="年审预约时间设置等" />
        </q-item>
        <!-- <q-item @click.native="openURL('https://twitter.com/quasarframework')">
          <q-item-side icon="rss feed" />
          <q-item-main label="Twitter" sublabel="@quasarframework" />
        </q-item> -->
      </q-list>
    </q-layout-drawer>

    <q-page-container>
      <router-view />
    </q-page-container>
  </q-layout>
</template>

<script>
import { openURL } from 'quasar'

export default {
  name: 'LayoutDefault',
  data () {
    return {
      leftDrawerOpen: this.$q.platform.is.desktop
    }
  },
  methods: {
    openURL,
    clear() {
      // console.log('$%$$$$$$%%$');
      this.$store.commit('clear');
    }
  }
}
</script>

<style>
</style>
