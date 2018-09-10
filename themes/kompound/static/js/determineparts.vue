<template>
<div>
    <div v-for="(group,groupid) of $root.$options.products.groups" :key="groupid" id="determineparts" class="maxw">
        <span class="h1">{{ $root.tr(group,"text") }}</span><br><small>{{ $root.tr(group,"desc") }}</small>
        <div class="card-deck p-4">
            <a href="#" v-for="(task,taskid) of $root.$options.products.tasks" :key="task.id" v-if="task.gid == groupid"
                @click.prevent="add(task, taskid, groupid)" class="card" :class="{active: $root.pstate.tasks[groupid][taskid]}" v-b-tooltip.hover.bottom :title="$root.tr(task,'tooltip')">
                <img class="card-img-top p-3" :src="'/img/icons/'+task.icon" onload="inlineSVG(this)">
                <center class="card-title">{{ $root.tr(task,"text") }}</center>
                <button type="button" class="btn btn-danger btn-sm" v-if="$root.pstate.tasks[groupid][taskid]" @click.prevent.stop="remove(task, taskid, groupid)">
                Remove <span class="badge badge-light">{{ $root.pstate.tasks[groupid][taskid].length }}</span>
                <span class="sr-only">unread messages</span>
                </button>
            </a>
        </div>
    </div>
</div>
</template>

<script>
module.exports = {
    data: () => ({

    }),
     computed: {
        quote_planung: function() {

        },
     },
     methods: {
         add: function(task,taskid,groupid) {
            if (!this.$root.pstate.tasks[groupid][taskid])
                Vue.set(this.$root.pstate.tasks[groupid], taskid, []);

            var max = Number.isInteger(task.max) ? task.max : 1000;
            if (this.$root.pstate.tasks[groupid][taskid].length >= max) return;

            const componentIds = this.$root.$options.products.tasks[taskid].items;
            var instance = {};
            for (let cid of componentIds) {
                const c = this.$root.$options.products.components.find(e => e.id == cid);
                if (!c) {
                    console.error("Index not found", cid);
                    continue;
                }
                if (c.range) instance[cid] = c.default ? c.default : c.range[0];
                else if (c.enum) instance[cid] = c.default ? c.default : 0;
                else instance[cid] = c.default ? c.default : false;
            }
            this.$root.pstate.tasks[groupid][taskid].push(instance);
                
            this.$root.pstate.count++;
         },
         remove: function(task,taskid,groupid) {
            if (!this.$root.pstate.tasks[groupid][taskid]) return;
            if (this.$root.pstate.tasks[groupid][taskid].length === 1) {
                Vue.delete(this.$root.pstate.tasks[groupid], taskid);
            } else {
                this.$root.pstate.tasks[groupid][taskid].pop();
            }
            if (this.$root.pstate.count) this.$root.pstate.count--;
        }
     },
    created: function () {

    }
}
</script>
<style>
#determineparts .card-deck {
    justify-content: center;
}
#determineparts .card {
    max-width: 200px;
    flex-basis: auto;
    flex-grow: 0;
    color: #c0c0c0;
    margin-bottom: 30px;
}
#determineparts .card:hover,
#determineparts .card.active {
    color: rgb(121, 167, 65);
}
#determineparts .card svg path {
    fill: #c0c0c0;
    transition: fill .3s ease-in-out;
}
#determineparts .card:hover svg path,
#determineparts .card.active svg path {
    fill: rgb(121, 167, 65);
}

#determineparts .card .card-img-top {
    max-height: 120px;
}
#determineparts .card .btn {
    position: absolute;
    right: -20px;
    top: -25px;
}

</style>