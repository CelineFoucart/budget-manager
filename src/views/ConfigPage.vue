<template>
    <article>
        <header class="mb-4">
            <h1 class="display-5 text-gray mb-4">Configuration</h1>
        </header>

        <section class="card shadow-sm">
            <header class="card-header py-2">
                <div class="row">
                    <div class="col-md-7">
                        <h2 class="m-0 font-weight-bold text-primary h4">Catégories</h2>
                    </div>
                    <div class="col-md-5">
                        <div class="input-group input-group-sm mb-0">
                            <span class="input-group-text" id="inputGroup-sizing-sm">
                                <label for="add">Nom</label>
                            </span>
                            <input type="text" v-model="newCategory" class="form-control" id="add">
                            <button class="btn btn-success" type="button" title="sauvegarder" @click="onAppend">
                                Ajouter
                            </button>
                        </div>
                    </div>
                </div>
            </header>
            <div class="card-body">
                <p class="text-muted">Les catégories déjà liées à des écritures ne peuvent être supprimées.</p>
                <table class="table table-striped table-bordered">
                    <thead>
                        <tr>
                            <th class="text-gray col-md-8 col-lg-9">Nom</th>
                            <th class="text-gray col-md-4 col-lg-9">Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr v-for="category in categoryStore.categories" :key="category._id">
                            <td>{{ category.name }}</td>
                            <td>
                                <div class="btn-group">
                                    <button class="btn btn-primary btn-sm pb-2" v-tooltip="'Editer'" @click="onEdit(category)">
                                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-pencil-fill" viewBox="0 0 16 16">
                                            <path d="M12.854.146a.5.5 0 0 0-.707 0L10.5 1.793 14.207 5.5l1.647-1.646a.5.5 0 0 0 0-.708zm.646 6.061L9.793 2.5 3.293 9H3.5a.5.5 0 0 1 .5.5v.5h.5a.5.5 0 0 1 .5.5v.5h.5a.5.5 0 0 1 .5.5v.5h.5a.5.5 0 0 1 .5.5v.207zm-7.468 7.468A.5.5 0 0 1 6 13.5V13h-.5a.5.5 0 0 1-.5-.5V12h-.5a.5.5 0 0 1-.5-.5V11h-.5a.5.5 0 0 1-.5-.5V10h-.5a.5.5 0 0 1-.175-.032l-.179.178a.5.5 0 0 0-.11.168l-2 5a.5.5 0 0 0 .65.65l5-2a.5.5 0 0 0 .168-.11z"/>
                                        </svg>
                                    </button>
                                    <button class="btn btn-danger btn-sm pb-2" v-tooltip="'Supprimer'" @click="onDelete(category)">
                                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-trash-fill" viewBox="0 0 16 16">
                                            <path d="M2.5 1a1 1 0 0 0-1 1v1a1 1 0 0 0 1 1H3v9a2 2 0 0 0 2 2h6a2 2 0 0 0 2-2V4h.5a1 1 0 0 0 1-1V2a1 1 0 0 0-1-1H10a1 1 0 0 0-1-1H7a1 1 0 0 0-1 1zm3 4a.5.5 0 0 1 .5.5v7a.5.5 0 0 1-1 0v-7a.5.5 0 0 1 .5-.5M8 5a.5.5 0 0 1 .5.5v7a.5.5 0 0 1-1 0v-7A.5.5 0 0 1 8 5m3 .5v7a.5.5 0 0 1-1 0v-7a.5.5 0 0 1 1 0"/>
                                        </svg>
                                    </button>
                                </div>
                            </td>
                        </tr>
                    </tbody>
                </table>
            </div>
        </section>

        <Delete 
            :title="dataToHandle.name" 
            :loading="loading" 
            @on-close="openDeleteModal = false" 
            @on-confirm="performDelete"
            v-if="openDeleteModal">
        </Delete>
        <EditCategory :data="dataToHandle" @on-close="openEditModal = false" v-if="openEditModal"></EditCategory>
    </article>
</template>

<script>
import { useCategoryStore } from "../stores/category.js";
import { mapStores } from 'pinia';
import { createToastify } from '@/helper/toastify.js';
import Delete from '@/helper/Delete.vue';
import EditCategory from '@/components/EditCategory.vue';

export default {
    name: 'ConfigPage',

    components: {
        Delete,
        EditCategory
    },

    data() {
        return {
            openDeleteModal: false,
            openEditModal: false,
            dataToHandle: {name:null},
            loading: false,
            newCategory: null
        }
    },

    computed: {
        ...mapStores(useCategoryStore),
    },

    async mounted () {
        const status = await this.categoryStore.getCategories();

        if (status === false) {
            createToastify('Le chargement du registre a échoué', 'error');
        }
    },

    methods: {
        onDelete(category) {
            this.dataToHandle = category;
            this.openDeleteModal = true;
        },

        onEdit(record) {
            this.dataToHandle = record;
            this.openEditModal = true;
        },

        async onAppend() {
            if (this.newCategory === null || this.newCategory.length < 2) {
                createToastify('Le nom choisi est trop court.', 'error');

                return;
            }

            const status = await this.categoryStore.append({name: this.newCategory});
            if (status === false) {
                createToastify("L'opération a échoué.", 'error');
            } else {
                createToastify("L'élément a été ajouté.", 'success');
                this.newCategory = null;
            }
        },

        async performDelete() {
            const status = await this.categoryStore.remove(this.dataToHandle._id);
            if (status === false) {
                createToastify("Cette catégorie ne peut être supprimée.", 'error');
            } else {
                createToastify("L'élément a été supprimé", 'success');
            }
            this.openDeleteModal = false;
        }
    },
}
</script>
