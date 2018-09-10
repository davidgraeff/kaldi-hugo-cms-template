import {productgroups, producttasks, productcomponents} from "/js/constdata.js";
var products = {
    groups: productgroups,
    tasks: producttasks,
    components: productcomponents
  }

function loadQuoteApp() {
    if (document.getElementById('quoteapp')===null) return;

    // Preprocess const data
    products.componentsMap = new Map;
    products.components.forEach(element =>  products.componentsMap[element.id] = element);
    products.tasksMap = new Map;
    products.tasks.forEach(element =>  products.tasksMap[element.id] = element);

    Vue.use(httpVueLoader);
    new Vue({
        products: Object.freeze(products),
        storageTimer: null,
        items: [
            {
                text: '<i class="fa fa-fw fa-home"></i> Select Project Components',
                text_de: '<i class="fa fa-fw fa-home"></i> Wählen Sie die Projektbestandteile',
                tab: 'determineparts'
            },
            {
                text: 'Component Details',
                text_de: 'Details',
                tab: 'partdetails'
            },
            {
                text: 'Computed Quote',
                text_de: 'Ausgerechnetes Budget',
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
            pstate: {
                handler:function(val) {
                    if (!this.$ready) return;
                    if (this.$options.storageTimer) clearTimeout(this.$options.storageTimer);
                    this.$options.storageTimer = setTimeout(() => {
                        console.log("store", JSON.stringify(val));
                        this.$options.storageTimer = null;
                        if (!val.count)
                            localStorage.setItem("quotestate", null);
                        else
                            localStorage.setItem("quotestate", JSON.stringify(val));
                    }, 1000);
                },
                deep: true
            }
        },
        methods: {
            tr: function(item, param, prepend="") {
                var t = item[param+"_"+this.lang];
                return t ? prepend+t : (item[param]?prepend+item[param]:undefined);
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
            startover: function() {
                this.internalReset();
                this.clickTab("determineparts");
            },
            internalReset: function() {
                var tasks = [];
                for (var i in productgroups)
                    tasks[i] = {};
                this.pstate.tasks = tasks;
                this.pstate.count = 0;
            },
            partcost: function(values) {
                var n = 0;
                for (const cid in values) {
                    if (!values.hasOwnProperty(cid)) continue;
                    const c = this.$root.$options.products.componentsMap[cid];
                    n += c.cost(Number(values[cid]));
                }
                return n;
            }
        },
        computed: {
            sumcost: function() {
                var n = 0;
                for (const group of this.$root.pstate.tasks.values()) {
                    for (const task_i in group) {
                        if (!group.hasOwnProperty(task_i)) continue;
                        const task = group[task_i];
                        for (const task_instance_i in task) {
                            if (!task.hasOwnProperty(task_instance_i)) continue;
                            const taskinstance = task[task_instance_i];
                            for (const cid in taskinstance) {
                                if (!taskinstance.hasOwnProperty(cid)) continue;
                                const c = this.$root.$options.products.componentsMap[cid];
                                n += c.cost(Number(taskinstance[cid]));
                            }
                        }
                    }
                }
                return n;
            },
            sumduration: function() {
                var n = 0;
                for (const group of this.$root.pstate.tasks.values()) {
                    for (const task_i in group) {
                        if (!group.hasOwnProperty(task_i)) continue;
                        const task = group[task_i];
                        for (const task_instance_i in task) {
                            if (!task.hasOwnProperty(task_instance_i)) continue;
                            const taskinstance = task[task_instance_i];
                            for (const cid in taskinstance) {
                                if (!taskinstance.hasOwnProperty(cid)) continue;
                                const c = this.$root.$options.products.componentsMap[cid];
                                n += c.duration(Number(taskinstance[cid]));
                            }
                        }
                    }
                }
                return Math.round(n/8)+1;
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
            Vue.nextTick().then(()=> this.$ready = true);
            window.addEventListener("popstate", () => this.changeTab(), false);
        }
    });
}

document.addEventListener("MainContentChanged", loadQuoteApp);
if (window.loaded) loadQuoteApp();