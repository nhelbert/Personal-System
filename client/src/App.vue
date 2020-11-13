<template>
  <v-app id="backgroundCover">
    <LogIn v-show="!isLogIn"></LogIn>
    <Drawer v-show="isLogIn"></Drawer>
  </v-app>
</template>

<script>
import LogIn from "./views/LogIn";
import Drawer from "./components/Drawer";
import axios from "axios";
export default {
  name: "App",
  components: {
    LogIn,
    Drawer
  },
  data() {
    return {
      isLogIn: false
    };
  },
  created() {
    this.$notification.config({
      placement: "bottomRight"
    });

    this.mgetUserData();
    setInterval(this.mgetUserData, 1000);

    if (this.$router.app._route.path != "/") {
      this.$router.push("/");
    }
  },
  methods: {
    mgetUserData() {
      if (this.sObjuserInfo.EmployeeCode != undefined) {
        axios
          .get(`${this.api}/Check_User/${this.sObjuserInfo.EmployeeCode}`)
          .then(res => {
            let dataquery = res.data;
            let data = dataquery[0];
            this.$store.commit("CHANGE_sObjuserInfo", data);

            if (data.Approved == false) {
              if (this.$router.app._route.path != "/") {
                this.$router.push("/");
              }
            }
          });
        this.isLogIn = this.sObjuserInfo.Approved;
      } else {
        this.isLogIn = false;
      }
    }
  }
};
</script>
<style>
#backgroundcardhover {
  background-color: white;
}
#backgroundCover {
  background-image: url("./assets/LogIn.jpg");
  background-size: cover;
  background-repeat: no-repeat !important;
}
#backgroundcardtransparent {
  background-color: transparent;
}
#backgroundcardlogin {
  background: rgba(210, 210, 210, 0.5);
}
.content {
  background: rgba(210, 210, 210, 0.5);
  font-family: Montserrat-Medium;
  width: 100%;
  max-height: calc(100vh - 96px);
  overflow-y: auto;
  overflow-x: hidden;
}
.contentFixHeight {
  width: 100%;
  min-height: calc(100vh - 96px);
  overflow-y: hidden;
  overflow-x: hidden;
}
</style>