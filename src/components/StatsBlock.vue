<template>
    <div class="row">
        <div class="col-4">
            <div class="card border-0 alert p-0 alert-success border-start border-3 border-success shadow-sm">
                <div class="card-body">
                    <h2 class="small text-uppercase">
                        Revenus du mois
                    </h2>
                    <div class="fs-2">{{ this.recordStore.monthlyRevenue }} €</div>
                </div>
            </div>
        </div>
        <div class="col-4">
            <div class="card border-0 border-start p-0 alert alert-danger border-3 border-danger shadow-sm">
                <div class="card-body ">
                    <h2 class="small text-uppercase">
                        Dépense du mois
                    </h2>
                    <div class="fs-2">{{ this.recordStore.monthlyExpense }} €</div>
                </div>
            </div>
        </div>
        <div class="col-4">
            <div class="card border-0 bg-primary-subtle border-start border-3 border-primary shadow-sm">
                <div class="card-body ">
                    <h2 class="small text-primary text-uppercase">
                        Reste pour ce mois
                    </h2>
                    <div class="fs-2">
                        <i class="text-primary fa-solid fa-triangle-exclamation fa-fw" v-if="left <= 0"></i>
                        <i class="text-primary fa-solid fa-circle-check fa-fw" v-else></i>
                        {{ left }} €
                    </div>
                </div>
            </div>
        </div>

        <div class="col-12">
            <h3 class="mt-3 h5 border text-center bg-light text-uppercase py-2 py-1">Ce mois-ci</h3>
        </div>
        <div class="col-md-6 col-lg-7">
            <!-- par catégorie -->
        </div>
        <div class="col-md-6 col-lg-5">
            <Pie :data="pieData" :options="options" :style="styles" />
        </div>
        <div class="col-12">
            <h3 class="h5 mt-3 h5 border text-center bg-light text-uppercase py-2 py-1">Le mois précédent</h3>
        </div>
        <div class="col-md-6">
            <!-- par catégorie -->
        </div>
        <div class="col-md-6">
            <!-- camembert dépense vs revenue -->
        </div>
    </div>
</template>

<script>
import dayjs from 'dayjs'
import 'dayjs/locale/fr'
import { useRecordStore } from "../stores/record.js";
import { mapStores } from 'pinia';
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';
import { Pie } from 'vue-chartjs';
ChartJS.register(ArcElement, Tooltip, Legend);

export default {
    name: 'StatsBlock',

    components: {
        Pie,
    },

    props: {
        currentDate: Object,
    },

    data() {
        return {
            options: {
                responsive: true,
                maintainAspectRatio: false
            },
            styles: {
                width: '450px'
            }
        }
    },

    computed: {
        ...mapStores(useRecordStore),

        currentMonth() {
            const date = new Date(this.currentDate.year, this.currentDate.month, 1)
            return dayjs(date).locale('fr').format('MMMM YYYY');
        },

        left() {
            const expense = Math.abs(this.recordStore.monthlyExpense);

            return this.recordStore.monthlyRevenue - expense;
        },

        pieData() {
            return {
                labels: ['Dépenses ' + this.currentMonth, 'Revenus ' + this.currentMonth],
                datasets: [
                    {
                        backgroundColor: ['#dc3545', '#198754'],
                        data: [Math.abs(this.recordStore.monthlyExpense), this.recordStore.monthlyRevenue]
                    }
                ]
            }
        }
    },
}
</script>