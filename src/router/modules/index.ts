export default {
  path: "/index",
  name: "Index",
  meta: {
    icon: "ant-design:node-index-outlined",
    title: "index",
    rank: 1
  },
  children: [
    {
      path: "/index",
      name: "Index",
      component: () => import("@/views/index/index.vue"),
      meta: {
        title: "index"
      }
    }
  ]
} satisfies RouteConfigsTable;
