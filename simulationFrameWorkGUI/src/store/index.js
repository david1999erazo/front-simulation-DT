import Vue from 'vue'
import Vuex from 'vuex'
import buses from './modules/buses'
import lines from './modules/lines'
import projects from './modules/projects'
import simulation from './modules/simulation'
import stops from './modules/stops'
import variables from './modules/variables'
import clock from './modules/clock'


Vue.use(Vuex)

export default new Vuex.Store({
    modules:{
        buses,
        lines,
        projects,
        simulation,
        variables,
        stops,
        clock
    }
})
