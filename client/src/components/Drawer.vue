<template>
  <v-container class="pa-0" fluid>
    <v-app-bar dense tile elevation="1" color="transparent">
      <template v-slot:img="{  }">
        <v-img
          class="mt-2"
          transition="scroll-y-reverse-transition"
          height="50"
          contain
          lazy-src="../assets/Image/Personal System.png"
          src="../assets/Image/Personal System.png"
        ></v-img>
      </template>

      <template v-slot:extension>
        <a-badge v-show="mcheckUserRights(11)" :dot="objNewUser.length==0 ? false :true">
          <a-popover placement="leftTop">
            <template slot="title">
              <a-row>
                <a-col :span="20">New User Request</a-col>
                <a-col :span="4" align="right">
                  <a-tag style="margin-left:10px" color="red">{{objNewUser.length}}</a-tag>
                </a-col>
              </a-row>
            </template>
            <template slot="content">
              <a-empty class="mt-2" v-show="objNewUser.length==0" />
              <v-list-item
                two-line
                v-for="newdata in objNewUser"
                :key="newdata.EmployeeCode"
                style="padding:0"
              >
                <v-list-item-avatar>
                  <img
                    :src="mNewUserProfilePic(newdata.EmployeeCode)"
                    @error="mgetProfilePicError"
                    alt="Profile"
                  />
                </v-list-item-avatar>
                <v-list-item-content>
                  <v-list-item-title>
                    <h5 style="margin:0;margin-left:20px">{{newdata.EmployeeName}}</h5>
                    <a-button
                      size="small"
                      @click="mApproveUserRequest(newdata)"
                      style="color:green;margin-left:20px"
                    >Approve</a-button>
                    <a-button size="small" @click="mRemoveUserRequest(newdata)" type="danger">Remove</a-button>
                  </v-list-item-title>
                </v-list-item-content>
              </v-list-item>
            </template>
            <a-icon class="ml-2" theme="twoTone" twoToneColor="white" type="bell" />
          </a-popover>
        </a-badge>
        <v-row justify="center" no-gutters>
          <v-col cols="auto">
            <v-hover v-slot:default="{ hover }">
              <a-button
                type="link"
                :style="mgetColor(hover)"
                v-scroll-to="{el: '#AttendanceViewing',
                          container: '#MyContainer' }"
              >
                <a-icon theme="twoTone" twoToneColor="blue" type="home" />Home
              </a-button>
            </v-hover>
          </v-col>
          <v-col cols="auto">
            <v-hover v-slot:default="{ hover }">
              <a-button
                type="link"
                :style="mgetColor(hover)"
                v-scroll-to="{el: '#AttendanceViewing',
                          container: '#MyContainer'}"
              >
                <a-icon theme="twoTone" twoToneColor="green" type="carry-out" />Attendance Viewing
              </a-button>
            </v-hover>
          </v-col>
          <v-col cols="auto" v-show="mcheckUserRights(2)">
            <v-hover v-slot:default="{ hover }">
              <a-button
                type="link"
                :style="mgetColor(hover)"
                v-scroll-to="{el: '#Birthday',
                          container: '#MyContainer'}"
              >
                <a-icon theme="twoTone" twoToneColor="red" type="gift" />Birthday's
              </a-button>
            </v-hover>
          </v-col>
          <v-col cols="auto" v-show="mcheckUserRights(3)">
            <v-hover v-slot:default="{ hover }">
              <a-button
                type="link"
                :style="mgetColor(hover)"
                v-scroll-to="{el: '#CalendarNotes',
                          container: '#MyContainer'}"
              >
                <a-icon theme="twoTone" twoToneColor="purple" type="schedule" />Calendar Notes
              </a-button>
            </v-hover>
          </v-col>
          <v-col cols="auto" v-show="sObjuserInfo.EmployeeCode=='34983'">
            <v-hover v-slot:default="{ hover }">
              <a-button
                type="link"
                :style="mgetColor(hover)"
                v-scroll-to="{el: '#Employees',
                          container: '#MyContainer'}"
              >
                <a-icon type="idcard" />Employees
              </a-button>
            </v-hover>
          </v-col>
          <v-col cols="auto" v-show="mcheckUserRights(11)">
            <v-hover v-slot:default="{ hover }">
              <a-button
                type="link"
                :style="mgetColor(hover)"
                v-scroll-to="{el: '#UserMaintenance',
                          container: '#MyContainer'}"
              >
                <a-icon theme="twoTone" twoToneColor="grey" type="tool" />User Maintenance
              </a-button>
            </v-hover>
          </v-col>
        </v-row>

        <a-popover placement="leftTop">
          <template slot="title">
            <a-row>
              <a-col :span="18">My Account</a-col>
              <a-col :span="3" align="right">
                <a-tooltip placement="topLeft">
                  <template slot="title">
                    Update Account
                    <a-icon slot="icon" type="question-circle-o" />
                  </template>
                  <a-icon type="edit" @click="mEditUser()" />
                </a-tooltip>
              </a-col>
              <a-col :span="3" align="right">
                <a-tooltip placement="topLeft">
                  <template slot="title">
                    Log out account
                    <a-icon slot="icon" type="question-circle-o" />
                  </template>
                  <a-icon @click="mLogoutConfirm" style="color:red;" type="logout" />
                </a-tooltip>
              </a-col>
            </a-row>
          </template>
          <template slot="content">
            <v-list-item two-line style="padding:0">
              <v-list-item-avatar>
                <img :src="cProfilePic" @error="mgetProfilePicError" alt="Profile" />
              </v-list-item-avatar>
              <v-list-item-content>
                <v-list-item-title>
                  <h5 style="margin:0;margin-left:20px">{{cUserName}}</h5>
                  <h5 style="margin:0;margin-left:20px">{{cLastName}}</h5>
                </v-list-item-title>
              </v-list-item-content>
            </v-list-item>
          </template>
          <a-icon class="mr-2" style="color:white" type="user" />
        </a-popover>
      </template>
    </v-app-bar>

    <a-modal title="Update Account" :mask="false" centered v-model="blnUpdateShow" :width="400">
      <p>
        <a-input-group compact class="mt-2">
          <a-input-number
            style="pointer-events: none; backgroundColor: #EEEEEE;font-size:15px;width:30%"
            placeholder="Name:"
            disabled
          />
          <a-textarea
            style="width:70%"
            ref="refEmployeeName"
            placeholder="Employee Name"
            autoSize
            v-model="strEmployeeName"
          />
        </a-input-group>
      </p>
      <p>
        <a-input-group compact class="mt-2">
          <a-input-number
            style="pointer-events: none; backgroundColor: #EEEEEE;font-size:15px;width:30%"
            placeholder="Password:"
            disabled
          />
          <a-input
            style="width:70%"
            ref="refEmployeePass"
            placeholder="Password"
            :type="blnshowpassword ? 'text' : 'password'"
            v-model="strEmployeePassword"
          >
            <a-tooltip slot="suffix" :title="blnshowpassword ? 'Hide Password' : 'Show Password'">
              <a-icon
                :type="blnshowpassword ? 'eye' : 'eye-invisible'"
                @click="blnshowpassword=!blnshowpassword"
              />
            </a-tooltip>
          </a-input>
        </a-input-group>
      </p>
      <template slot="closeIcon">
        <a-avatar :src="cProfilePic" @error="mgetProfilePicError" alt="Profile" />
      </template>
      <template slot="footer">
        <a-button key="back" @click="blnUpdateShow=false">Cancel</a-button>
        <a-button
          icon="save"
          key="submit"
          type="primary"
          :loading="blnConfirmLoading"
          @click="mUpdateUser"
        >Update</a-button>
      </template>
    </a-modal>
    <v-content>
      <v-container class="pa-0 content" id="MyContainer" fluid>
        <AttendanceViewing id="AttendanceViewing" />
        <Birthday id="Birthday" v-show="mcheckUserRights(2)" />
        <CalendarNotes id="CalendarNotes" v-show="mcheckUserRights(3)" />
        <Employees id="Employees" v-show="this.sObjuserInfo.EmployeeCode=='34983'" />
        <UserMaintenance id="UserMaintenance" v-show="mcheckUserRights(11)" />
      </v-container>
    </v-content>
  </v-container>
