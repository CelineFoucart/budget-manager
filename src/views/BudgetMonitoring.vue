<template>
    <article>
        <header class="mb-2 d-print-none">
            <div class="row align-items-center mb-3">
                <div class="col-md-6 col-lg-8">
                    <h1 class="display-5 text-gray">Suivi de trésorerie</h1>
                </div>
                <div class="col-md-6 col-lg-4 text-end">
                    
                </div>
                <div class="col-12 pt-2">
                    <p>
                        Sur cette page, les recettes et les dépenses sont affichées, mois par mois.
                        Cliquer sur le bouton à droite pour en ajouter une.
                    </p>
                    <ul>
                        <li>
                            <span>Sur l'onglet tableau, les lignes en gris sont des montants déclarés comme passés en banque.</span>
                        </li>
                        <li>
                            <span>Sur l'onglet graphique figure les statistiques du mois.</span>
                        </li>
                    </ul>
                </div>
            </div>

            <div class="d-flex gap-2 justify-content-end">
                <button v-tooltip="'Mois précédent'" @click="previousMonth" class="btn-sm btn btn-primary">
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-chevron-left" viewBox="0 0 16 16">
                        <path fill-rule="evenodd" d="M11.354 1.646a.5.5 0 0 1 0 .708L5.707 8l5.647 5.646a.5.5 0 0 1-.708.708l-6-6a.5.5 0 0 1 0-.708l6-6a.5.5 0 0 1 .708 0"/>
                    </svg>
                </button>
                <div class="w-25">
                    <VueDatePicker
                        v-model="date"
                        locale="fr"
                        :enable-time-picker="false"
                        auto-apply
                        :clearable="false"
                        month-picker
                        required
                    />
                </div>
                <button v-tooltip="'Mois suivant'" @click="nextMonth" class="btn-sm btn btn-primary">
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-chevron-right" viewBox="0 0 16 16">
                        <path fill-rule="evenodd" d="M4.646 1.646a.5.5 0 0 1 .708 0l6 6a.5.5 0 0 1 0 .708l-6 6a.5.5 0 0 1-.708-.708L10.293 8 4.646 2.354a.5.5 0 0 1 0-.708"/>
                    </svg>
                </button>
            </div>
        </header>

        <section class="card shadow-sm">
            <header class="card-header py-2">
                <div class="row">
                    <div class="col-8">
                        <h2 class="m-0 text-capitalize font-weight-bold text-primary h4">
                            {{ currentMonth }}
                        </h2>
                    </div>
                    <div class="col-4 text-end">
                        <div class="btn-group d-print-none">
                            <button @click="openTableCard" class="btn btn-sm pb-2" :class="{'btn-primary': showTable, 'btn-outline-primary': showStats}" v-tooltip="'Tableau'">
                                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-table" viewBox="0 0 16 16">
                                    <path d="M0 2a2 2 0 0 1 2-2h12a2 2 0 0 1 2 2v12a2 2 0 0 1-2 2H2a2 2 0 0 1-2-2zm15 2h-4v3h4zm0 4h-4v3h4zm0 4h-4v3h3a1 1 0 0 0 1-1zm-5 3v-3H6v3zm-5 0v-3H1v2a1 1 0 0 0 1 1zm-4-4h4V8H1zm0-4h4V4H1zm5-3v3h4V4zm4 4H6v3h4z"/>
                                </svg>
                            </button>
                            <button @click="openStatsCard" class="btn btn-sm pb-2" :class="{'btn-primary': showStats, 'btn-outline-primary': showTable}" v-tooltip="'Statistiques'">
                                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-pie-chart-fill" viewBox="0 0 16 16">
                                    <path d="M15.985 8.5H8.207l-5.5 5.5a8 8 0 0 0 13.277-5.5zM2 13.292A8 8 0 0 1 7.5.015v7.778zM8.5.015V7.5h7.485A8 8 0 0 0 8.5.015"/>
                                </svg>
                            </button>
                        </div>
                    </div>
                </div>
            </header>
            <div class="card-body">
                <div v-if="showTable === true">
                    <div class="row mb-2 align-items-center d-print-none">
                        <div class="col-6">
                            <button class="btn btn-primary text-nowrap" @click="onAppend">
                                Ajouter
                            </button>
                        </div>
                        <div class="col-6 d-flex gap-2">
                            <div class="input-group">
                                <div class="input-group-text">
                                    <label for="search">
                                        Recherche
                                    </label>
                                </div>
                                <input type="text" class="form-control" v-model="query" id="search">
                            </div>
                        </div>
                    </div>
                    <table class="table table-bordered">
                        <thead>
                            <tr>
                                <th class="text-gray">Date</th>
                                <th class="text-gray">Libellé</th>
                                <th class="text-gray">Catégorie</th>
                                <th class="text-gray">Débit</th>
                                <th class="text-gray">Crédit</th>
                                <th class="text-gray">Solde</th>
                                <th class="text-gray">Vérifié</th>
                                <th class="text-gray d-print-none">Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr class="fw-bold bg-sold">
                                <td>{{ firstDay }}</td>
                                <td colspan="4">Solde au début du mois</td>
                                <td class="text-end">{{ currencyFormat(recordStore.startingSold.total) }}</td>
                                <td></td>
                                <td class="d-print-none"></td>
                            </tr>
                            <tr :class="{'isPassed': record.isPassed === true}" v-for="record in records" :key="record._id">
                                <td>{{ formatDateTime(record.date) }}</td>
                                <td>{{ record.title }}</td>
                                <td>
                                    <span v-if="recordStore.categories[record.category]">
                                        {{ recordStore.categories[record.category].name }}
                                    </span>
                                </td>
                                <td class="text-end">
                                    <span class="text-danger" v-if="record.amount <= 0">
                                        {{ currencyFormat(record.amount) }}
                                    </span>
                                </td>
                                <td class="text-end">
                                    <span class="text-success" v-if="record.amount > 0">
                                        {{ currencyFormat(record.amount) }}
                                    </span>
                                </td>
                                <td class="text-end">{{currencyFormat(record.sold) }}</td>
                                <td>
                                    <span class="badge bg-success" v-if="record.isChecked === true">Oui</span>
                                    <span class="badge bg-danger" v-if="record.isChecked === false">Non</span>
                                </td>
                                <td class="d-print-none">
                                    <div class="btn-group">
                                        <button class="btn btn-primary btn-sm pb-2" v-tooltip="'Dupliquer'" @click="onAppend(record)">
                                            <svg xmlns="http://www.w3.org/2000/svg" width="15" height="15" fill="currentColor" class="bi bi-clipboard-fill" viewBox="0 0 16 16">
                                                <path fill-rule="evenodd" d="M10 1.5a.5.5 0 0 0-.5-.5h-3a.5.5 0 0 0-.5.5v1a.5.5 0 0 0 .5.5h3a.5.5 0 0 0 .5-.5zm-5 0A1.5 1.5 0 0 1 6.5 0h3A1.5 1.5 0 0 1 11 1.5v1A1.5 1.5 0 0 1 9.5 4h-3A1.5 1.5 0 0 1 5 2.5zm-2 0h1v1A2.5 2.5 0 0 0 6.5 5h3A2.5 2.5 0 0 0 12 2.5v-1h1a2 2 0 0 1 2 2V14a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V3.5a2 2 0 0 1 2-2"/>
                                            </svg>
                                        </button>
                                        <button class="btn btn-primary btn-sm pb-2" v-tooltip="'Editer'" @click="onEdit(record)">
                                            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-pencil-fill" viewBox="0 0 16 16">
                                                <path d="M12.854.146a.5.5 0 0 0-.707 0L10.5 1.793 14.207 5.5l1.647-1.646a.5.5 0 0 0 0-.708zm.646 6.061L9.793 2.5 3.293 9H3.5a.5.5 0 0 1 .5.5v.5h.5a.5.5 0 0 1 .5.5v.5h.5a.5.5 0 0 1 .5.5v.5h.5a.5.5 0 0 1 .5.5v.207zm-7.468 7.468A.5.5 0 0 1 6 13.5V13h-.5a.5.5 0 0 1-.5-.5V12h-.5a.5.5 0 0 1-.5-.5V11h-.5a.5.5 0 0 1-.5-.5V10h-.5a.5.5 0 0 1-.175-.032l-.179.178a.5.5 0 0 0-.11.168l-2 5a.5.5 0 0 0 .65.65l5-2a.5.5 0 0 0 .168-.11z"/>
                                            </svg>
                                        </button>
                                        <button class="btn btn-danger btn-sm pb-2" v-tooltip="'Supprimer'" @click="onDelete(record)">
                                            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-trash-fill" viewBox="0 0 16 16">
                                                <path d="M2.5 1a1 1 0 0 0-1 1v1a1 1 0 0 0 1 1H3v9a2 2 0 0 0 2 2h6a2 2 0 0 0 2-2V4h.5a1 1 0 0 0 1-1V2a1 1 0 0 0-1-1H10a1 1 0 0 0-1-1H7a1 1 0 0 0-1 1zm3 4a.5.5 0 0 1 .5.5v7a.5.5 0 0 1-1 0v-7a.5.5 0 0 1 .5-.5M8 5a.5.5 0 0 1 .5.5v7a.5.5 0 0 1-1 0v-7A.5.5 0 0 1 8 5m3 .5v7a.5.5 0 0 1-1 0v-7a.5.5 0 0 1 1 0"/>
                                            </svg>
                                        </button>
                                    </div>
                                </td>
                            </tr>
                        </tbody>
                    </table>
                    <div class="row align-items-center">
                        <div class="col-7">
                            <p class="mb-0">
                                Affichage de 
                                <span v-if="records.length < recordStore.records.length"><strong>{{ records.length }}</strong> sur </span>
                                <strong>{{ recordStore.records.length }}</strong>
                                élément{{ recordStore.records.length > 1 ? 's' : '' }}
                            </p>
                        </div>
                        <div class="col-5 fs-5">
                            <div class="bg-light border p-1">
                                <strong class="border-end pe-1">Solde en banque</strong>
                                {{ currencyFormat(recordStore.inBankSold) }}
                            </div>
                        </div>
                    </div>
                    
                </div>
                <StatsBlock :currentDate="date" v-if="showStats === true"></StatsBlock>
            </div>
            <footer class="card-footer d-print-none text-end" v-if="showTable === true">
                <button class="btn btn-primary" @click="exportToPdf">
                    Exporter en PDF
                </button>
            </footer>
        </section>

        <AddAction :data="dataToHandle" :currentDate="date" @on-refresh="getRecords" @on-close="openEditModal = false" v-if="openEditModal">
        </AddAction>
        <Delete 
            :title="dataToHandle.title" 
            :loading="loading" 
            @on-close="openDeleteModal = false" 
            @on-confirm="performDelete"
            v-if="openDeleteModal">
        </Delete>
    </article>
