<template>
  <v-app id="inspire">
    <v-main>
      <v-container class="fill-height" fluid>
        <v-row align="center" justify="center">
          <v-col cols="12" sm="8" md="4">
            <v-card class="elevation-12">
              <v-toolbar color="primary" dark flat>
                <v-toolbar-title>Crear Proyecto</v-toolbar-title>
                <v-spacer></v-spacer>
              </v-toolbar>
              <v-card-text>
                <v-form>

                  <v-text-field v-model="project.name" label="Nombre del proyecto" name="name" type="text"></v-text-field>
                  <label>Sistema Objetivo</label>
                  <v-row align="center" justify="center">
                    <v-col cols="4">
                      <label>Fuente de datos</label>
                    </v-col>
                    <v-col cols="4">
                      <input type="radio" id="csv" name="csv" v-model="project.fuente" value="CSV" />
                      <label for="CSV">CSV</label>
                      <br />
                    </v-col>
                    <v-col cols="4">
                      <input
                        type="radio"
                        id="oracle"
                        name="oracle"
                        v-model="project.fuente"
                        value="Oracle" v-on:input="loadPlanVersionOracle"
                      />
                      <label for="oracle">Oracle</label>
                    </v-col>
                  </v-row>
                  <v-row justify="center" v-if="project.fuente=='CSV'">
                    <v-col cols="12">
                      <label>Cargar Datagramas</label>
                    </v-col>
                    <v-col cols="6">
                      <v-btn color="primary" @click="showUpload = true; showSelect= false;">Por archivo</v-btn>
                      <v-row align="center" v-if="showUpload">
                        <v-col cols="6">
                          <label>Separador</label>
                        </v-col>
                        <v-col cols="6">
                          <v-text-field v-model="separator"></v-text-field>
                        </v-col>
                      </v-row>
                      <UploadFiles v-if="showUpload"></UploadFiles>
                    </v-col>
                    <v-col cols="6">
                      <v-btn
                        color="primary"
                        @click="showUpload = false; showSelect= true;"
                      >En servidor</v-btn>
                      <v-row v-if="showSelect" align="center">
                        <v-col cols="6">
                          <label>Separador</label>
                        </v-col>
                        <v-col cols="6">
                          <v-text-field v-model="separator"></v-text-field>
                        </v-col>
                      </v-row>
                      <v-select v-if="showSelect" @change="loadPlanVersionsCSV" v-model="archiveSelected" :items="filesOnServer" label="Seleccionar Archivo"></v-select>
                    </v-col>
                  </v-row>
                </v-form>
                <!-- <v-row>
                  <v-col cols="12" align="center" justify="center" v-if="archiveSelected!='' || project.fuente=='Oracle'">
                    <v-select :items="planversionID" label="PlanVersion ID" v-model="planVersionSelected" item-text="planVersionId"  @change="loadDatesByPlanVersion"></v-select>
                  </v-col>
                </v-row> -->
                <v-row>
                  <v-col cols="6" align="center" justify="center">
                    <v-menu
                      ref="menu"
                      v-model="initialMenu"
                      :close-on-content-click="false"
                      :return-value.sync="initialMenu"
                      transition="scale-transition"
                      offset-y
                      min-width="290px"
                    >
                      <template v-slot:activator="{ on, attrs }">
                        <v-text-field
                          v-model="initialDate"
                          label="Fecha inicial"
                          readonly
                          v-bind="attrs"
                          v-on="on"
                        ></v-text-field>
                      </template>
                      <v-date-picker v-model="initialDate" no-title scrollable>
                        <v-spacer></v-spacer>
                        <v-btn text color="primary" @click="initialMenu = false">Cancelar</v-btn>
                        <v-btn text color="primary" @click="$refs.initialMenu.save(initialDate)">Aceptar</v-btn>
                      </v-date-picker>
                    </v-menu>
                  </v-col>
                  <v-col cols="6" align="center" justify="center">
                    <v-menu
                      ref="menu"
                      v-model="finalMenu"
                      :close-on-content-click="false"
                      :return-value.sync="initialDate"
                      transition="scale-transition"
                      offset-y
                      min-width="290px"
                    >
                      <template v-slot:activator="{ on, attrs }">
                        <v-text-field
                          v-model="finalDate"
                          label="Fecha final"
                          readonly
                          v-bind="attrs"
                          v-on="on"
                        ></v-text-field>
                      </template>
                      <v-date-picker v-model="finalDate" no-title scrollable>
                        <v-spacer></v-spacer>
                        <v-btn text color="primary" @click="finalMenu = false">Cancelar</v-btn>
                        <v-btn text color="primary" @click="$refs.finalMenu.save(finalDate)">Aceptar</v-btn>
                      </v-date-picker>
                    </v-menu>
                  </v-col>
                </v-row>
                <v-row justify="space-around" align="center">
                  <v-col cols="6" align="center" justify="center">
                    <v-time-picker v-model="InitialTimePicker" full-width scrollable class="ml-3"></v-time-picker>
                  </v-col>
                  <v-col cols="6" align="center" justify="center">
                    <v-time-picker v-model="FinalTimePicker" full-width scrollable class="ml-3"></v-time-picker>
                  </v-col>
                </v-row>
                <v-row align="center" justify="center">
                  <v-col align="center" cols="12" md="6" sm="6">
                    <div class="my-3">
                      <v-btn color="primary" router  @click="saveProject"  >Crear Proyecto</v-btn>
                    </div>
                    <div class="my-3">
                      <v-btn color="primary" router :to="{path:'/'}">Volver</v-btn>
                    </div>
                  </v-col>
                </v-row>
              </v-card-text>
            </v-card>
          </v-col>
        </v-row>
      </v-container>
    </v-main>
  </v-app>
