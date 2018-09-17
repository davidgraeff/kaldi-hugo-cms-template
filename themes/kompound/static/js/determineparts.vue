<template>
<div>
    <div class="maxw" v-html="$t('message.determineparts')"></div>
    <div v-for="(group,groupid) of $root.$options.products.groups" :key="groupid" id="determineparts" class="maxw" v-if="!group.noshow">
        <span class="h1">{{ $root.tr(group,"text") }}</span><br><small>{{ $root.tr(group,"desc") }}</small>
        <div class="card-deck p-4">
            <a href="#" v-for="(task,taskid) of $root.$options.products.tasks" :key="task.id"
            v-if="task.gid == groupid && !task.noshow"
                @click.prevent="$root.add(task, taskid, groupid)" class="card" :class="{active: $root.pstate.tasks[groupid][taskid]}" v-b-tooltip.hover.bottom :title="$root.tr(task,'tooltip')">
                <img class="card-img-top p-3" :src="'/img/icons/'+task.icon" onload="inlineSVG(this)">
                <center class="card-title">{{ $root.tr(task,"text") }}</center>
                <button type="button" class="btn btn-danger btn-sm" v-if="$root.pstate.tasks[groupid][taskid]" @click.prevent.stop="$root.remove(taskid, groupid)">
                Remove <span class="badge badge-light">{{ $root.$options.products.tasks[taskid].singleconfig ? $root.pstate.tasks[groupid][taskid][0]._count : $root.pstate.tasks[groupid][taskid].length }}</span>
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