<template>
<div>  
    <ol class="breadcrumb-arrow">
        <li :class="currenttab=='erfassung'?'active':''"><a href="#" @click.stop.prevent="clickTab('erfassung')"><i class="fa fa-fw fa-home"></i> Erfassung</a></li>
        <b-breadcrumb-item v-for="item of items" :key="item.text" href="#" :text="item.text" @click.stop.prevent="clickTab(item.tab)" :active="currenttab==item.tab" active-class="active">
    </ol>

  <div id="erfassung">
      <div class="alert alert-white alert-success my-3 w-100">
      <div class="icon"> <i class="fas fa-info-circle"></i> </div>
      Stellen Sie uns Ihre Projektidee vor.
      </div>
      <b-card>
        <center>
          <b-form-group>
            <b-form-radio-group stacked buttons button-variant="outline-primary" v-model="erfassungS" name="erfassung" :options="erfassungO">
            </b-form-radio-group>
          </b-form-group>
          </center>

          <div class="float-right">
            <span class="mr-3">Zwischensumme: 0€</span>
            <b-button variant="success">Weiter</b-button>
          </div>
      </b-card>
  </div>

  <div id="planung">
      <div class="alert alert-white alert-success my-3 w-100">
      <div class="icon"> <i class="fas fa-info-circle"></i> </div>
      Ihr Projekt muss detailiert spezifiziert, ein Pflichten- und Lastenheft erstellt und ein Vertrag aufgesetzt werden.
      </div>
      <b-card>

        <b-form-checkbox name="pflichten_lastenheft" button-variant="success" v-model="pflichten_lastenheft">Pflichten- und Lastenheft</b-form-checkbox>
        <p class="pl-4">Zugangsgenehmigungen (Gebäude, Netzwerk), Terminpflichten, Hardware Beschaffenheiten, Software Integration, Software Beschreibung</p>
        <b-col sm="9" class="scalezero" v-bind:class="{ scaleenable: pflichten_lastenheft }">
            <b-input-group prepend="Erwarteter Umfang:">
            <b-input-group-text slot="append">
                {{pflichten_lastenheft_umfang}} Seite(n)
            </b-input-group-text>
            <b-form-input type="range" min="2" max="100" :disabled="!pflichten_lastenheft" v-model="pflichten_lastenheft_umfang"></b-form-input>
          </b-input-group>
        </b-col>

<hr>

        <b-form-checkbox name="gui_planung" v-model="gui_planung">Grafische Oberflächen</b-form-checkbox>
        <p class="pl-4">Prototypen Erstellung und Besprechung. Die entwickelten Oberflächen können meistens direkt im Endprodukt verwendet werden.</p>
        <b-col sm="9" class="scalezero" v-bind:class="{ scaleenable: gui_planung }">
            <b-input-group prepend="Erwarteter Umfang:">
            <b-input-group-text slot="append">
                {{gui_planung_umfang}} Oberfläche(n)
            </b-input-group-text>
            <b-form-input type="range" min="1" max="100" :disabled="!gui_planung" v-model="gui_planung_umfang"></b-form-input>
          </b-input-group>
        </b-col>

<hr>

        <b-form-checkbox name="employee_interviews_planung" v-model="employee_interviews_planung">Mitarbeiter Interviews</b-form-checkbox>
        <p class="pl-4">Bestimmung der Nutzungsszenarien und des Work-Flows für eine effiziente Bedienung</p>
        <b-col sm="9" class="scalezero" v-bind:class="{ scaleenable: employee_interviews_planung }">
            <b-input-group prepend="Erwartet:">
            <b-input-group-text slot="append">
                {{employee_interviews_umfang}} Interview(s)
            </b-input-group-text>
            <b-form-input type="range" min="1" max="5" :disabled="!employee_interviews_planung" v-model="employee_interviews_umfang"></b-form-input>
          </b-input-group>
        </b-col>

<hr>

        <b-form-checkbox name="vorstellung_planung" v-model="vorstellung_planung">Projektpräsentation</b-form-checkbox>
        <p class="pl-4">Software Prototypen Vorstellung mit erwartetem Nutzungsszenario</p>