</template>

<script>
import UploadFiles from "../UploadFile/UploadFile";
export default {
  data: () => ({
    project: {
      name: "",
      fuente: 0,
    },
    planversionID: [],
    filesOnServer: [],
    initialDate: "",
    finalDate: "",
    initialMenu: false,
    finalMenu: false,
    InitialTimePicker: null,
    FinalTimePicker: null,
    showUpload: false,
    showSelect: false,
    archiveSelected: "",
    planVersionSelected: null,
    separator: null
  }),
  components: {
    UploadFiles,
  },
  mounted: function () {
    if(this.$store.getters['projects/getAllFileNames'].length==0){
      this.$store.dispatch('projects/loadAllFilesNames')
    }else{
      this.filesOnServer=this.$store.getters['projects/getAllFileNames']
    }
    this.$store.dispatch('projects/loadAllFilesNames');
    this.$store.subscribe( (mutation, state) => {
      if (mutation.type === 'projects/setFilesNameStates') {
        this.filesOnServer=this.$store.getters['projects/getAllFileNames']
      }
      if (mutation.type === 'projects/setPlanVersions') {
        this.planversionID=this.$store.getters['projects/getAllPlanVersions']
      }
      if( mutation.type === 'projects/setInitialDate'){

        this.initialDate= this.$store.getters['projects/getInitialDate']
      }
      if( mutation.type === 'projects/setFinalDate'){
        this.finalDate= this.$store.getters['projects/getLastDate']
      }
      if( mutation.type === 'projects/setPlanversionSeleted'){
        this.$router.push({
            path: `/variables/${this.project.name}`,
            query: { planversion: this.$store.getters['projects/getPlanversionSeleted'], type: this.$store.getters['projects/getTypeSelected'] }
        });
      }
    })
  },
  methods: {
    createProject: function (event) {},
    loadPlanVersionsCSV: function (event) {
      let payload= {type:"FileCSV"}
      this.$store.dispatch('projects/loadPlanVersions',payload)
    },
    loadPlanVersionOracle: function(event){
      let payload= {type:"DataBase"}
      this.$store.dispatch('projects/loadPlanVersions',payload)
    },
    loadDatesByPlanVersion: function(event){
      let typeDB= "";
      if(this.project.fuente=== "CSV"){
        typeDB= "FileCSV"
      }else if(this.project.fuente=== "Oracle"){
        typeDB= "DataBase"
      }
      let payload= {
        type:typeDB,
        planVersionId: this.planVersionSelected
      }
      this.$store.dispatch('projects/loadDatesByPlanversion',payload)
    },
    saveProject: function(){
      let payload={
        name: this.project.name,
        initialDate: this.initialDate+" "+this.InitialTimePicker+":00",
        finalDate: this.finalDate+" "+this.FinalTimePicker+":00",
        // planVersionId: this.planVersionSelected,
        fileType: "",
        fileName: this.archiveSelected,
        fileSplit: this.separator
      }
      console.log(payload.finalDate)
      console.log(payload.initialDate)

      this.$store.commit('projects/setProjectNameSeleted', this.project.name)
      // this.$store.commit('projects/setPlanversionSeleted', this.planVersionSelected)

      if(this.project.fuente=== "CSV"){
        payload.fileType= "FileCSV"
        this.$store.commit('projects/setTypeSelected',payload.fileType)
        this.$store.dispatch('projects/createProjectCSV',payload)
      }else if(this.project.fuente=== "Oracle"){
        payload.fileType= "DataBase"
        this.$store.commit('projects/setTypeSelected',payload.fileType)
        this.$store.dispatch('projects/createProjectOracle',payload)
      }
    },
  },
};
</script>

<style>
</style>