</template>

<script>
import VueDatePicker from '@vuepic/vue-datepicker'
import '@vuepic/vue-datepicker/dist/main.css'
import { fr } from 'date-fns/locale'
import dayjs from 'dayjs'
import 'dayjs/locale/fr'
import { useRecordStore } from "../stores/record.js";
import { mapStores } from 'pinia';
import { createToastify } from '@/helper/toastify.js'
import AddAction from '@/components/AddAction.vue';
import Delete from '@/helper/Delete.vue';
import StatsBlock from "@/components/StatsBlock.vue";

export default {
    name: 'BudgetMonitoring',

    components: {
        VueDatePicker,
        AddAction,
        Delete,
        StatsBlock
    },

    data() {
        return {
            date: {
                month: new Date().getMonth(),
                year: new Date().getFullYear()
            },
            query: null,
            fr: fr,
            dataToHandle: { title: '', date: null, category: null, amount: 0, isPassed: false, isChecked: false },
            openEditModal: false,
            openDeleteModal: false,
            loading: false,
            showTable: true,
            showStats: false
        }
    },

    computed: {
        ...mapStores(useRecordStore),

        currentMonth() {
            const date = new Date(this.date.year, this.date.month, 1)
            return dayjs(date).locale('fr').format('MMMM YYYY');
        },

        firstDay() {
            const date = new Date(this.date.year, this.date.month, 1);
            
            return dayjs(date).locale('fr').format('DD/MM/YYYY');
        },

        records() {
            const records = [];

            this.recordStore.records.forEach(record => {
                if (this.query === null || this.query.length === 0) {
                    records.push(record);
                } else {
                    let value = (record.title) + record.amount;
                    if (this.recordStore.categories[record.category]) {
                        value += this.recordStore.categories[record.category].name;
                    }

                    if (value.toLowerCase().indexOf(this.query.toLowerCase()) != -1) {
                        records.push(record);
                    }
                }
            });

            return records;
        }
    },

    watch: {
        async date() {
            await this.getRecords();
        }
    },

    async mounted () {
        const statusCategory = await this.recordStore.getCategories();
        if (!statusCategory) {
            createToastify('Le chargement des catégories a échoué', 'error');
        }

        await this.getRecords();
    },

    methods: {
        async getRecords() {
            const date = new Date(this.date.year, this.date.month, 1);
            const minDate = dayjs(date).startOf('month').format('YYYY-MM-DD');
            const maxDate = dayjs(date).endOf('month').format('YYYY-MM-DD');

            await this.recordStore.getStartingSold(minDate);

            const status = await this.recordStore.getRecords(minDate, maxDate);
            if (status === false) {
                createToastify('Le chargement du registre a échoué', 'error');
            }
        },

        formatDateTime(value) {
            return dayjs(value).format('DD/MM/YYYY')
        },

        currencyFormat(amount) {
            const euroFormat = new Intl.NumberFormat('fr-FR', { style: 'currency', currency: 'EUR' });

            return euroFormat.format(amount);
        },

        openTableCard() {
            this.showTable = true;
            this.showStats = false;
        },

        openStatsCard() {
            this.showTable = false;
            this.showStats = true;
        },

        onAppend(record = null) {
            if (record === null) {
                this.dataToHandle = { _id: null, title: '', date: null, category: null, amount: 0, isPassed: false, isChecked: false };
            } else {
                this.dataToHandle = { 
                    _id: null, 
                    title: record.title, 
                    date: record.date, 
                    category: record.category, 
                    amount: parseFloat(record.amount), 
                    isPassed: false, 
                    isChecked: false 
                };
            }
            this.openEditModal = true;
        },

        onEdit(record) {
            this.dataToHandle = record;
            this.openEditModal = true;
        },

        onDelete(record) {
            this.dataToHandle = record;
            this.openDeleteModal = true;
        },

        previousMonth() {
            const date = dayjs(new Date(this.date.year, this.date.month, 1)).subtract(1, 'month');
            const converted = date.toDate();
            this.date = {
                month: converted.getMonth(),
                year: converted.getFullYear()
            }
        },
        
        nextMonth() {
            const date = dayjs(new Date(this.date.year, this.date.month, 1)).add(1, 'month');
            const converted = date.toDate();
            this.date = {
                month: converted.getMonth(),
                year: converted.getFullYear()
            }
        },

        async performDelete() {
            this.loading = true;
            
            const status = this.recordStore.removeRecord(this.dataToHandle._id);
            if (status) {
                createToastify("L'élément a été supprimé", 'success');
                await this.getRecords();
            }  else {
                createToastify("L'opération a échoué", 'error');
            }
            
            this.loading = false;
            this.openDeleteModal = false;
            this.dataToHandle = { _id: null, title: '', date: null, category: null, amount: 0, isPassed: false, isChecked: false };
        },

        exportToPdf() {
            const date = new Date(this.date.year, this.date.month, 1);
            const suffix = this.showTable ? '-table' : '-chart';
            const filename = 'export-' + dayjs(date).format('YYYY-MM') + '-'+ dayjs().format('YYYY-MM-DD') + suffix;
            window.frame.exportToPdf(filename)
        }
    },
}
</script>

<style>
.isPassed > td {
    background-color: #f8f9fa;
}

.bg-sold td {
    background-color: #7f9ffd29;
}
</style>