<hr>

        <b-form-group label="Vertragsaufsetzung">
          <b-form-checkbox-group stacked class="pl-4" v-model="contracts_selected" name="contracts" :options="contracts">
          </b-form-checkbox-group>
        </b-form-group>

          <div class="float-right">
            <span class="mr-3">Zwischensumme: {{quote_planung}}€</span>
            <b-button variant="success">Weiter</b-button>
          </div>
      </b-card>
  </div>

  <div id="software">
      <div class="alert alert-white alert-success my-3 w-100">
      <div class="icon"> <i class="fas fa-info-circle"></i> </div>
      Beschreiben Sie die gfs. zu entwickelnden Softwarekomponenten.
      </div>
      <b-card>

          <h3>Daten Migration</h3>
          <p>Wir gehen sehr gewissenhaft mit Ihren Daten um. Es ist uns daher wichtig das der Datenschutz und die Datensicherung
              zu jeder Zeit sichergestellt sind. Müssen Daten migriert werden, fällt daher gegebenfalls zusätzliche
              Einarbeitung in das aktuelle System und die Sicherung an.
          </p>

          <div class="float-right">
            <span class="mr-3">Zwischensumme: {{quote_software}}€</span>
            <b-button variant="success">Weiter</b-button>
          </div>
      </b-card>
  </div>

  <div id="hardware">
      <div class="alert alert-white alert-success my-3 w-100">
      <div class="icon"> <i class="fas fa-info-circle"></i> </div>
       Beschreiben Sie die gfs. zu entwickelnde Hardwarekomponente.
      </div>
      <b-card>

        <b-form-checkbox name="leiterplatten_hardware" v-model="leiterplatten_hardware">Leiterplatten Entwurf</b-form-checkbox>
        <p class="pl-4">Sie können uns entweder einen fertigen Entwurf zukommen lassen oder uns die Leiterplatte entwerfen lassen.</p>

<hr>

        <b-form-group label="Hardware Komponenten">
          <p class="pl-4">Aus welchen Komponenten besteht das Produkt?</p>
          <b-form-checkbox-group class="pl-4" v-model="hardware_components_selected" name="hardware_components" :options="hardware_components">
          </b-form-checkbox-group>
        </b-form-group>

<hr>

        <b-form-checkbox name="case_hardware" v-model="case_hardware">Gehäuse Design</b-form-checkbox>
        <p class="pl-4">Besprechen Sie mit uns, ob Sie ein rein funktionalles Gehäuse oder ein ausgefalleneres Gehäuse mit Branding im Sinn haben.</p>

<hr>

        <b-form-checkbox name="prototyp_hardware" v-model="prototyp_hardware">Prototyp</b-form-checkbox>
        <p class="pl-4">Ein vollständiger Hardware Prototyp mit 3D Druck Gehäuse. Ein Prototyp hilft in der Regel enorm um letzte Unstimmigkeiten zu beheben.</p>

