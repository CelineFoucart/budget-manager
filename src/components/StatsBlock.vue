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
        <div class="col-md-6">
            <!-- par catégorie -->
        </div>
        <div class="col-md-6">
            <!-- camembert dépense vs revenue -->
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
import { useRecordStore } from "../stores/record.js";
import { mapStores } from 'pinia';

export default {
    name: 'StatsBlock',

    computed: {
        ...mapStores(useRecordStore),

        left() {
            const expense = Math.abs(this.recordStore.monthlyExpense);

            return this.recordStore.monthlyRevenue - expense;
        }
    },
}
</script>