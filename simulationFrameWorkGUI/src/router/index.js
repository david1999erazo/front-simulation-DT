import Vue from 'vue';
import VueRouter from 'vue-router';
import canvas from '../components/Canvas/Canvas';
import Home from '../components/Home.vue';
import newProject from '../components/CreateProject/createProject';
import variables from '../components/VariablesConfig/variables';

Vue.use(VueRouter)

const Foo = { template: '<div>foo</div>' }

const routes = [
    {path: '/', component: Home },
    {path: '/project', component: Foo},
    {path: '/newproject', component: newProject},
    {path: '/canvas/:name', component: canvas},
    {path: '/variables/:name', component: variables},
];

export default new VueRouter({
    base: '/simulation/'
    ,routes
});
