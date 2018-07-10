
export default [
  {
    path: '/',
    component: () => import('pages/login')
  },

  {
    path: '/main',
    component: () => import('layouts/default'),
    children: [
      { path: 'orderManage', name: '预约管理', component: () => import('pages/orderManage') },
      { path: 'dataInput', name: '内容录入', component: () => import('pages/dataInput') },
      { path: 'contentManage', name: '内容管理', component: () => import('pages/contentManage') },
      { path: 'setting', name: '设置', component: () => import('pages/setting') }
    ]
  },

  {
    path: '/test',
    component: () => import('pages/index')
  },

  { // Always leave this as last one
    path: '*',
    component: () => import('pages/404')
  }
]
