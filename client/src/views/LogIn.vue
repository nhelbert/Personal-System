<template>
  <v-container fluid fill-height class="pa-0 text-center">
    <v-row align="center" justify="space-around" class="ma-0">
      <a-card
        :bordered="false"
        style="width: 300px;"
        id="backgroundcardtransparent"
        @keyup.enter="blnSignUp ? mSubmit() : mLogin()"
      >
        <v-img
          slot="title"
          class="pa-0"
          transition="scroll-y-reverse-transition"
          height="50"
          contain
          lazy-src="../assets/Image/Personal System.png"
          src="../assets/Image/Personal System.png"
        ></v-img>

        <v-fab-transition hide-on-leave>
          <div v-show="!blnSignUp">
            <a-input
              id="backgroundcardtransparent"
              ref="strEmployeeCode"
              auto-focus
              placeholder="Employee Code"
              v-model="strEmployeeCode"
            >
              <a-tooltip slot="prefix" title="Input Employee Code">
                <a-icon type="user" />
              </a-tooltip>
            </a-input>
            <a-input
              id="backgroundcardtransparent"
              ref="strPassword"
              class="mt-2"
              placeholder="Password"
              :type="blnshowpassword ? 'text' : 'password'"
              v-model="strPassword"
            >
              <a-tooltip slot="prefix" title="Input Password">
                <a-icon type="key" />
              </a-tooltip>
              <a-tooltip slot="suffix" :title="blnshowpassword ? 'Hide Password' : 'Show Password'">
                <a-icon
                  :type="blnshowpassword ? 'eye' : 'eye-invisible'"
                  @click="blnshowpassword=!blnshowpassword"
                />
              </a-tooltip>
            </a-input>
            <a-button
              id="backgroundcardtransparent"
              class="mt-3"
              icon="login"
              style="color:blue"
              block
              @click="mLogin()"
            >Login</a-button>Don't have an account?
            <v-hover v-slot:default="{ hover }">
              <a-button
                :style="('color:' + (hover ? 'blue' : 'white'))"
                type="link"
                @click="mSignUp()"
              >Sign Up</a-button>
            </v-hover>
          </div>
        </v-fab-transition>
        <v-fab-transition hide-on-leave>
          <div v-show="blnSignUp">
            <a-input-group compact>
              <a-input-number
                style="pointer-events: none; backgroundColor: #EEEEEE;font-size:10px;width:21%"
                placeholder="Code"
                disabled
              />
              <a-input
                id="backgroundcardtransparent"
                ref="refEmployeeCode"
                style="width:79%"
                placeholder="Employee Code"
                v-model="objsignup.EmployeeCode"
              ></a-input>
            </a-input-group>

            <a-input-group compact class="mt-2">
              <a-input-number
                style="pointer-events: none; backgroundColor: #EEEEEE;font-size:10px;width:21%"
                placeholder="Name"
                disabled
              />
              <a-input
                id="backgroundcardtransparent"
                style="width:79%"
                ref="refEmployeeName"
                placeholder="Employee Name"
                v-model="objsignup.EmployeeName"
              ></a-input>
            </a-input-group>

            <a-input
              id="backgroundcardtransparent"
              ref="refEmployeePass"
              class="mt-2"
              placeholder="Password"
              :type="blnshowpassword ? 'text' : 'password'"
              v-model="objsignup.Password"
            >
              <a-tooltip slot="suffix" :title="blnshowpassword ? 'Hide Password' : 'Show Password'">
                <a-icon
                  :type="blnshowpassword ? 'eye' : 'eye-invisible'"
                  @click="blnshowpassword=!blnshowpassword"
                />
              </a-tooltip>
            </a-input>
            <a-input
              id="backgroundcardtransparent"
              ref="refEmployeeCPass"
              class="mt-2"
              placeholder="Confirm Password"
              type="password"
              v-model="strConfirmPassword"
            ></a-input>
            <a-button
              class="mt-3"
              id="backgroundcardtransparent"
              icon="save"
              style="color:blue"
              block
              @click="mSubmit()"
            >Submit</a-button>
            <v-hover v-slot:default="{ hover }">
              <a-button
                :style="('color:' + (hover ? 'blue' : 'white'))"
                type="link"
                block
                @click="mSignUp()"
              >Already have an account?</a-button>
            </v-hover>
          </div>
        </v-fab-transition>
      </a-card>
    </v-row>
  </v-container>
