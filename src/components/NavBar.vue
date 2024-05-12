<template>
    <nav id="topMenu" class="navbar py-1 navbar-expand navbar-dark bg-dark shadow fixed-top d-print-none">
        <div class="container-fluid">
            <ul class="navbar-nav">
                <li class="nav-item pe-2">
                    <router-link to="/" class="nav-link topMenuBtn" title="Suivi">
                        <i class="fa fa-home"></i>
                    </router-link>
                </li>
                <li class="nav-item">
                    <router-link to="/config" class="nav-link topMenuBtn" title="Configuration">
                        <i class="fa-solid fa-gears"></i>
                    </router-link>
                </li>
            </ul>
            <ul class="navbar-nav ms-auto" id="topMenuBtns">
                <li class="nav-item pe-2">
                    <a class="nav-link topMenuBtn" id="reduceBtn" href="#" @click.prevent="reduce">
                        <i class="fa-solid fa-minus"></i>
                    </a>
                </li>
                <li class="nav-item pe-2">
                    <a href="#" id="sizeBtn" class="nav-link topMenuBtn" @click.prevent="size">
                        <i class="fa-regular fa-square"></i>
                    </a>
                </li>
                <li class="nav-item">
                    <a href="#" id="closeBtn" class="nav-link topMenuBtn" @click.prevent="close">
                        <i class="fa-solid fa-xmark"></i>
                    </a>
                </li>
            </ul>
        </div>
    </nav>
</template>

<script>
export default {
    name: 'NavBar',

    methods: {
        close() {
            window.frame.closeApp()
        },

        size() {
            window.frame.sizeApp()
        },

        reduce() {
            window.frame.reduceApp()
        }
    },
}
</script>
