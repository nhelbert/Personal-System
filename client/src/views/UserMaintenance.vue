<template>
  <v-container class="pa-0 contentFixHeight" fluid>
    <v-img
      class="mt-5"
      height="75"
      transition="scroll-y-reverse-transition"
      contain
      lazy-src="../assets/Image/User Maintenance.png"
      src="../assets/Image/User Maintenance.png"
    ></v-img>
    <v-row justify="center">
      <v-col cols="3">
        <a-input
          placeholder="Search"
          id="backgroundcardtransparent"
          allow-clear
          v-model="strFilterEmployeeNameCode"
          @input="pageNumber=1"
        >
          <a-icon slot="prefix" type="search" />
        </a-input>
      </v-col>
    </v-row>
    <v-slide-y-transition>
      <a-row type="flex" justify="center" id="MasterHeight">
        <a-empty v-show="cPaginatedData.length==0" />
        <a-col :span="6" v-for="data in cPaginatedData" :key="data.EmployeeCode">
          <v-hover v-slot:default="{ hover }">
            <a-card class="ma-1 pa-0" hoverable :id="mgetId(hover)">
              <v-list-item two-line style="padding:0">
                <v-list-item-avatar>
                  <img
                    :src="mgetProfilePic(data.EmployeeCode)"
                    @error="mgetProfilePicError"
                    alt="Profile"
                  />
                </v-list-item-avatar>
                <v-list-item-content>
                  <span v-if="strFilterEmployeeNameCode">
                    <template
                      v-for="(fragment, i) in data.EmployeeName.toString().split(new RegExp(`(?<=${strFilterEmployeeNameCode})|(?=${strFilterEmployeeNameCode})`, 'i'))"
                    >
                      <mark
                        v-if="fragment.toLowerCase() === strFilterEmployeeNameCode.toLowerCase()"
                        :key="i"
                        class="highlight"
                      >{{fragment}}</mark>
                      <template v-else>{{fragment}}</template>
                    </template>
                  </span>
                  <template v-else>{{data.EmployeeName}}</template>
                  <v-list-item-subtitle>
                    <span v-if="strFilterEmployeeNameCode">
                      <template
                        v-for="(fragment, i) in data.EmployeeCode.toString().split(new RegExp(`(?<=${strFilterEmployeeNameCode})|(?=${strFilterEmployeeNameCode})`, 'i'))"
                      >
                        <mark
                          v-if="fragment.toLowerCase() === strFilterEmployeeNameCode.toLowerCase()"
                          :key="i"
                          class="highlight"
                        >{{fragment}}</mark>
                        <template v-else>{{fragment}}</template>
                      </template>
                    </span>
                    <template v-else>{{data.EmployeeCode}}</template>
                  </v-list-item-subtitle>
                </v-list-item-content>
              </v-list-item>

              <template slot="title">
                <a-tooltip title="Attendance Viewing">
                  <a-icon theme="twoTone" twoToneColor="blue" type="carry-out" />
                </a-tooltip>

                <a-tooltip title="Birthday">
                  <a-icon theme="twoTone" twoToneColor="blue" type="gift" v-show="data.Birthday" />
                </a-tooltip>
                <a-tooltip title="Calendar Notes">
                  <a-icon
                    theme="twoTone"
                    twoToneColor="blue"
                    type="schedule"
                    v-show="data.CalendarNotes"
                  />
                </a-tooltip>
                <a-tooltip title="User Maintenance">
                  <a-icon :style="{color: 'green' }" type="user" v-show="data.UserMaintenance" />
                </a-tooltip>
              </template>
              <template slot="extra">
                <a-tooltip title="Update User">
                  <a-icon
                    v-show="data.Approved && mcheckUserNhel(data)"
                    type="edit"
                    @click="mEditUser(data)"
                  />
                </a-tooltip>

                <a-popconfirm
                  :title="data.Approved ? 'Disappoved user ?':'Appoved user ?'"
                  @confirm="mApproveDisApproveUser(data)"
                  okText="Yes"
                  cancelText="No"
                  placement="topLeft"
                >
                  <a-icon slot="icon" type="question-circle-o" />
                  <a-tooltip
                    placement="bottom"
                    :title="data.Approved ? 'Appoved user':'Disappoved user'"
                  >
                    <a-icon
                      v-show="data.EmployeeCode!='34983'"
                      theme="twoTone"
                      :twoToneColor="data.Approved ? 'blue' : 'red'"
                      :type="data.Approved ? 'like' :'dislike'"
                    />
                  </a-tooltip>
                </a-popconfirm>
              </template>
            </a-card>
          </v-hover>
        </a-col>
      </a-row>
    </v-slide-y-transition>
    <div class="text-center">
      <v-pagination
        dense
        circle
        v-show="mFilterAll().length!=0"
        v-model="pageNumber"
        :length="cPageCount "
        :total-visible="5"
        prev-icon="mdi-menu-left"
        next-icon="mdi-menu-right"
      ></v-pagination>
    </div>

    <a-modal v-model="blnUpdateShow" title="Update User" :mask="false" centered :width="400">
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
      <v-divider></v-divider>
      <p style="margin-top:15px">
        <a-switch style="margin-right:5px;" v-model="blnBirthday" />Birthday's
      </p>
      <p>
        <a-switch style="margin-right:5px;" v-model="blnCalendarNotes" />Calendar Notes
      </p>
      <v-divider></v-divider>
      <p style="margin-top:15px">
        <a-switch
          :disabled="objUpdateuser.EmployeeCode=='34983'"
          style="margin-right:5px"
          v-model="blnUserMaintenance"
        />User Maintenance
      </p>
      <template slot="closeIcon">
        <a-avatar
          :src="mgetProfilePic(objUpdateuser.EmployeeCode)"
          @error="mgetProfilePicError"
          alt="Profile"
        />
      </template>

      <template slot="footer">
        <a-button key="back" @click="blnUpdateShow=false">Cancel</a-button>
        <a-button
          icon="save"
          key="submit"
          type="primary"
          :loading="blnConfirmLoading"
          @click="mUpdateUser()"
        >Update</a-button>
      </template>
    </a-modal>
  </v-container>
