<template>
<form class="interact-form" action="/contactform" data-netlify="true" name="contact" netlify-honeypot="cigarette-brand" id="quoteform">

    <div class="paperbox maxw container">
        <div class="row">
            <div class="col-md col-sm-12" v-t="'message.item'"></div>
            <div class="col-md-1 col-sm-6 text-right" v-t="'message.count'"></div>
            <div class="col-md-1 col-sm-6 text-right" v-t="'message.price'"></div>
        </div>
        <div class="row"><hr class="col-12"></div>
        <template v-for="(taskByGroup, groupid) of $root.pstate.tasks" v-if="Object.keys(taskByGroup).length>0" >
            <div :key="groupid" class="row"><span class="col-12">{{ $root.tr($root.$options.products.groups[groupid],"text") }}</span></div>
        <template v-for="(taskinstances, taskid) of taskByGroup" >
            <div v-for="(taskInstance, instanceID) of taskinstances" class="row pl-3" :key="groupid+'-'+taskid+'-'+instanceID">
                <div class="col-md col-sm-12">{{ $root.tr($root.$options.products.tasks[taskid],"text") }}</div>
                <div class="col-md-1 col-sm-6 text-right" v-b-tooltip.hover.bottom :title="$root.partduration(taskInstance)+'h'">{{ $root.$options.products.tasks[taskid].singleconfig ? taskInstance._count : 1 }}x</div>
                <div class="col-md-1 col-sm-6 text-right">{{ $root.partcost(taskInstance) }}€</div>
                <input v-for="(value,key) of taskInstance" :key="key" class="form-special" :name="$root.$options.products.tasks[taskid].text+'-'+key" :value="value">
            </div>
        </template>
        </template>
        <div class="row"><span class="col-12" v-t="'message.planning'"></span></div>
        <div v-for="pitem of $root.$options.pitems" class="row pl-3" :key="pitem.id" v-if="pitem.applicable($root)">
            <div class="col-md col-sm-12">{{ $root.tr(pitem,"text") }}</div>
            <div class="col-md-1 col-sm-6 text-right" v-b-tooltip.hover.bottom :title="pitem.duration($root)+'h'">{{ pitem.count($root) }}x</div>
            <div class="col-md-1 col-sm-6 text-right">{{ pitem.cost($root) }}€</div>
            <input class="form-special" :name="pitem.id" :value="pitem.cost($root)">
        </div>
        <div class="row"><hr class="col-12"></div>
        <div class="row">
            <div class="col" v-t="'message.vat'"></div>
            <div class="col-1 text-right"></div>
            <div class="col-1 text-right">-</div>
        </div>
        <div class="row">
            <div class="col" v-t="'message.total'"></div>
            <div class="col-1 text-right"></div>
            <div class="col-1 text-right"><b>{{ $root.sumcost }}€</b></div>
            <input class="form-special" name="totalcost" :value="$root.sumcost">
        </div>
        <div class="row">
            <div class="col" v-t="'message.durationdays'"></div>
            <div class="col-1 text-right"></div>
            <div class="col-1 text-right">{{ $root.sumduration }}d</div>
            <input class="form-special" name="totalduration" :value="$root.sumduration">
        </div>
    </div>
    <div class="pt-4 container maxw">
        <input required type="text" class="form-control form-special" placeholder="Message subject" name="subject" value="Quote Form">
        <p v-t="'message.hearfromus'"></p>
        <div class="form-group row">
            <div class="col-md-6 col-sm-12"><input required type="text" class="form-control" :placeholder="$t('message.yourname')"  name="fullname" autofocus id="quotename"></div>
            <div class="col-md-6 col-sm-12"><input required type="email" class="form-control" :placeholder="$t('message.email')"  name="email"></div>
        </div>
        <div class="form-group row">
            <div class="col-12"><textarea required class="form-control" rows="3" :placeholder="$t('message.message')" name="text"></textarea></div>
        </div>
        <div class="text-right row d-print-none"><div class="col-12">
            <button type="button" class="btn btn-danger" @click="$root.startover()" v-t="'button.startover'"></button>
            <button type="submit" class="btn btn-success" :disabled="submitted" data-loading="<i class='fas fa-circle-notch fa-spin'></i> ..." v-t="'button.submit'"></button>
        </div></div>
    </div>
</form>
</template>

<script>
module.exports = {
    data: () => ({
        submitted: false,
    }),
    methods: {

    },
    mounted: function () {
        interceptFormSubmissions();
        document.addEventListener('FormSubmitted',() => {
            this.submitted = true;
            console.log("submitted");
        });
        document.getElementById("quotename").focus();
    }
}
</script>
<style>
@media only screen and (min-width: 767px) {
    .paperbox
    {
        padding: 50px;
        background-color: #fff;
        box-shadow: 0 0 5px rgba(0, 0, 0, 0.2), inset 0 0 50px rgba(0, 0, 0, 0.1);
    }
    .paperbox .row {
        font-family: monospace;
    }
    .paperbox:before, .paperbox:after
    {
        position: absolute;
        width: 200px;
        height: 10px;
        content: ' ';
        left: 12px;
        bottom: 12px;
        background: transparent;
        transform: skew(-5deg) rotate(-5deg);
        box-shadow: 0 6px 12px rgba(0, 0, 0, 0.3);
        z-index: -1;
    } 

    .paperbox:after
    {
        left: auto;
        right: 12px;
        transform: skew(5deg) rotate(5deg);
    }
}
</style>