<hr>

          <div class="float-right">
            <span class="mr-3">Zwischensumme: {{quote_hardware}}€</span>
            <b-button variant="success">Weiter</b-button>
          </div>
      </b-card>
  </div>

  <div id="beschaffung">
      <div class="alert alert-white alert-success my-3 w-100">
      <div class="icon"> <i class="fas fa-info-circle"></i> </div>
      Geben Sie an ob Workstation PCs oder Server aktualisiert oder beschafft werden müssen.
      Aus Qualitäts- und Zuverlässigkeitsgründen empfehlen wir unseren Partner für Hardware
      Einkäufe. Zusätzlich suchen wir aber immer zwei weitere gfs. günstigere oder
      lokal nähere Angebote für Sie heraus.
      </div>
      <b-card>

          <div class="float-right">
            <span class="mr-3">Zwischensumme: {{quote_beschaffung}}€</span>
            <b-button variant="success">Weiter</b-button>
          </div>
      </b-card>
  </div>

  <div id="setup">
      <div class="alert alert-white alert-success my-3 w-100">
      <div class="icon"> <i class="fas fa-info-circle"></i> </div>
      Stellen Sie uns Ihre Projektidee vor.
      </div>
      <b-card>

          <div class="float-right">
            <span class="mr-3">Zwischensumme: {{quote_setup}}€</span>
            <b-button variant="success">Weiter</b-button>
          </div>
      </b-card>
  </div>

  <div id="coaching">
      <div class="alert alert-white alert-success my-3 w-100">
      <div class="icon"> <i class="fas fa-info-circle"></i> </div>
      Stellen Sie uns Ihre Projektidee vor.
      </div>
      <b-card>

          <div class="float-right">
            <span class="mr-3">Zwischensumme: {{quote_coaching}}€</span>
            <b-button variant="success">Weiter</b-button>
          </div>
      </b-card>
  </div>

    <div class="float-right mt-3 h4">
      Unverbindliche Einschätzung:<br><b>{{quote}}€</b><i>*</i> mit <b>{{duration}} Tagen</b><i>*</i> Umsetzungszeit<br>
      bei 8<i>**</i> Stunden / Werktag.
    </div>
</div>
</template>
<script>
module.exports = {
    data: () => ({
        currenttab: "erfassung",
        pflichten_lastenheft: true,
        pflichten_lastenheft_umfang: 2,
        gui_planung: false,
        gui_planung_umfang: 1,
        vorstellung_planung: false,
        employee_interviews_planung: false,
        employee_interviews_umfang: 1,
        contract_planung: true,
        leiterplatten_hardware: false,
        case_hardware: false,
        prototyp_hardware: false,
        selected: null,
        erfassungS: 'telefon', 
        erfassungO: [
          { value: 'telefon', text: 'Kostenfreie telefonische Konzepterfassung' },
          { value: 'anfahrt', text: 'Persönliche Beratung innerhalb Essens' },
        ],
        hardware_components: [
          { value: 'wifi', text: 'WiFi' },
          { value: 'bluetooth', text: 'Bluetooth/BLE' },
          { value: 'nfc', text: 'NFC' },
          { value: 'zigbee', text: 'Zigbee' },
          { value: 'infrared', text: 'Infrared' },
          { value: 'battery', text: 'Battery / Charge circuit' },
          { value: 'leds', text: 'Colored Led Animation' },
          { value: 'touch_buttons', text: 'Touch buttons' },
          { value: 'display', text: 'Low Res Display' },
          { value: 'sensors', text: 'Additional Sensors' },
        ],
        hardware_components_selected: [],
        firmware_components: [
          { value: 'network_stack', text: 'Network stack' },
          { value: 'automatic_update', text: 'Automatic update' },
          { value: 'display_driver', text: 'Display driver' },
        ],
        firmware_components_selected: [],
        contracts_selected: [],
        contracts: [
          { value: 'contract_beschaffung', text: 'IT Beschaffung / Software Installation' },
          { value: 'contract_software', text: 'Software / Device Entwicklung' },
        ],
        items: [
          {
            text: 'Planung',
            href: '#',
            tab: "planung"
          }, {
            text: 'Software',
            href: '#',
            tab: "software"
          }, {
            text: 'Hardware',
            href: '#',
            tab: "hardware"
          }, {
            text: 'IT Beschaffung',
            href: '#',
            tab: "beschaffung"
          }, {
            text: 'Einrichtung',
            href: '#',
            tab: "setup"
          }, {
            text: 'Schulung',
            href: '#',
            tab: "coaching"
          }
        ]
    }),
     computed: {
        quote_planung: function() {
          var s = 0;
          if (this.vorstellung_planung) s += 200;
          if (this.pflichten_lastenheft) s += Math.round(Math.sqrt(this.pflichten_lastenheft_umfang)*100);
          if (this.gui_planung) s += Math.round(this.gui_planung_umfang*30);
          if (this.employee_interviews_planung) s += Math.round(this.employee_interviews_umfang*50);
          if (this.contracts_selected.includes("contract_beschaffung")) s += 30;
          if (this.contracts_selected.includes("contract_software")) s += 100;
          return s;
        },
        quote_software: function() {
          var s = 0;
          return s;
        },
        quote_hardware: function() {
          var s = 0;
          if (this.leiterplatten_hardware) s += 500;
          if (this.case_hardware) s += 500;
          if (this.prototyp_hardware) s += 500;
          s += Math.round(this.hardware_components_selected.length*70);
          return s;
        },
        quote_beschaffung: function() {
          var s = 0;
          return s;
        },
        quote_setup: function() {
          var s = 0;
          return s;
        },
        quote_coaching: function() {
          var s = 0;
          return s;
        },
        duration_planung: function() {
          var s = 0;
          if (this.vorstellung_planung) s += 16;
          if (this.pflichten_lastenheft) s += this.pflichten_lastenheft_umfang*1;
          if (this.gui_planung) s += this.gui_planung_umfang*1;
          if (this.employee_interviews_planung) s += this.employee_interviews_umfang*1.5;
          if (this.contracts_selected.includes("contract_beschaffung")) s += 2;
          if (this.contracts_selected.includes("contract_software")) s += 6;
          return s;
        },
        duration_software: function() {
          var s = 0;
          return s;
        },
        duration_hardware: function() {
          var s = 0;
          if (this.leiterplatten_hardware) s += 5*8;
          if (this.case_hardware) s += 3*8;
          if (this.prototyp_hardware) s += 3*8;
          s += Math.round(this.hardware_components_selected.length*4);
          return s;
        },
        duration_beschaffung: function() {
          var s = 0;
          return s;
        },
        duration_setup: function() {
          var s = 0;
          return s;
        },
        duration_coaching: function() {
          var s = 0;
          return s;
        },
        valid_planung: function() {
          return this.contracts_selected.length > 0
        },
        quote: function() {
          return this.quote_planung + this.quote_software +this.quote_hardware +this.quote_beschaffung +this.quote_setup +this.quote_coaching
        },
        duration: function() {
          return Math.round((this.duration_planung+ this.duration_software +this.duration_hardware +this.duration_beschaffung +this.duration_setup +this.duration_coaching )/ 8)+1;
        }
     },
     methods: {
       clickTab: function(item) {
         console.log("tab",item);
         this.currenttab = item;
       }
     }
}
</script>
<style>