</template>

<script>
import axios from "axios";
export default {
  data() {
    return {
      blnSignUp: false,
      blnshowpassword: false,
      strEmployeeCode: "",
      strPassword: "",
      strConfirmPassword: "",
      objsignup: {},
      objduplicateUser: []
    };
  },
  methods: {
    mLogin() {
      let error = false;
      if (this.strEmployeeCode == "") {
        this.$refs.strEmployeeCode.focus();
        this.$notification.error({
          message: "Personal System",
          description: "Please input employee code."
        });
        error = true;
        return;
      }
      if (this.strPassword == "") {
        this.$refs.strPassword.focus();
        this.$notification.error({
          message: "Personal System",
          description: "Please input password."
        });
        error = true;
        return;
      }
      if (error == false) {
        axios
          .get(`${this.api}/Check_User/${this.strEmployeeCode}`)
          .then(res => {
            let userdata = res.data;

            if (userdata.length == 0) {
              this.$notification.error({
                message: "Personal System",
                description: "Invalid user !"
              });
              this.$refs.strEmployeeCode.focus();
            } else {
              let getuser = userdata.find(
                data => data.Password == this.strPassword
              );
              if (getuser != undefined) {
                if (getuser.Approved == false) {
                  this.$notification.error({
                    message: "Personal System",
                    description: "Account not yet approve by system admin."
                  });
                } else {
                  this.$notification.success({
                    message: "Personal System",
                    description: "Login successful."
                  });
                  this.CHANGE_sObjuserInfo(getuser);
                  location.reload();
                }
              } else {
                this.$notification.error({
                  message: "Personal System",
                  description: "Invalid password !"
                });
              }
            }
          });
      }
    },
    mSignUp() {
      this.blnSignUp = !this.blnSignUp;
      this.objsignup = {};
      this.strEmployeeCode = "";
      this.strPassword = "";
      this.strConfirmPassword = "";
      this.blnshowpassword = false;
    },
    mSubmit() {
      let error = false;
      if (
        this.objsignup.EmployeeCode == undefined ||
        this.objsignup.EmployeeCode == ""
      ) {
        this.$refs.refEmployeeCode.focus();
        this.$notification.error({
          message: "Personal System",
          description: "Please input employee code."
        });
        error = true;
        return;
      }
      if (error == false) {
        axios
          .get(`${this.api}/Check_User/${this.objsignup.EmployeeCode}`)
          .then(res => {
            this.objduplicateUser = res.data;
          });
      }

      if (this.objduplicateUser.length != 0) {
        this.$refs.refEmployeeCode.focus();
        this.$notification.error({
          message: "Personal System",
          description: "Employee code already exist."
        });
        error = true;
        return;
      }
      if (
        this.objsignup.EmployeeName == undefined ||
        this.objsignup.EmployeeName == ""
      ) {
        this.$refs.refEmployeeName.focus();
        this.$notification.error({
          message: "Personal System",
          description: "Please input employee Name."
        });
        error = true;
        return;
      }
      if (
        this.objsignup.Password == undefined ||
        this.objsignup.Password == ""
      ) {
        this.$refs.refEmployeePass.focus();
        this.$notification.error({
          message: "Personal System",
          description: "Please input password."
        });
        error = true;
        return;
      }
      if (this.strConfirmPassword == "") {
        this.$refs.refEmployeeCPass.focus();
        this.$notification.error({
          message: "Personal System",
          description: "Please input confirm password."
        });
        error = true;
        return;
      }
      if (this.strConfirmPassword != this.objsignup.Password) {
        this.$refs.refEmployeeCPass.focus();
        this.$notification.error({
          message: "Personal System",
          description: "Confirm password not equal to given password."
        });
        error = true;
        return;
      }

      if (error == false) {
        this.objsignup.Approved = 0;
        axios.post(`${this.api}/M_Users_Insert`, this.objsignup).then(res => {
          if (this.objsignup.EmployeeCode == res.data.EmployeeCode) {
            this.$notification.success({
              message: "Personal System",
              description:
                "Submit successful .Please wait system admin approve your request."
            });
            this.blnSignUp = false;
          } else {
            this.$notification.error({
              message: "Personal System",
              description: "Submit error please try again."
            });
          }
        });
      }
    }
  }
};
</script>
<style>
</style>
