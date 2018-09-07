import {productgroups, producttasks, productcomponents} from "/js/constdata.js";
var products = Object.freeze({
    groups: productgroups,
    tasks: producttasks,
    components: productcomponents
  })

function loadQuoteApp() {
    if (document.getElementById('quoteapp')===null) return;

    Vue.use(httpVueLoader);
    new Vue({
        products: products,
        storageTimer: null,
        items: [
            {
                text: '<i class="fa fa-fw fa-home"></i> Your projects components',
                text_de: '<i class="fa fa-fw fa-home"></i> Projektbestandteile',
                tab: 'determineparts'
            },
            {
                text: 'Component details',
                text_de: 'Bestandteil Details',
                tab: 'partdetails'
            },
            {
                text: 'Überblick',
                text_de: 'Überblick',
                tab: 'overview'
            },
        ],
        el: '#quoteapp',
        components: {
            'determineparts': 'url:/js/determineparts.vue',
            'partdetails': 'url:/js/partdetails.vue',
            'overview': 'url:/js/overview.vue',
        },
        data: () => ({
            pstate: {
                tasks:null
            },
            cstate: "determineparts"
        }),
        watch: {
            pstate: function(val) {
                console.log("store", val);
                if (this.$options.storageTimer) clearTimeout(this.$options.storageTimer);
                this.$options.storageTimer = setTimeout(() => {
                    this.$options.storageTimer = null;
                    if (val.count)
                        localStorage.setItem("quotestate", null);
                    else
                        localStorage.setItem("quotestate", JSON.stringify(val));
                }, 300);
            }
        },
        methods: {
            tr: function(item, param) {
                var t = item[param+"_"+this.lang];
                return t === undefined ? item[param] : t;
            },
            hastr: function(item, param) {
                var t = item[param+"_"+this.lang];
                return t !== undefined ? true : item[param]!==undefined;
            },
            clickTab: function(item) {
                console.log("click",item);
                this.cstate = item;
                history.pushState(null, "", "#"+item);
            },
            changeTab: function() {
                var startTab = this.$options.items.find(e => '#'+e.tab === window.location.hash);
                startTab = (!startTab) ? 'determineparts' : startTab.tab;
                console.log("change",startTab, window.location.hash);
                this.cstate = startTab;
            },
            goNext: function() {
                var startTabIndex = this.$options.items.findIndex(e => '#'+e.tab === window.location.hash);
                if (startTabIndex==-1) return;
                startTabIndex += 1;
                if (startTabIndex>=this.$options.items.length) return;
                this.clickTab(this.$options.items[startTabIndex].tab);
            },
            reset: function() {
                this.internalReset();
            },
            internalReset: function() {
                var tasks = [];
                for (var i in productgroups)
                    tasks[i] = {};
                this.pstate.tasks = tasks;
                this.pstate.count = 0;
            }
        },
        created: function () {
            this.lang = 'de';
            this.changeTab();
            var quotestate = JSON.parse(localStorage.getItem("quotestate"));
            if (quotestate && quotestate.tasks)
                this.pstate = quotestate;
            else
                this.internalReset();
            window.addEventListener("popstate", () => this.changeTab(), false);
        }
    });
}

document.addEventListener("MainContentChanged", loadQuoteApp);
if (window.loaded) loadQuoteApp();