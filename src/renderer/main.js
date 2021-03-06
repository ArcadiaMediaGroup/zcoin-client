import Vue from 'vue'
import VTooltip from 'v-tooltip'
import VueTimeago from 'vue-timeago'
import VeeValidate from 'vee-validate'
import Scrollable from '@/directives/scrollable'
import Focus from '@/directives/focus'

import i18n from '#/lib/i18n'

import upperFirst from 'lodash/upperFirst'
import camelCase from 'lodash/camelCase'
import { sync } from 'vuex-router-sync'

import BindScopedSlotsPlugin from '@/plugins/BindScopedSlotsPlugin'
import Logger from '@/plugins/Logger'

import App from './App'
import router from './router'
import store from '../store/renderer'

import zcoind from '../daemon/init'

const app = require('electron').remote.app

const customValidationRules = [
    'isZcoinAddress',
    'notExceedingBalance'
]

customValidationRules.forEach((rule) => {
    require('./utils/validationRules/' + rule)
})

Vue.use(VTooltip, {
    defaultBoundariesElement: 'default-tooltip-boundary'
})

Vue.use(VueTimeago, {
    name: 'Timeago', // Component name, `Timeago` by default
    locale: i18n.getLocale({ app, store }), // Default locale
    locales: {
        // 'zh-CN': require('date-fns/locale/zh_cn'),
        'en': require('date-fns/locale/en')
    }
})
Vue.use(VeeValidate, {
    errorBagName: 'validationErrors',
    fieldsBagName: 'validationFields',
    inject: false
})
Vue.directive('scrollable', Scrollable)
Vue.directive('focus', Focus)
Vue.use(BindScopedSlotsPlugin)
Vue.use(Logger)

if (!process.env.IS_WEB) Vue.use(require('vue-electron'))
Vue.config.productionTip = false

// automatically registering BaseComponents as Component (stripping of Base)
const requireComponent = require.context('./components', true, /Base[A-Z]\w+\.(vue|js)$/)
requireComponent.keys().forEach(fileName => {
    // Get component config
    const componentConfig = requireComponent(fileName)

    // Get PascalCase name of component
    const componentName = upperFirst(
        camelCase(
            // Strip the path, "Base" and extension from the filename
            fileName.substr(fileName.lastIndexOf('/')).replace(/^(.*)\.\w+$/, '$1')
        )
    )

    // Register component globally
    Vue.component(
        componentName,
        // Look for the component options on `.default`, which will
        // exist if the component was exported with `export default`,
        // otherwise fall back to module's root.
        componentConfig.default || componentConfig
    )
})

// sync router and store
sync(store, router, {
    moduleName: 'AppRouter'
})


// TODO: Put this in a more appropriate place.
// Really this isn't a logically appropriate place to put our daemon interaction. It has nothing to do with rendering.
// But the way initialization is set up, it's hard to set $daemon anywhere else where it will be available to Vue
// instances, so we'll put it here. Hopefully this can be moved somewhere more sensible in a subsequent stage of
// refactoring.
Vue.prototype.$daemon = zcoind(store);
// Allow users to access this from Chrome Dev Tools.
window.$daemon = Vue.prototype.$daemon;

// Allow users to access the store from Chrome Dev Tools.
window.$store = store;

// This is so we can pass around global events, which we're basically using just to allow enter to work to submit forms
// that are spread across a large number of files with mixins.
// TODO: Figure out how to get rid of this.
Vue.prototype.$eventHub = new Vue()

/* eslint-disable no-new */
new Vue({
    components: { App },
    router,
    store,
    i18n: i18n.getModule({ app, store }),
    template: '<App/>'
}).$mount('#app')
