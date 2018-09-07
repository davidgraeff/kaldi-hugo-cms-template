<template>
<div>  
    <ol class="breadcrumb-arrow">
        <li v-for="item of $options.items" :key="item.tab" :class="{active: currenttab==item.tab }">
          <a href="#" v-html="item.text" @click.stop.prevent="clickTab(item.tab)">
          </a>
        </li>
    </ol>

  <div v-for="el in ['erfassung']" v-show="currenttab==el" :key="el">
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
            <b-button variant="success" @click="goNext()">Weiter</b-button>
          </div>
      </b-card>
  </div>

  <div v-for="el in ['planung']" v-show="currenttab==el" :key="el">
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
            <b-button variant="success" @click="goNext()">Weiter</b-button>
          </div>
      </b-card>
  </div>

  <div v-for="el in ['software']" v-show="currenttab==el" :key="el">
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
            <b-button variant="success" @click="goNext()">Weiter</b-button>
          </div>
      </b-card>
  </div>

  <div v-for="el in ['hardware']" v-show="currenttab==el" :key="el">
      <div class="alert alert-white alert-success my-3 w-100">
      <div class="icon"> <i class="fas fa-info-circle"></i> </div>
       Beschreiben Sie das zu entwickelnde Kleingerät.
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


          <div class="float-right">
            <span class="mr-3">Zwischensumme: {{quote_hardware}}€</span>
            <b-button variant="success" @click="goNext()">Weiter</b-button>
          </div>
      </b-card>
  </div>

  <div v-for="el in ['beschaffung']" v-show="currenttab==el" :key="el">
      <div class="alert alert-white alert-success my-3 w-100">
      <div class="icon"> <i class="fas fa-info-circle"></i> </div>
      Geben Sie an ob Workstation PCs oder Server aktualisiert oder beschafft werden müssen.
      Die Aufstellung der beschafften Hardware ist selbstverständlich. Bitte verhandeln Sie die
      Einrichtung von Hardware separat mit uns.
      </div>
      <b-card>

      <div class="alert alert-white alert-info my-3 w-100">
      <div class="icon"> <i class="fas fa-info-circle"></i> </div>
      Aus Qualitäts- und Zuverlässigkeitsgründen empfehlen wir unseren Partner für Hardware Einkäufe. Zusätzlich suchen wir aber immer zwei weitere gfs. günstigere oder
      lokal nähere Angebote für Sie heraus.
      </div>

        <b-form-checkbox name="pc_beschaffung" button-variant="success" v-model="pc_beschaffung">Workstation PC Beschaffung</b-form-checkbox>
        <p class="pl-4">Die für Ihren Anwendungsfall geeigneten Workstation PCs oder Thin Clients werden herausgesucht, mit Ihnen besprochen und beschafft.</p>
        <b-col sm="9" class="scalezero" v-bind:class="{ scaleenable: pc_beschaffung }">
            <b-input-group prepend="PCs:">
            <b-input-group-text slot="append">
                {{pc_beschaffung_umfang}}
            </b-input-group-text>
            <b-form-input type="range" min="1" max="100" :disabled="!pc_beschaffung" v-model="pc_beschaffung_umfang"></b-form-input>
          </b-input-group>
        </b-col>

<hr>

        <b-form-checkbox name="server_beschaffung" button-variant="success" v-model="server_beschaffung">Server Beschaffung</b-form-checkbox>
        <p class="pl-4">Der Aufstellungsort eines Servers muss Kühlungs-, Brandschutz und Zugriffskriterien erfüllen. Server gibt es in unterschiedlichsten Leistungsabstufungen und eventuell lohnt sich ein Cloud Anbieter stattdessen. Lassen Sie sich beraten.</p>
        <b-col sm="9" class="scalezero" v-bind:class="{ scaleenable: server_beschaffung }">
            <b-input-group prepend="Server:">
            <b-input-group-text slot="append">
                {{server_beschaffung_umfang}}
            </b-input-group-text>
            <b-form-input type="range" min="1" max="3" :disabled="!server_beschaffung" v-model="server_beschaffung_umfang"></b-form-input>
          </b-input-group>
        </b-col>

