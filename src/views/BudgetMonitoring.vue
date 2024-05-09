<template>
    <article>
        <header class="mb-2">
            <div class="row align-items-center mb-3">
                <div class="col-md-6 col-lg-8">
                    <h1 class="display-5 text-gray">Livre de compte</h1>
                </div>
                <div class="col-md-6 col-lg-4 text-end">
                    <button class="btn btn-primary">
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
                <button id="prevMonth" class="btn-sm btn btn-primary"><i class="fa fa-chevron-left fa-fw"></i></button>
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
                <button id="nextMonth" class="btn-sm btn btn-primary"><i class="fa fa-chevron-right fa-fw"></i></button>
            </div>
        </header>

        <section class="card shadow-sm">
            <header class="card-header py-2">
                <h2 class="m-0 font-weight-bold text-primary h4">
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
                            <th class="text-gray"><i class="fa fa-dollar-sign fa-fw"></i> Montant</th>
                            <th class="text-gray"><i class="fa fa-check fa-fw"></i> Vérifié</th>
                            <th class="text-gray" data-orderable="false"><i class="fa fa-edit fa-fw"></i> Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr>
                            <td></td>
                            <td></td>
                            <td></td>
                            <td></td>
                            <td></td>
                            <td></td>
                        </tr>
                    </tbody>
                </table>
            </div>
        </section>
    </article>
</template>

<script>
import VueDatePicker from '@vuepic/vue-datepicker'
import '@vuepic/vue-datepicker/dist/main.css'
import { fr } from 'date-fns/locale'
import dayjs from 'dayjs'
import 'dayjs/locale/fr'

export default {
    name: 'BudgetMonitoring',

    components: {
        VueDatePicker,
    },

    data() {
        return {
            date: new Date(),
            fr: fr
        }
    },

    computed: {
        currentMonth() {
            return dayjs(this.date).locale('fr').format('MMMM YYYY');
        }
    },
}
</script>