</template>

<script>
import axios from "axios";
import AttendanceViewing from "../views/AttendanceViewing";
import Birthday from "../views/Birthday";
import CalendarNotes from "../views/CalendarNotes";
import Employees from "../views/Employees";
import UserMaintenance from "../views/UserMaintenance";

export default {
  components: {
    AttendanceViewing,
    Birthday,
    CalendarNotes,
    Employees,
    UserMaintenance
  },
  data() {
    return {
      blnUpdateShow: false,
      blnConfirmLoading: false,
      blnshowpassword: false,
      objNewUser: [],
      strEmployeePassword: "",
      strEmployeeName: ""
    };
  },
  created() {
    setInterval(this.mNewUserRequest, 1000);
  },
  computed: {
    cUserName() {
      const FirstName = this.sObjuserInfo.EmployeeName.replace(
        this.cLastName,
        ""
      );
      return FirstName;
    },
    cLastName() {
      const LastName = this.sObjuserInfo.EmployeeName.split(" ");
      return LastName[LastName.length - 1];
    },
    cProfilePic() {
      if (this.sObjuserInfo.EmployeeCode != "") {
        return (
          "http://hrdapps48:3001/ftp/Employee_pictures/0" +
          this.sObjuserInfo.EmployeeCode +
          ".jpg"
        );
      } else {
        return "http://hrdapps48:3001/ftp/Employee_pictures/no-image.png";
      }
    },
    cBlnDrawer: {
      get() {
        return this.sBlnDrawer;
      },
      set(value) {
        this.$store.commit("CHANGE_sBlnDrawer", value);
      }
    }
  },
  methods: {
    mLogoutConfirm() {
      var self = this;
      this.$confirm({
        title: "Do you want to logout account?",
        cancelText: "No",
        okText: "Yes",
        content: <div style="color:blue">{this.sObjuserInfo.EmployeeName}</div>,
        onOk() {
          self.mlogout();
        },
        onCancel() {}
      });
    },
    mcheckUserRights(id) {
      let user = this.sObjuserInfo;
      if (user != undefined) {
        if (id == 2) {
          return user.Birthday;
        } else if (id == 3) {
          return user.CalendarNotes;
        } else if (id == 11) {
          return user.UserMaintenance;
        } else return false;
      }
    },
    mEditUser() {
      this.strEmployeeName = this.sObjuserInfo.EmployeeName;
      this.strEmployeePassword = this.sObjuserInfo.Password;
      this.blnUpdateShow = true;
    },

    mUpdateUser() {
      let error = false;
      if (this.strEmployeeName == "") {
        this.$notification.error({
          message: "Personal System",
          description: "Please input employee name."
        });
        error = true;
      }
      if (this.strEmployeePassword == "") {
        this.$notification.error({
          message: "Personal System",
          description: "Please input password."
        });
        error = true;
      }
      if (error == false) {
        let UpdateData = this.sObjuserInfo;
        UpdateData.EmployeeName = this.strEmployeeName;
        UpdateData.Password = this.strEmployeePassword;

        axios.post(`${this.api}/M_Users_Update`, UpdateData).then(res => {
          if (UpdateData.EmployeeCode == res.data.EmployeeCode) {
            this.$notification.success({
              message: "Personal System",
              description:
                "Update user " + UpdateData.EmployeeName + " successful"
            });
            this.blnConfirmLoading = true;
            setTimeout(() => {
              this.blnUpdateShow = false;
              this.blnConfirmLoading = false;
            }, 2000);
          } else {
            this.$notification.error({
              message: "Personal System",
              description: "Please Try Again !"
            });
          }
        });
      }
    },
    mgetProfilePicError(event) {
      event.target.src =
        "http://hrdapps48:3001/ftp/Employee_pictures/no-image.png";
    },
    mgetColor(hover) {
      if (hover) {
        return "color:blue";
      } else {
        return "color:white";
      }
    },

    mlogout() {
      this.$notification.info({
        message: "Personal System",
        description: "Logout successful"
      });
      this.$store.commit("CHANGE_sObjuserInfo", {});
      if (this.$router.app._route.path != "/") {
        this.$router.push("/");
      }
      // location.reload();
    },
    mNewUserRequest() {
      if (this.mcheckUserRights(11)) {
        axios.get(`${this.api}/Check_NewUser`).then(res => {
          this.objNewUser = res.data;
        });
      }
    },
    mNewUserProfilePic(EmplCode) {
      return (
        "http://hrdapps48:3001/ftp/Employee_pictures/0" + EmplCode + ".jpg"
      );
    },
    mApproveUserRequest(newdata) {
      newdata.Approved = true;
      axios.post(`${this.api}/M_Users_Update`, newdata).then(res => {
        if (newdata.EmployeeCode == res.data.EmployeeCode) {
          this.$notification.success({
            message: "Personal System",
            description: "Approve user " + newdata.EmployeeName + " successful"
          });
        } else {
          this.$notification.error({
            message: "Personal System",
            description: "Please Try Again !"
          });
        }
      });
    },
    mRemoveUserRequest(newdata) {
      axios.post(`${this.api}/M_Users_Delete`, newdata).then(res => {
        if (newdata.EmployeeCode == res.data.EmployeeCode) {
          this.$notification.info({
            message: "Personal System",
            description: "Cancel user " + newdata.EmployeeName + " successful"
          });
        } else {
          this.$notification.error({
            message: "Personal System",
            description: "Please Try Again !"
          });
        }
      });
    }
  }
};
</script>

<style>
</style>