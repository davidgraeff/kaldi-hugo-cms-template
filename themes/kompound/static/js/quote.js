import {productgroups, producttasks, productcomponents} from "/js/constdata.js";
    var products = {
        groups: productgroups,
        tasks: producttasks,
        components: productcomponents,
        componentsMap: new Map,
        tasksMap: new Map
    }
    products.components.forEach(element =>  products.componentsMap[element.id] = element);
    products.tasks.forEach(element =>  products.tasksMap[element.id] = element);

function loadQuoteApp() {
    if (document.getElementById('quoteapp')===null) return;

    const messages = {
    en: {
        button: {
            reset: 'Reset',
            next: 'Continue',
            add: "Add",
            remove: "Remove",
            submit: "Submit",
            startover: "Start over"
        },
        message: {
            intro: `<p>Choose project parts and requirements simply via click. Press Next to continue.</p>`,
            determineparts: `<p>Select your solution components by clicking on them. You can click multiple times on an item. Some items can be added a limited time only though.</p>
            <p>Press Next to continue.</p>`,
            partselect: `<p>Configure some details of your selected components.</p>
            <p>Press Next to continue.</p>`,
            subtotal: "Sub-total",
            total: "Total",
            vat: "VAT",
            durationdays: "Duration in days",
            planning: "Planning",
            item: "Item",
            count: "Count",
            price: "Cost",
            hearfromus: "Submit your quote and hear from us soon!",
            message: "Your message",
            email: "E-Mail Address",
            yourname: "Your name"
        }
    },
    de: {
        button: {
            reset: 'Zurücksetzen',
            next: 'Weiter',
            add: "Hinzufügen",
            remove: "Entfernen",
            submit: "Abschicken",
            startover: "Von vorne beginnen"
        },
        message: {
            intro: `<p>Stellen Sie Ihre Anforderungen ganz einfach per Klick zusammen. Drücken Sie auf Weiter um fortzufahren.</p>`,
            determineparts: `<p>Wählen Sie Ihre Auftrags-Komponenten nun aus durch einmaliges Klicken. Manche Komponenten können durch erneutes Klicken dem Auftrag öfters hinzugefügt werden.</p>
            <p>Drücken Sie auf Weiter um fortzufahren.</p>`,
            partselect: `<p>Wählen Sie einige weitere Details für Ihre ausgewählten Komponenten.</p>
            <p>Drücken Sie auf Weiter um fortzufahren.</p>`,
            subtotal: "Zwischensumme",
            total: "Summe",
            vat: "Mehrwertsteuer",
            durationdays: "Dauer in Tagen",
            planning: "Planungsphase",
            item: "Komponente",
            count: "Anzahl",
            price: "Kosten",
            hearfromus: "Senden Sie uns Ihre Zusammenstellung und beschreiben Sie kurz Ihr Projekt und Sie werden schon bald von uns hören!",
            message: "Ihre Nachricht",
            email: "Ihre E-Mail",
            yourname: "Ihr Name"
        }
    }
    };

// Create VueI18n instance with options
    const i18n = new VueI18n({
        locale: /\/de\//.test(window.location.href)?'de':'en', // set locale
        messages, // set locale messages
    })

    Vue.use(httpVueLoader);
    new Vue({
        i18n,
        products: Object.freeze(products),
        storageTimer: null,
        items: [
            {
                text: '<i class="fa fa-fw fa-home"></i>',
                text_de: '<i class="fa fa-fw fa-home"></i>',
                tab: 'intro'
            },
            {
                text: 'Order',
                text_de: 'Auftragsbestandteile',
                tab: 'determineparts'
            },
            {
                text: 'Details',
                text_de: 'Details',
                tab: 'partdetails'
            },
            {
                text: 'Computed Quote',
                text_de: 'Ausgerechnetes Budget',
                tab: 'overview'
            },
        ],
        pitems: [
            {id:"contract_software",text:"Contract drafting (Custom developed software solution)",text_de:"Vertragsaufsetzung (Eigenentwickelte Software Lösung)",
                applicable: vm => vm.isApplicable("software"),
                cost: vm => vm.contractCost("software",50),
                count: vm => vm.contractCount("software"),
                duration: () => 6},
            {id:"contract_acquisation",text:"Contract drafting (Hardware acquisation, installation and setup)",text_de:"Vertragsaufsetzung (Hardware Beschaffung, Aufstellung und Einrichtung)",
                applicable:vm => vm.isApplicable("acquisition"),
                cost: vm => vm.contractCost("acquisition",30),
                count: vm => vm.contractCount("acquisition"),
                duration: () => 2},
            {id:"contract_device",text:"Contract drafting (Custom device development)",text_de:"Vertragsaufsetzung (Eigenentwickelte Geräteentwicklung)",
                applicable:vm => vm.isApplicable("customdevice"),
                cost: vm => vm.contractCost("customdevice",50),
                count: vm => vm.contractCount("customdevice"),
                duration: () => 2},
            {id:"contract_coaching",text:"Contract drafting (Coaching)",text_de:"Vertragsaufsetzung (Schulung)",
                applicable:vm => vm.isApplicable("coaching"),
                cost: vm => vm.contractCost("coaching",10),
                count: vm => vm.contractCount("coaching"),
                duration: () => 1},
            {id:"lasten_pflichten_heft",text:"Performance and requirement specification pages",text_de:"Lasten- und Pflichtenheftseiten",
                applicable:() => true, cost: vm => vm.specificationSheetCost(),
                count: vm => vm.specificationSheetCount(),
                duration: vm => vm.specificationSheetDuration()},
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
            cstate: "intro"
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
            add: function(task_max,taskid,groupid) {
                if (!this.pstate.tasks[groupid][taskid])
                    Vue.set(this.pstate.tasks[groupid], taskid, []);
    
                var max = Number.isInteger(task_max) ? task_max :(Number.isInteger(task_max.max) ? task_max.max : 1000);
                if (this.pstate.tasks[groupid][taskid].length >= max) return;
    
                const componentIds = this.$options.products.tasks[taskid].items;
                var instance = {};
                for (let cid of componentIds) {
                    const c = this.$options.products.components.find(e => e.id == cid);
                    if (!c) {
                        console.error("Index not found", cid);
                        continue;
                    }
                    if (c.range) instance[cid] = c.default ? c.default : c.range[0];
                    else if (c.enum) instance[cid] = c.default ? c.default : 0;
                    else instance[cid] = c.default ? c.default : false;
                }
                // Special singleconfig task. Only one instance allowed
                if (this.$options.products.tasks[taskid].singleconfig) {
                    const len = this.pstate.tasks[groupid][taskid].length;
                    if (len==0) {
                        instance._count = 1;
                        this.pstate.tasks[groupid][taskid].push(instance);
                    } else {
                        this.pstate.tasks[groupid][taskid][0]._count++;
                    }
                } else
                    this.pstate.tasks[groupid][taskid].push(instance);
                    
                this.pstate.count++;
             },
             remove: function(taskid,groupid) {
                var tvalues = this.pstate.tasks[groupid][taskid];
                if (!tvalues || tvalues.length===0) return;
                if (this.$options.products.tasks[taskid].singleconfig) {
                    tvalues[0]._count = tvalues[0]._count - 1;
                    if (tvalues[0]._count <= 0) {
                        Vue.delete(this.pstate.tasks[groupid], taskid);
                    }
                } else {
                    if (tvalues.length === 1) {
                        Vue.delete(this.pstate.tasks[groupid], taskid);
                    } else {
                        tvalues.pop();
                    }    
                }
                if (this.pstate.count) this.pstate.count--;
            },
            isApplicable: function(type) {
                return this.pstate.tasks.some(gv=>Object.keys(gv).some(ii=>
                    this.$options.products.tasks[ii].contract_type==type && gv[ii].some(cv=>this.partcost(cv))));
            },
            contractCost: function(type,costmulti) {
                return this.contractCount(type) * costmulti;
            },
            contractCount: function(type) {
                return this.pstate.tasks.reduce((aG,vG)=>
                    aG + Object.keys(vG).reduce((aT,iT)=>
                        aT + (this.$options.products.tasks[iT].contract_type==type?1:0),0),0);
            },
            specificationSheetCost: function() {
                return Math.round(Math.sqrt(this.pstate.tasks.reduce((aG,vG)=>
                    aG + Object.values(vG).reduce((aT,vT)=>
                        aT + vT.reduce((aI,vI,vII)=>
                            aI+Object.keys(vI).filter(v=>v!=='_count').reduce((aC,kC)=>
                                aC+this.$options.products.components[vII].effort(vI[kC]),0),0),0),0)*100));
            },
            specificationSheetCount: function() {
                return this.pstate.tasks.reduce((aG,vG)=>
                    aG + Object.values(vG).reduce((aT,vT)=>
                        aT + vT.reduce((aI,vI,vII)=>
                            aI+Object.keys(vI).filter(v=>v!=='_count').reduce((aC,kC)=> aC+this.$options.products.components[vII].effort(vI[kC]),0),0),0),0)
            },
            specificationSheetDuration: function() {
                return Math.round(this.pstate.tasks.reduce((aG,vG)=>
                    aG + Object.values(vG).reduce((aT,vT)=>
                        aT + vT.reduce((aI,vI,vII)=>
                            aI+Object.keys(vI).filter(v=>v!=='_count').reduce((aC,kC)=>
                                aC+this.$options.products.components[vII].effort(vI[kC]),0),0),0),0)/5)
            },
            tr: function(item, param, prepend="") {
                var t = item[param+"_"+this.$i18n.locale];
                return t ? prepend+t : (item[param]?prepend+item[param]:undefined);
            },
            hastr: function(item, param) {
                var t = item[param+"_"+this.$i18n.locale];
                return t !== undefined ? true : item[param]!==undefined;
            },
            clickTab: function(item) {
                console.log("click",item);
                this.cstate = item;
                history.pushState(null, "", "#"+item);
            },
            changeTab: function() {
                var startTab = this.$options.items.find(e => '#'+e.tab === window.location.hash);
                startTab = (!startTab) ? 'intro' : startTab.tab;
                console.log("change",startTab, window.location.hash);
                this.cstate = startTab;
            },
            goNext: function() {
                var startTabIndex = this.$options.items.findIndex(e => '#'+e.tab === window.location.hash);
                if (startTabIndex==-1) startTabIndex=0;
                startTabIndex += 1;
                if (startTabIndex>=this.$options.items.length) return;
                this.clickTab(this.$options.items[startTabIndex].tab);
            },
            reset: function() {
                this.internalReset();
            },
            startover: function() {
                this.internalReset();
                this.clickTab("intro");
            },
            internalReset: function() {
                var tasks = [];
                for (var i in productgroups)
                    tasks[i] = {};
                this.pstate.tasks = tasks;
                this.pstate.count = 0;
                // Add coaching section
                this.add(1,this.$options.products.tasks.findIndex(e => e.id == 'coaching'),4);
            },
            partcost: function(values) {
                var n = 0;
                const count = Number.isInteger(values._count) ? values._count : 1;
                for (const cid in values) {
                    if (!values.hasOwnProperty(cid) || cid === '_count') continue;
                    const c = this.$options.products.componentsMap[cid];
                    n += c.cost(Number(values[cid]),count);
                }
                return Math.round(n);
            },
            partduration: function(values) {
                var n = 0;
                const count = Number.isInteger(values._count) ? values._count : 1;
                for (const cid in values) {
                    if (!values.hasOwnProperty(cid) || cid === '_count') continue;
                    const c = this.$options.products.componentsMap[cid];
                    n += c.duration(Number(values[cid]),count);
                }
                return Math.round(n);
            }
        },
        computed: {
            sumcost: function() {
                var n = this.$options.pitems.reduce((a,i)=>a+i.cost(this),0);
                for (const group of this.pstate.tasks.values()) {
                    for (const task_i in group) {
                        if (!group.hasOwnProperty(task_i)) continue;
                        const task = group[task_i];
                        for (const task_instance_i in task) {
                            if (!task.hasOwnProperty(task_instance_i)) continue;
                            const taskinstance = task[task_instance_i];
                            const count = Number.isInteger(taskinstance._count) ? taskinstance._count : 1;
                            for (const cid in taskinstance) {
                                if (!taskinstance.hasOwnProperty(cid)|| cid === '_count') continue;
                                const c = this.$options.products.componentsMap[cid];
                                n += c.cost(Number(taskinstance[cid]),count);
                            }
                        }
                    }
                }
                return Math.round(n);
            },
            sumduration: function() {
                var n = this.$options.pitems.reduce((a,i)=>a+i.duration(this),0);
                for (const group of this.pstate.tasks.values()) {
                    for (const task_i in group) {
                        if (!group.hasOwnProperty(task_i)) continue;
                        const task = group[task_i];
                        for (const task_instance_i in task) {
                            if (!task.hasOwnProperty(task_instance_i)) continue;
                            const taskinstance = task[task_instance_i];
                            const count = Number.isInteger(taskinstance._count) ? taskinstance._count : 1;
                            for (const cid in taskinstance) {
                                if (!taskinstance.hasOwnProperty(cid)|| cid === '_count') continue;
                                const c = this.$options.products.componentsMap[cid];
                                n += c.duration(Number(taskinstance[cid]),count);
                            }
                        }
                    }
                }
                return Math.round(n/8)+1;
            }
        },
        created: function () {
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