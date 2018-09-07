<template>
<div>
<div v-for="(taskByGroup, groupid) of $root.pstate.tasks" :key="groupid" id="partdetails" v-if="Object.keys(taskByGroup).length>0" >
    <span class="h1">{{ $root.tr($root.$options.products.groups[groupid],"text") }}</span><br v-if="$root.hastr($root.$options.products.groups[groupid],'desc')"><small>{{ $root.tr($root.$options.products.groups[groupid],"desc") }}</small>
    <div class="card-deck mb-4">
    <div v-for="(taskinstances, taskid) of taskByGroup" :key="taskid" class="card mt-3"><span v-for="(taskInstance, instanceID) of taskinstances" :key="instanceID">
        <div class="card-header">
            {{ $root.tr($root.$options.products.tasks[taskid],"text") }}
            <span v-if="$root.hastr($root.$options.products.tasks[groupid],'tooltip')"> - </span>
            <span class="sub">{{ $root.tr($root.$options.products.tasks[taskid],"tooltip") }}</span>
            <button type="button" class="btn btn-danger btn-sm badge float-right" @click.prevent.stop="remove(task,taskid,groupid)">
            Remove
            </button>
        </div>
        <div class="card-body">
            <div v-for="(component, componentid) of $root.$options.products.components" :key="component.id" v-if="$root.$options.products.tasks[taskid].items.includes(component.id)">
                <div  v-if="!component.range && !component.enum">
                    <b-form-checkbox v-model="taskInstance[component.id]" :name="component.id">{{ $root.tr($root.$options.products.components[componentid],"text") }}</b-form-checkbox>
                    <div class="pl-4">{{ $root.tr($root.$options.products.components[componentid],"subtext") }}</div>
                </div>
                <div  v-if="component.range">
                    <b-form-input type="range" :min="component.range[0]" :max="component.range[1]" :name="component.id">{{ $root.tr($root.$options.products.components[componentid],"text") }}</b-form-input>
                    <div class="pl-4">{{ $root.tr($root.$options.products.components[componentid],"subtext") }}</div>
                </div>
                <div  v-if="component.enum">
                    {{ $root.tr($root.$options.products.components[componentid],"text") }}:
                    <b-form-select type="range" :name="component.id">
                        <option v-for="option of component.enum" :value="option" :key="option">{{ option }} </option>
                    </b-form-select>
                    <div class="pl-4">{{ $root.tr($root.$options.products.components[componentid],"subtext") }}</div>
                </div>
            </div>
        </div>
    </span></div>
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
         remove: function(task,taskid,groupid) {
            if (!this.$root.pstate.tasks[groupid][taskid]) return;
            if (this.$root.pstate.tasks[groupid][taskid].length === 1) {
                Vue.delete(this.$root.pstate.tasks[groupid], taskid);
            } else {
                this.$root.pstate.tasks[groupid][taskid].pop();
            }
            if (this.$root.pstate.count) this.$root.pstate.count--;
            this.$root.save();
        }
     },
    created: function () {

    }
}
</script>
<style>
#partdetails .card {
    min-width: 600px;
}
#partdetails .card-header .sub {
    text-overflow: ellipsis;
    white-space: nowrap;
    overflow: hidden;
}
</style>