</template>

<script>
import axios from "axios";
import moment from "moment";
export default {
  data() {
    return {
      pageNumber: 1,
      blnConfirmLoading: false,
      blnshowpassword: false,
      blnUpdateShow: false,
      strFilterEmployeeNameCode: "",
      M_Users: [],
      objUpdateuser: {},
      strEmployeeName: "",
      strEmployeePassword: "",
      blnEmployees: false,
      blnBirthday: false,
      blnCalendarNotes: false,
      blnUserMaintenance: false
    };
  },
  watch: {},
  created() {
    this.mGetData();
    setInterval(this.mGetData, 1000);
  },
  computed: {
    cPageCount() {
      let l = this.mFilterAll().length,
        s = 12;
      return Math.ceil(l / s);
    },
    cPaginatedData() {
      const start = (this.pageNumber - 1) * 12,
        end = start + 12;
      return this.mFilterAll().slice(start, end);
    }
  },
  methods: {
    moment,
    mFilterAll() {
      if (this.M_Users != undefined) {
        return this.M_Users.filter(rec => {
          return (
            rec.EmployeeCode.toUpperCase().includes(
              this.strFilterEmployeeNameCode == undefined
                ? ""
                : this.strFilterEmployeeNameCode.toUpperCase()
            ) ||
            rec.EmployeeName.toUpperCase().includes(
              this.strFilterEmployeeNameCode == undefined
                ? ""
                : this.strFilterEmployeeNameCode.toUpperCase()
            )
          );
        });
      } else {
        return [];
      }
    },

    mGetData() {
      axios.get(`${this.api}/AllUser`).then(res => {
        this.M_Users = res.data;
        this.M_Users.sort(function(a, b) {
          var nameA = a.EmployeeCode.toLowerCase(),
            nameB = b.EmployeeCode.toLowerCase();
          if (nameA < nameB) return -1;
          if (nameA > nameB) return 1;
          return 0;
        });
      });
    },
    mEditUser(data) {
      this.objUpdateuser = data;
      this.strEmployeeName = data.EmployeeName;
      this.strEmployeePassword = data.Password;
      this.blnEmployees = data.Employees;
      this.blnBirthday = data.Birthday;
      this.blnCalendarNotes = data.CalendarNotes;
      this.blnUserMaintenance = data.UserMaintenance;
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
        this.objUpdateuser.EmployeeName = this.strEmployeeName;
        this.objUpdateuser.Password = this.strEmployeePassword;
        this.objUpdateuser.Employees = this.blnEmployees;
        this.objUpdateuser.Birthday = this.blnBirthday;
        this.objUpdateuser.CalendarNotes = this.blnCalendarNotes;
        this.objUpdateuser.UserMaintenance = this.blnUserMaintenance;
        axios
          .post(`${this.api}/M_Users_Update`, this.objUpdateuser)
          .then(res => {
            if (this.objUpdateuser.EmployeeCode == res.data.EmployeeCode) {
              this.$notification.success({
                message: "Personal System",
                description:
                  "Update user " +
                  this.objUpdateuser.EmployeeName +
                  " successful"
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
    mApproveDisApproveUser(data) {
      data.Approved = !data.Approved;
      axios.post(`${this.api}/M_Users_Update`, data).then(res => {
        if (data.EmployeeCode == res.data.EmployeeCode) {
          this.$notification.success({
            message: "Personal System",
            description:
              (data.Approved ? "Approve user " : "Disapprove user ") +
              data.EmployeeName +
              " successful"
          });
        } else {
          this.$notification.error({
            message: "Personal System",
            description: "Please Try Again !"
          });
        }
      });
    },

    mgetProfilePic(item) {
      return "http://hrdapps48:3001/ftp/Employee_pictures/0" + item + ".jpg";
    },
    mgetProfilePicError(event) {
      event.target.src =
        "http://hrdapps48:3001/ftp/Employee_pictures/no-image.png";
    },

    mgetId(hover) {
      if (hover) {
        return "backgroundcardhover";
      } else {
        return "backgroundcardtransparent";
      }
    },
    mcheckUserNhel(data) {
      const user = this.sObjuserInfo;
      if (data.EmployeeCode == "34983") {
        if (user.EmployeeCode == "34983") {
          return true;
        } else {
          return false;
        }
      } else {
        return true;
      }
    }
  }
};
</script>
<style>
#MasterHeight {
  max-height: calc(100vh - 320px);
  min-height: calc(100vh - 320px);
  overflow-y: auto;
  overflow-x: auto;
}
</style>