.breadcrumb-item+.breadcrumb-item::before {
  content: none;
}
.breadcrumb-item+.breadcrumb-item {
  padding-left: 0;
}

.breadcrumb-arrow {
    min-height: 36px;
    line-height: 36px;
    list-style: none;
    overflow: auto;
    display: block;
    background: none;
    padding: 0;
}

.breadcrumb-arrow li a,
.breadcrumb-arrow li span {
    position: relative;
    color: #fff;
    text-decoration: none;
    background-color: #79a741ff;
    border: 1px solid #79a741ff;
    transition: all 0.3s;

    height: 36px;
    padding: 0 10px 0 25px;
    line-height: 36px;
}

.breadcrumb-arrow li:first-child a,
.breadcrumb-arrow li:first-child span  {
    border-radius: 4px 0 0 4px;
    border-left: 1px solid #79a741ff;
}

.breadcrumb-arrow li:last-child a,
.breadcrumb-arrow li:last-child span {
    border-radius: 0 4px 4px 0;
    border-right: 1px solid #79a741ff;
}


.breadcrumb-arrow li,
.breadcrumb-arrow li a,
.breadcrumb-arrow li span {
    display: inline-block;
    /*vertical-align: top;*/
}

.breadcrumb-arrow li+li:before {
    padding: 0;
    content: "";
}

.breadcrumb-arrow li:first-child a,
.breadcrumb-arrow li:first-child span {
    padding: 0 10px;
    padding-left: 10px;
    margin-right: -5px;
}

