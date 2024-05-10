<template>
    <article>
        <header class="mb-2">
            <div class="row align-items-center mb-3">
                <div class="col-md-6 col-lg-8">
                    <h1 class="display-5 text-gray">Livre de compte</h1>
                </div>
                <div class="col-md-6 col-lg-4 text-end">
                    <button class="btn btn-primary" @click="onAppend">
                        <i class="fa fa-plus fa-fw"></i> Ajouter
                    </button>
                </div>
                <div class="col-12 pt-2">
                    <p>
                        Sur cette page, les recettes et les dépenses sont affichées, mois par mois.
                        Cliquer sur le bouton à droite pour en ajouter une. Les lignes en gris sont des
                        montants déclarés comme passés en banque.
                    </p>
                </div>
            </div>

            <div class="d-flex gap-2 justify-content-end">
                <button @click="previousMonth" class="btn-sm btn btn-primary"><i class="fa fa-chevron-left fa-fw"></i></button>
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
                <button @click="nextMonth" class="btn-sm btn btn-primary"><i class="fa fa-chevron-right fa-fw"></i></button>
            </div>
        </header>

        <section class="card shadow-sm">
            <header class="card-header py-2">
                <h2 class="m-0 text-capitalize font-weight-bold text-primary h4">
                    {{ currentMonth }}
                </h2>
            </header>
            <div class="card-body">
                <table class="table table-bordered">
                    <thead>
                        <tr>
                            <th class="text-gray"><i class="fa fa-calendar fa-fw"></i> Date</th>
                            <th class="text-gray"><i class="fa fa-file fa-fw"></i> Libellé</th>
                            <th class="text-gray"><i class="fa fa-tag fa-fw"></i> Catégorie</th>
                            <th class="text-gray"><i class="fa fa-dollar-sign fa-fw"></i> Débit</th>
                            <th class="text-gray"><i class="fa fa-dollar-sign fa-fw"></i> Crédit</th>
                            <th class="text-gray"><i class="fa fa-dollar-sign fa-fw"></i> Solde</th>
                            <th class="text-gray"><i class="fa fa-check fa-fw"></i> Vérifié</th>
                            <th class="text-gray" data-orderable="false"><i class="fa fa-edit fa-fw"></i> Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr :class="{'isPassed': record.isPassed === true}" v-for="record in recordStore.records" :key="record._id">
                            <td>{{ formatDateTime(record.date) }}</td>
                            <td>{{ record.title }}</td>
                            <td>
                                <span v-if="recordStore.categories[record.category]">
                                    {{ recordStore.categories[record.category].name }}
                                </span>
                            </td>
                            <td>
                                <span class="text-danger" v-if="record.amount <= 0">{{ record.amount }}</span>
                            </td>
                            <td>
                                <span class="text-success" v-if="record.amount > 0">{{ record.amount }}</span>
                            </td>
                            <td></td>
                            <td>
                                <span class="badge bg-success" v-if="record.isChecked === true">Oui</span>
                                <span class="badge bg-danger" v-if="record.isChecked === false">Non</span>
                            </td>
                            <td>
                                <div class="btn-group">
                                    <button class="btn btn-primary btn-sm" title="Editer" @click="onEdit(record)">
                                        <i class="fa-solid fa-pen"></i>
                                    </button>
                                    <button class="btn btn-danger btn-sm" title="Supprimer" @click="onDelete(record)">
                                        <i class="fa fa-trash"></i>
                                    </button>
                                </div>
                            </td>
                        </tr>
                    </tbody>
                </table>
            </div>
        </section>
        <AddAction :data="dataToHandle" :currentDate="date" @on-close="openEditModal = false" v-if="openEditModal"></AddAction>
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

export default {
    name: 'BudgetMonitoring',

    components: {
        VueDatePicker,
        AddAction,
        Delete
    },

    data() {
        return {
            date: {
                month: new Date().getMonth(),
                year: new Date().getFullYear()
            },
            fr: fr,
            dataToHandle: { title: '', date: null, category: null, amount: 0, isPassed: false, isChecked: false },
            openEditModal: false,
            openDeleteModal: false,
            loading: false
        }
    },

    computed: {
        ...mapStores(useRecordStore),

        currentMonth() {
            const date = new Date(this.date.year, this.date.month, 1)
            return dayjs(date).locale('fr').format('MMMM YYYY');
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
            const date = new Date(this.date.year, this.date.month, 1)
            const minDate = dayjs(date).startOf('month').format('YYYY-MM-DD')
            const maxDate = dayjs(date).endOf('month').format('YYYY-MM-DD')

            const status = await this.recordStore.getRecords(minDate, maxDate);
            if (status === false) {
                createToastify('Le chargement du registre a échoué', 'error');
            }
        },

        formatDateTime(value) {
            return dayjs(value).format('DD/MM/YYYY')
        },

        onAppend() {
            this.dataToHandle = { _id: null, title: '', date: null, category: null, amount: 0, isPassed: false, isChecked: false };
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
            }  else {
                createToastify("L'opération a échoué", 'error');
            }
            
            this.loading = false;
            this.openDeleteModal = false;
            this.dataToHandle = { _id: null, title: '', date: null, category: null, amount: 0, isPassed: false, isChecked: false };
        }
    },
}
</script>

<style>
.isPassed > td {
    background-color: #f8f9fa;
}
</style>