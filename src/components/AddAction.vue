<template>
    <aside>
        <button
            type="button"
            class="btn btn-primary shadow-sm"
            data-bs-toggle="modal"
            data-bs-target="#addModal"
        >
            <i class="bi bi-plus-circle"></i> Ajouter
        </button>

        <div
            id="addModal"
            class="modal fade"
            tabindex="-1"
            aria-labelledby="addModalLabel"
            aria-hidden="true"
        >
            <div class="modal-dialog">
                <div class="modal-content">
                    <div class="modal-header py-2">
                        <h5 id="addModalLabel" class="modal-title">Ajouter</h5>
                        <span data-bs-dismiss="modal" type="button" aria-label="Close">
                            <i class="bi bi-x h1 mb-0"></i>
                        </span>
                    </div>
                    <div class="modal-body">
                        <p class="text-muted">
                            Pour déclarer un débit, il suffit de mettre un montant négatif dans le
                            champ <em>montant</em>.
                        </p>
                        <form action="">
                            <div class="mb-3">
                                <VueDatePicker
                                    v-model="date"
                                    locale="fr"
                                    :enable-time-picker="false"
                                    auto-apply
                                    required
                                />
                            </div>
                            <div class="mb-3">
                                <label for="title">Libellé</label>
                                <input
                                    id="title"
                                    v-model="title"
                                    type="text"
                                    class="form-control"
                                />
                            </div>
                            <div class="mb-3">
                                <label for="title">Montant</label>
                                <input
                                    id="value"
                                    v-model="value"
                                    type="number"
                                    class="form-control"
                                />
                            </div>
                            <div class="form-check">
                                <input
                                    id="isPassed"
                                    v-model="isPassed"
                                    class="form-check-input"
                                    type="checkbox"
                                />
                                <label class="form-check-label" for="isPassed">
                                    Déclarer ce montant comme passé en banque
                                </label>
                            </div>
                            <div class="form-check">
                                <input
                                    id="isChecked"
                                    v-model="isChecked"
                                    class="form-check-input"
                                    type="checkbox"
                                />
                                <label class="form-check-label" for="isChecked">
                                    Déclarer ce montant comme vérifier
                                </label>
                            </div>
                        </form>
                    </div>
                    <div class="modal-footer">
                        <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">
                            <i class="bi bi-x"></i>
                            Fermer
                        </button>
                        <button
                            type="button"
                            class="btn btn-primary"
                            data-bs-dismiss="modal"
                            @click.prevent="save"
                        >
                            <i class="bi bi-check-lg"></i>
                            Sauvegarder
                        </button>
                    </div>
                </div>
            </div>
        </div>
    </aside>
</template>

<script>
import VueDatePicker from '@vuepic/vue-datepicker'
import '@vuepic/vue-datepicker/dist/main.css'
import { fr } from 'date-fns/locale'

export default {
    components: {
        VueDatePicker
    },
    data() {
        return {
            date: null,
            title: '',
            value: null,
            isPassed: false,
            isChecked: false,
            fr: fr
        }
    },

    mounted() {
        this.reset()
    },

    methods: {
        reset() {
            this.title = ''
            this.date = new Date()
            this.value = null
            this.isPassed = false
            this.isChecked = false
        },

        async save() {
            const data = {
                title: this.title,
                date: this.date,
                value: this.value,
                isPassed: this.isPassed,
                isChecked: this.isChecked
            }

            this.reset()
            const status = await window.electron.ipcRenderer.invoke('on-save', {
                data: data,
                action: 'add'
            })

            console.log(status)
            // condition sur le succès
        }
    }
}
</script>
