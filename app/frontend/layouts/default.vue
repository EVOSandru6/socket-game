<template>
    <v-app app dark>
        <v-navigation-drawer
                v-model="drawer"
                fixed
        >
            <v-list subheader>
                <v-subheader>Список людей в комнате</v-subheader>

                <v-list-item v-for="u in users" :key="u.id" @click.prevent>
                    <v-list-item-content>
                        <v-list-item-title>{{u.name}}</v-list-item-title>
                    </v-list-item-content>

                    <v-list-item-action>
                        <v-icon :color="u.id === user.id ? 'primary' : 'grey'">mdi-message-text</v-icon>
                    </v-list-item-action>
                </v-list-item>
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
                user.room: {{ user.room }} <hr> users: {{ users }}
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
                title: `Чат комнаты ${JSON.stringify(this?.user?.room)}` // ?.room
            }
        },
        computed: mapState(['user', 'users']),
        methods: {
            ...mapMutations(["clearData"]),
            exit() {
                this.$socket.emit("userLeft", this.user.id, () => {
                    this.$router.push("/?message=leftChat");
                    this.clearData();
                });
            }
        },
        user: function (val) {
            console.log('watch for user_____________');

            this.title = `Чат комнаты ${this.user.room}`
        },
    }
</script>
