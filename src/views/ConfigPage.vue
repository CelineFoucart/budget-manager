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
                                <label for="add">Ajouter</label>
                            </span>
                            <input type="text" v-model="newCategory" class="form-control" id="add">
                            <button class="btn btn-success" type="button" title="sauvegarder" @click="onAppend">
                                <i class="fa-solid fa-floppy-disk"></i>
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
                            <th class="text-gray col-md-8 col-lg-9"><i class="fa fa-file fa-fw"></i> Nom</th>
                            <th class="text-gray col-md-4 col-lg-9"><i class="fa fa-edit fa-fw"></i> Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr v-for="category in categoryStore.categories" :key="category._id">
                            <td>{{ category.name }}</td>
                            <td>
                                <div class="btn-group">
                                    <button class="btn btn-primary btn-sm" title="Editer" @click="onEdit(category)">
                                        <i class="fa-solid fa-pen"></i>
                                    </button>
                                    <button class="btn btn-danger btn-sm" title="Supprimer" @click="onDelete(category)">
                                        <i class="fa fa-trash"></i>
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
