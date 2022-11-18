import { createRouter,createWebHashHistory} from "vue-router";
import userView from "../view/userView.vue";
const routes = [
    {
        //在路径是/的时候，路由到imgUpload
        path: "/",
        redirect: "/userView",
    },
    {
        //在路径是/userCount的时候，路由到userCount
        path: "/userView", //命名路由
        name: "userView", //路由名称
        component: userView, //页面跳转地址
    },
]

//导出router
export const router = createRouter({
    history: createWebHashHistory(), //不同的历史记录模式详情看：https://router.vuejs.org/zh/guide/essentials/history-mode.html
    routes: routes
})