<hr>

        <b-form-checkbox name="prototyp_hardware" v-model="prototyp_hardware">Zugriffskontrollsystem (</b-form-checkbox>
        <p class="pl-4">Ein vollständiger Hardware Prototyp mit 3D Druck Gehäuse. Ein Prototyp hilft in der Regel enorm um letzte Unstimmigkeiten zu beheben.</p>


          <div class="float-right">
            <span class="mr-3">Zwischensumme: {{quote_beschaffung}}€</span>
            <b-button variant="success" @click="goNext()">Weiter</b-button>
          </div>
      </b-card>
  </div>

  <div v-for="el in ['setup']" v-show="currenttab==el" :key="el">
      <div class="alert alert-white alert-success my-3 w-100">
      <div class="icon"> <i class="fas fa-info-circle"></i> </div>
      Wir richten Ihnen von uns gelieferte Software oder beschaffte Hardware auf Wunsch ein.
      </div>
      <b-card>

          <div class="float-right">
            <span class="mr-3">Zwischensumme: {{quote_setup}}€</span>
            <b-button variant="success" @click="goNext()">Weiter</b-button>
          </div>
      </b-card>
  </div>

  <div v-for="el in ['coaching']" v-show="currenttab==el" :key="el">
      <div class="alert alert-white alert-success my-3 w-100">
      <div class="icon"> <i class="fas fa-info-circle"></i> </div>
      Nutzen Sie unser Schulungsangebot. Ihre Mitarbeiter werden es schätzen von der ersten Minute an mit der gelieferten Software selbstsicher und effizient umgehen zu können.
      </div>
      <b-card>

          <div class="float-right">
            <span class="mr-3">Zwischensumme: {{quote_coaching}}€</span>
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
        currenttab: "",
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
        software_components: [],
        pc_beschaffung: false,
        pc_beschaffung_umfang: 1,
        server_beschaffung: false,
        server_beschaffung_umfang: 1,
        erfassungS: 'telefon', 
        hardware_components_selected: [],
        firmware_components_selected: [],
        contracts_selected: []
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
          if (this.pc_beschaffung) s += Math.round(this.pc_beschaffung_umfang*(80-this.pc_beschaffung_umfang*40/100));
          if (this.server_beschaffung) s += Math.round(this.server_beschaffung_umfang*(300-this.server_beschaffung_umfang*90/3));
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
         console.log("click",item);
         this.currenttab = item;
         history.pushState(null, "", "#"+item);
       },
       changeTab: function() {
        var startTab = this.items.find(e => '#'+e.tab === window.location.hash);
        startTab = (!startTab) ? 'erfassung' : startTab.tab;
         console.log("change",startTab, window.location.hash);
        this.currenttab = startTab;
       },
       goNext: function() {
         var startTabIndex = this.items.findIndex(e => '#'+e.tab === window.location.hash);
         if (startTabIndex==-1) return;
         startTabIndex += 1;
         if (startTabIndex>this.items.length) return;
         this.clickTab(this.items[startTabIndex].tab);
       }
     },
    created: function () {
       this.hardware_components = [
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
        ];
        this.firmware_components = [
          { value: 'network_stack', text: 'Network stack' },
          { value: 'automatic_update', text: 'Automatic update' },
          { value: 'display_driver', text: 'Display driver' },
        ];
        this.erfassungO= [
          { value: 'telefon', text: 'Kostenfreie telefonische Konzepterfassung' },
          { value: 'anfahrt', text: 'Persönliche Beratung innerhalb Essens' },
        ];
        this.contracts = [
          { value: 'contract_beschaffung', text: 'IT Beschaffung / Software Installation' },
          { value: 'contract_software', text: 'Software / Device Entwicklung' },
        ];
      this.changeTab();
      window.addEventListener("popstate", () => this.changeTab(), false);
    }
}
</script>
<style>

</style>