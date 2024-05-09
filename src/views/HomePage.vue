<template>
    <article>
        <header class="mb-4">
            <h1 class="display-5 text-gray mb-4">Tableau de bord</h1>
        </header>
        <div class="row">
            <div class="col-3">
                <div class="card border-0 border-start border-3 border-success shadow-sm">
                    <div class="card-body">
                        <h2 class="small text-uppercase text-success">
                            Salaire par mois en moyenne
                        </h2>
                        <div class="fs-2">{{ earningMonthly }} €</div>
                    </div>
                </div>
            </div>
            <div class="col-3">
                <div class="card border-0 border-start border-3 border-success shadow-sm">
                    <div class="card-body">
                        <h2 class="small text-uppercase text-success">Salaire annuel en moyenne</h2>
                        <div class="fs-2">{{ earningMonthly * 12 }} €</div>
                    </div>
                </div>
            </div>
            <div class="col-3">
                <div class="card border-0 border-start border-3 border-danger shadow-sm">
                    <div class="card-body">
                        <h2 class="small text-danger text-uppercase">
                            Dépense mensuelle en moyenne
                        </h2>
                        <div class="fs-2">{{ expenseMonthly }} €</div>
                    </div>
                </div>
            </div>
            <div class="col-3">
                <div class="card border-0 border-start border-3 border-danger shadow-sm">
                    <div class="card-body">
                        <h2 class="small text-danger text-uppercase">
                            Dépense annuelle en moyenne
                        </h2>
                        <div class="fs-2">{{ expenseMonthly * 12 }} €</div>
                    </div>
                </div>
            </div>
        </div>
    </article>
</template>

<script>
    export default {
        name: 'HomePage',

        data() {
            return {
                earningMonthly: 800,
                expenseMonthly: 700,
            }
        },
    }
</script>
