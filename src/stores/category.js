import { defineStore } from 'pinia'

export const useCategoryStore = defineStore('category', {
    state: () => ({
        categories: [],
    }),

    actions: {
        async getCategories() {
            try {
                this.categories = await window.frame.findCategories();                
                return true;
            } catch (error) {
                return false;
            }
        },


        async append(data) {
            try {
                const newCategory = await window.frame.appendCategory(data);
                this.categories.push(newCategory);

                return true;
            } catch (error) {
                return false;
            }
        },

        async remove(categoryId) {
            try {
                const isRemoved = await window.frame.removeCategory(categoryId);
                if (!isRemoved) {
                    return false;
                }

                const index = this.categories.findIndex(element => element._id === categoryId)
                if (index !== -1) {
                    this.categories.splice(index, 1);
                }

                return true;
            } catch (error) {
                return false;
            }
        },

        async update(data, categoryId) {
            try {
                const isEdited = await window.frame.updateCategory(data, categoryId);
                if (!isEdited) {
                    return false;
                }
                

                const index = this.categories.findIndex(element => element._id === categoryId)
                if (index !== -1) {
                    data._id = categoryId;
                    this.categories[index] = data;
                }

                return true;
            } catch (error) {
                return false;
            }
        }
    }
})