.breadcrumb-arrow li:not(:last-child) a:after,
.breadcrumb-arrow li:not(:last-child) a:before,
.breadcrumb-arrow li:not(:last-child) span:after,
.breadcrumb-arrow li:not(:last-child) span:before {
    position: absolute;
    top: -1px;
    width: 0;
    height: 0;
    content: '';
    border-top: 18px solid transparent;
    border-bottom: 18px solid transparent;
    transition: border 0.3s;
}

.breadcrumb-arrow li:not(:last-child) a:before,
.breadcrumb-arrow li:not(:last-child) span:before {
    right: -10px;
    z-index: 3;
    border-left-color: #79a741ff;
    border-left-style: solid;
    border-left-width: 10px;
}

.breadcrumb-arrow li:not(:last-child) a:after,
.breadcrumb-arrow li:not(:last-child) span:after {
    right: -11px;
    z-index: 2;
    border-left: 11px solid #fff;
}

.breadcrumb-arrow li a:focus,
.breadcrumb-arrow li a:hover {
    background-color: rgb(87, 121, 47);
    border: 1px solid rgb(87, 121, 47);
}

.breadcrumb-arrow li a:focus:before,
.breadcrumb-arrow li a:hover:before {
    border-left-color: rgb(87, 121, 47);
}

.breadcrumb-arrow li a:active {
    background-color: rgb(87, 121, 47);
    border: 1px solid rgb(87, 121, 47);
}

.breadcrumb-arrow li a:active:after,
.breadcrumb-arrow li a:active:before {
    border-left-color: rgb(87, 121, 47)
}

/*active*/

.breadcrumb-arrow li.active a,
.breadcrumb-arrow li.active span {
    background-color: #40474e;
    border: 1px solid #40474e;
}

.breadcrumb-arrow li.active a:before,
.breadcrumb-arrow li.active span:before {
    border-left-color: #40474e;
}

.alert {
  border-radius: 0;
  box-shadow: 0 1px 2px rgba(0,0,0,0.11);
  display: table;
  background-image: linear-gradient(to bottom, #fff, #d9edf7);
  padding-left: 61px;
  position: relative;
  border-color: #98cce6;
  color: #3a87ad;
  border-radius: 3px;
}

.alert-white .icon {
  border-radius: 3px 0 0 3px;
  text-align: center;
  width: 45px;
  height: 100%;
  position: absolute;
  top: 0;
  left: 0;
  border: 1px solid #3a8ace;
  padding-top: 15px;
  background: #4d90fd;
}

.alert-white .icon:after {
  transform: rotate(45deg);
  display: block;
  content: '';
  width: 10px;
  height: 10px;
  border: 1px solid #3a8ace;
  position: absolute;
  border-left: 0;
  border-bottom: 0;
  top: 50%;
  right: -6px;
  margin-top: -3px;
  background: #4d90fd;
}

.alert-white .icon i {
  font-size: 20px;
  color: #fff;
  left: 12px;
  margin-top: -10px;
  position: absolute;
  top: 50%;
}

.alert-success {
  color: #3c763d;
  background-image: linear-gradient(to bottom, #fff, #dff0d8);
  border-color: #d6e9c6;
}

.alert-white.alert-success .icon, 
.alert-white.alert-success .icon:after {
  border-color: #54a754;
  background: #79a741ff;
}

.alert-info {
  background-image: linear-gradient(to bottom, #fff, #d9edf7);
  border-color: #98cce6;
  color: #3a87ad;
}

.alert-white.alert-info .icon, 
.alert-white.alert-info .icon:after {
  border-color: #3a8ace;
  background: #4d90fd;
}


.alert-white.alert-warning .icon, 
.alert-white.alert-warning .icon:after {
  border-color: #d68000;
  background: #fc9700;
}

.alert-warning {
  background-image: linear-gradient(to bottom, #fff, #fcf8e3);
  border-color: #f1daab;
  color: #c09853;
}

.alert-danger {
  background-image: linear-gradient(to bottom, #fff, #f2dede);
  border-color: #e0b1b8;
  color: #b94a48;
}

.alert-white.alert-danger .icon, 
.alert-white.alert-danger .icon:after {
  border-color: #ca452e;
  background: #da4932;
}

</style>