<template>
<div>
    <div class="maxw" v-html="$t('message.partselect')"></div>
<div v-for="(taskByGroup, groupid) of $root.pstate.tasks" :key="groupid" id="partdetails" class="maxw" v-if="Object.keys(taskByGroup).length>0" >
    <span class="h1">{{ $root.tr($root.$options.products.groups[groupid],"text") }}</span><br v-if="$root.hastr($root.$options.products.groups[groupid],'desc')"><small>{{ $root.tr($root.$options.products.groups[groupid],"desc") }}</small>
    <div class="card-deck mb-4">
    <div v-for="(taskinstances, taskid) of taskByGroup" :key="taskid" class="card mt-3" v-if="listtask(taskid)"><span v-for="(taskInstance, instanceID) of taskinstances" :key="instanceID">
        <div class="card-header">
            {{ $root.tr($root.$options.products.tasks[taskid],"text") }}
            <div v-if="!$root.$options.products.tasks[taskid].noshow" class="float-right">
                <template v-if="$root.$options.products.tasks[taskid].singleconfig">
                    <button v-t="'button.add'" type="button" class="btn btn-success btn-sm badge" @click.prevent.stop="$root.add(taskInstance,taskid,groupid)"></button>
                    <button type="button" class="btn btn-danger btn-sm badge" @click.prevent.stop="$root.remove(taskid,groupid)">
                    <span v-t="'button.remove'"></span> <span v-if="$root.$options.products.tasks[taskid].singleconfig" class="badge badge-light">{{ $root.pstate.tasks[groupid][taskid][0]._count }}</span>
                    </button>
                </template>
                <button v-else v-t="'button.remove'" type="button" class="btn btn-danger btn-sm badge" @click.prevent.stop="$root.remove(taskid,groupid)"></button>
            </div>
            <div class="sub">{{ $root.tr($root.$options.products.tasks[taskid],"tooltip"," - ") }}</div>
        </div>
        <div class="card-body">
            <div v-for="(component, componentid) of $root.$options.products.components" :key="component.id" v-if="listcomponent(taskid,component)">
                <div class="component" v-if="!component.range && !component.enum">
                    <label>
                        <b-form-checkbox v-model="taskInstance[component.id]" :disabled="component.disabled" :name="component.id">{{ $root.tr($root.$options.products.components[componentid],"text") }}</b-form-checkbox>
                        <div class="pl-4">{{ $root.tr($root.$options.products.components[componentid],"subtext") }}</div>
                    </label>
                </div>
                <div class="component" v-if="component.range">
                    {{ $root.tr($root.$options.products.components[componentid],'text') }}
                    <b-input-group class="pl-4">
                        <b-input-group-text  slot="append">
                            {{rangeValue(component,taskInstance)}} {{ $root.tr($root.$options.products.components[componentid],'prepend')}} 
                        </b-input-group-text>
                        <b-form-input type="range" :min="component.range[0]" :max="component.range[1]" :disabled="component.disabled" v-model="taskInstance[component.id]"></b-form-input>
                    </b-input-group>
                    <div class="pl-4">{{ $root.tr($root.$options.products.components[componentid],"subtext") }}</div>
                </div>
                <div class="component" v-if="$root.lang == 'en' && component.enum">
                    {{ $root.tr($root.$options.products.components[componentid],"text") }}:
                    <b-form-select type="range" :name="component.id"  v-model="taskInstance[component.id]">
                        <option v-for="(option,oindex) of component.enum" :value="oindex" :key="option">{{ option }} </option>
                    </b-form-select>
                    <div class="pl-4">{{ $root.tr($root.$options.products.components[componentid],"subtext") }}</div>
                </div>
                <div class="component" v-if="$root.lang == 'de' && component.enum_de">
                    {{ $root.tr($root.$options.products.components[componentid],"text") }}:
                    <b-form-select type="range" :name="component.id"  v-model="taskInstance[component.id]">
                        <option v-for="(option,oindex) of component.enum_de" :value="oindex" :key="option">{{ option }} </option>
                    </b-form-select>
                    <div class="pl-4">{{ $root.tr($root.$options.products.components[componentid],"subtext") }}</div>
                </div>
            </div>
        </div>
        <div class="card-footer text-right"><span v-t="'message.subtotal'"></span>: {{ $root.partcost(taskInstance) }}€</div>
    </span></div>
    </div>
</div>
</div>
</template>

<script>
module.exports = {
     methods: {
        listcomponent: function(taskid, component) {
            return this.$root.$options.products.tasks[taskid].items.includes(component.id);
        },
        listtask: function(taskid) {
            return !this.$root.$options.products.tasks[taskid].nodetails;
        },
        rangeValue: function(component,taskInstance) {
            if (component.value) return component.value(taskInstance[component.id])
            return taskInstance[component.id];
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
#partdetails .component {
    padding-bottom: 20px;
}
</style>