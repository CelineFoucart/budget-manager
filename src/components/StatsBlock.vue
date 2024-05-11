<template>
    <div class="row align-items-center">
        <div class="col-4">
            <div class="card border-0 alert p-0 alert-success border-start border-3 border-success shadow-sm">
                <div class="card-body">
                    <h2 class="small text-uppercase">
                        Revenus du mois
                    </h2>
                    <div class="fs-2">{{ currencyFormat(this.recordStore.monthlyRevenue) }}</div>
                </div>
            </div>
        </div>
        <div class="col-4">
            <div class="card border-0 border-start p-0 alert alert-danger border-3 border-danger shadow-sm">
                <div class="card-body ">
                    <h2 class="small text-uppercase">
                        Dépense du mois
                    </h2>
                    <div class="fs-2">{{ currencyFormat(this.recordStore.monthlyExpense) }}</div>
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
                        {{ currencyFormat(left) }}
                    </div>
                </div>
            </div>
        </div>
        <div class="col-lg-7">
            <!-- par catégorie -->
            <Bar :data="byCategories" :options="options" :style="stylesBar"></Bar>
        </div>
        <div class="col-lg-5">
            <Pie :data="pieData" :options="options" :style="styles" />
        </div>
    </div>
</template>

<script>
import dayjs from 'dayjs'
import 'dayjs/locale/fr'
import { useRecordStore } from "../stores/record.js";
import { mapStores } from 'pinia';
import { Chart as ChartJS, ArcElement, Tooltip, Legend, Title, BarElement, CategoryScale, LinearScale } from 'chart.js';
import { Pie, Bar } from 'vue-chartjs';
ChartJS.register(ArcElement, Tooltip, Legend, CategoryScale, LinearScale, BarElement, Title);

export default {
    name: 'StatsBlock',

    components: {
        Pie,
        Bar
    },

    props: {
        currentDate: Object,
    },

    data() {
        return {
            options: {
                responsive: false,
                maintainAspectRatio: true,
                indexAxis: 'y',
            },
            stylesBar: {
                width: '100%',
            },
            styles: {
                width: '100%'
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
        },

        byCategories() {
            const data = {}
            this.recordStore.records.forEach(record => {
                let category = this.recordStore.categories[record.category] ? this.recordStore.categories[record.category] : null;
                if (category === null) {
                    category = {_id: '0', name: 'Sans catégorie'}
                }

                if (!(category._id in data)) {
                    data[category._id] = {
                        amount: 0,
                        label: category.name
                    };
                }

                data[category._id].amount += parseFloat(record.amount);
            });

            const labels = [];
            const amounts = [];

            for (const key in data) {
                let label = data[key].label.charAt(0).toUpperCase() + data[key].label.slice(1);
                amounts.push(data[key].amount);
                labels.push(label);
            }

            return {
                labels: labels,
                datasets: [
                    {
                        label: this.currentMonth,
                        backgroundColor: '#f87979',
                        data: amounts
                    }
                ]
            }
        }
    },

    methods: {
        currencyFormat(amount) {
            const euroFormat = new Intl.NumberFormat('fr-FR', { style: 'currency', currency: 'EUR' });

            return euroFormat.format(amount);
        }
    },
}
</script>