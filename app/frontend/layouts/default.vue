<template>
    <v-app app dark>
        <v-navigation-drawer
                v-model="drawer"
                fixed
        >
            <v-list subheader>
                <v-subheader>Список людей в комнате</v-subheader>

                <v-list-tile v-for="u in users" :key="u.id" @click.prevent>
                    <v-list-tile-content>
                        <v-list-tile-title>{{u.name}}</v-list-tile-title>
                    </v-list-tile-content>

                    <v-list-tile-action>
                        <v-icon :color="u.id === user.id ? 'primary' : 'grey'">chat_bubble</v-icon>
                    </v-list-tile-action>
                </v-list-tile>
            </v-list>
        </v-navigation-drawer>

        <v-app-bar
                :clipped-left="clipped"
                fixed
                app
        >
            <v-app-bar-nav-icon @click.stop="drawer = !drawer"/>

            <v-toolbar-title v-text="title"/>
        </v-app-bar>

        <v-content>
            <v-container>
                <nuxt/>
            </v-container>
        </v-content>

        <!--<v-footer
          :fixed="fixed"
          app
        >
          <span>&copy; {{ new Date().getFullYear() }}</span>
        </v-footer>-->
    </v-app>
</template>

<script>
    import { mapState, mapMutations } from "vuex";

    export default {
        data() {
            return {
                clipped: false,
                drawer: false,
                fixed: false,
                title: `Чат комнаты ${this.user.room}`
            }
        },
        methods: {
            ...mapMutations(["clearData"]),
            exit() {
                this.$socket.emit("userLeft", this.user.id, () => {
                    this.$router.push("/?message=leftChat");
                    this.clearData();
                });
            }
        }
    }
</script>
