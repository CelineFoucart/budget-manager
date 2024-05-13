<template>
    <div class="modal-backdrop fade show"></div>
    <div class="modal fade show" id="addModal" tabindex="-1"  aria-labelledby="addModalLabel">
        <div class="modal-dialog">
            <div class="modal-content">
                <div class="modal-header py-2">
                    <h5 id="addModalLabel" class="modal-title">Ligne</h5>
                    <button type="button" class="btn-close" @click="close"></button>
                </div>
                <div class="modal-body">
                    <p class="text-muted">
                        Pour déclarer un débit, il suffit de mettre un montant négatif dans le
                        champ <em>montant</em>.
                    </p>
                    <form action="">
                        <div class="mb-3">
                            <label for="date" class="required">Date</label>
                            <VueDatePicker id="date" v-model="date" locale="fr" :format="format" :enable-time-picker="false" auto-apply required/>
                        </div>
                        <div class="mb-3">
                            <label for="title" class="required">Libellé</label>
                            <input id="title" v-model="title" type="text" class="form-control" />
                        </div>
                        <div class="mb-3">
                            <label for="category" class="required">Catégorie</label>
                            <select class="form-select"  v-model="category" id="category" required>
                                <option :value="category._id" v-for="category in recordStore.categories" :key="category._id">
                                    {{ category.name }}
                                </option>
                            </select>
                        </div>
                        <div class="mb-3">
                            <label for="amount" class="required">Montant</label>
                            <input id="amount" v-model="amount" type="number" class="form-control" required/>
                        </div>
                        <div class="form-check">
                            <input id="isPassed" v-model="isPassed" class="form-check-input" type="checkbox" required />
                            <label class="form-check-label" for="isPassed">
                                Déclarer ce montant comme passé en banque
                            </label>
                        </div>
                        <div class="form-check">
                            <input id="isChecked" v-model="isChecked" class="form-check-input" type="checkbox"/>
                            <label class="form-check-label" for="isChecked">
                                Déclarer ce montant comme vérifier
                            </label>
                        </div>
                    </form>
                </div>
                <div class="modal-footer">
                    <button type="button" class="btn btn-secondary btn-sm" @click="close">
                        Fermer
                    </button>
                    <button type="button" class="btn btn-success btn-sm"  data-bs-dismiss="modal" @click.prevent="save">
                        Sauvegarder
                    </button>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
import VueDatePicker from '@vuepic/vue-datepicker'
import '@vuepic/vue-datepicker/dist/main.css'
import { fr } from 'date-fns/locale'
import { useRecordStore } from "../stores/record.js";
import { mapStores } from 'pinia';
import { createToastify } from '@/helper/toastify.js'
import dayjs from 'dayjs'
import 'dayjs/locale/fr'

export default {
    components: {
        VueDatePicker
    },

    emits: ['on-close', 'on-refresh'],

    props: {
        data: Object,
        currentDate: Object,
    },

    data() {
        return {
            date: null,
            title: '',
            category: null,
            amount: null,
            isPassed: false,
            isChecked: false,
            fr: fr
        }
    },

    computed: {
        ...mapStores(useRecordStore),
    },

    mounted() {
        this.reset()
    },

    methods: {
        reset() {

            if (this.data.date) {
                this.date =  this.data.date;
            } else {
                const currentMonth = dayjs(new Date(this.currentDate.year, this.currentDate.month, 1));
                const today = dayjs().format('MM-YYYY');
                this.date = (currentMonth.format('MM-YYYY') === today) ? new Date() : currentMonth.endOf('month').toDate();
            }

            this.title = this.data.title ? this.data.title : ''
            this.amount = this.data.amount ? this.data.amount : 0;
            this.category = this.data.category ? this.data.category : null;
            this.isPassed = this.data.amount ? this.data.isPassed : false;
            this.isChecked = this.data.isChecked ? this.data.isChecked : false;
        },

        close() {
            this.$emit('on-close');
        },

        format(date) {
            return dayjs(date).format('DD/MM/YYYY');
        },

        async save() {
            const data = {
                date: dayjs(this.date).format('YYYY-MM-DD'),
                amount: this.amount,
                title: this.title,
                category: this.category,
                isPassed: this.isPassed,
                isChecked: this.isChecked
            }

            let status = false;
            if (this.data._id === null) {
                const currentDateString = this.currentDate.year + '-' + `${this.currentDate.month+1}`.padStart(2, '0');
                const withInsert = data.date.startsWith(currentDateString);
                status = await this.recordStore.appendRecord(data, withInsert);
            } else {
                status = await this.recordStore.updateRecord(data, this.data._id);
            }
            
            if (status) {
                createToastify("L'élément a été enregistré", 'success');
                this.$emit('on-refresh');
                this.close();
            } else {
                createToastify("L'opération a échoué", 'error');
            }
        }
    }
}
</script>
<style>
#addModal {
    display: block;
}
</style>
