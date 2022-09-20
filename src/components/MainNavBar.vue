<script setup>
import { reactive, ref } from 'vue';

const navTogglerIcon = ref(null);

const resources = reactive({
    MainMenus: [
        { path: "/", title: "Samples" },
        { path: "/help", title: "Help" }
    ]
})

function clickMenuToggler() {
  if (navTogglerIcon.value?.offsetParent) {
    navTogglerIcon.value.click(); // close navigation menu for mobile view
  }
}

</script>

<template>
    <nav class="navbar navbar-expand-lg navbar-dark bg-dark">
        <div class="container">
            <a class="navbar-brand d-block d-sm-none" href="#">ONLYOFFICE</a>
            <a class="navbar-brand d-none d-sm-block" href="#">ONLYOFFICE | VueJS + Bootstrap</a>
            <button class="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarTogglerDemo02"
                aria-controls="navbarTogglerDemo02" aria-expanded="false" aria-label="Toggle navigation">
                <span class="navbar-toggler-icon" ref="navTogglerIcon"></span>
            </button>
            <div class="collapse navbar-collapse" id="navbarTogglerDemo02">
                <ul class="navbar-nav ms-auto">
                    <li class="nav-item" v-for="menu in resources.MainMenus" :key="menu.path">
                        <router-link
                            class="nav-link"
                            :to="menu.path"
                            active-class="active"
                            v-on:click="clickMenuToggler"
                        >{{ menu.title }}</router-link>
                    </li>
                </ul>
            </div>
        </div>
    </nav>
</template>