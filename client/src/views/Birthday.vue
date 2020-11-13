<template>
  <v-container class="pa-0 contentFixHeight" fluid>
    <v-img
      class="mt-5"
      height="75"
      transition="scroll-y-reverse-transition"
      contain
      lazy-src="../assets/Image/Happy Birthday.png"
      src="../assets/Image/Happy Birthday.png"
    ></v-img>

    <a-row type="flex" justify="space-around" align="middle">
      <a-col :span="6">
        <a-select
          :disabled="intUserCode!='34983'"
          showSearch
          placeholder="Select Department"
          v-model="strFilterDepartment"
          @change="mChangeDept()"
          style="width: 100% ;"
        >
          <a-select-option
            v-for="dep in Departments"
            :key="dep.DepartmentCode"
            :value="dep.DepartmentName"
          >{{dep.DepartmentName}}</a-select-option>
        </a-select>
      </a-col>
      <a-col :span="6">
        <a-select
          showSearch
          placeholder="Select Section"
          allowClear
          @change="mChangeSec()"
          v-model="strFilterSection"
          style="8px;width: 100%"
        >
          <a-select-option
            v-for="sec in mFilterSection()"
            :key="sec.SectionCode"
            :value="sec.SectionName"
          >{{sec.SectionName}}</a-select-option>
        </a-select>
      </a-col>
      <a-col :span="6">
        <a-select
          showSearch
          placeholder="Select Team"
          allowClear
          v-model="strFilterTeam"
          style="width: 100%"
        >
          <a-select-option
            v-for="team in mFilterTeam()"
            :key="team.TeamCode"
            :value="team.TeamName"
          >{{team.TeamName}}</a-select-option>
        </a-select>
      </a-col>
      <a-col :span="5">
        <a-input
          id="backgroundcardtransparent"
          placeholder="Search"
          v-model="strFilterEmployeeName"
          allowClear
          @pressEnter="mFilterSearch(confirm)"
        >
          <a-icon slot="prefix" type="search" />
        </a-input>
      </a-col>
    </a-row>

    <v-slide-y-transition>
      <a-card v-show="!blnLoading" :bordered="false" class="mx-2" id="backgroundbdaycover">
        <a-row slot="title" type="flex" justify="space-around">
          <a-col :span="2" align="middle">
            <a-tooltip placement="right">
              <template slot="title">Previous Month</template>
              <a-button @click="mPrevMonth()" icon="left" type="link" style="color:black"></a-button>
            </a-tooltip>
          </a-col>

          <a-col :span="20" align="middle">
            <v-img
              transition="scroll-y-reverse-transition"
              contain
              height="30"
              :lazy-src="mgetMonthName(objmonth[strFilterMonth])"
              :src="mgetMonthName(objmonth[strFilterMonth])"
            ></v-img>
            <!-- {{objmonth[strFilterMonth]}} -->
          </a-col>
          <a-col :span="2" align="middle">
            <a-tooltip placement="left">
              <template slot="title">Next Month</template>
              <a-button @click="mNextMonth()" icon="right" type="link" style="color:black"></a-button>
            </a-tooltip>
          </a-col>
        </a-row>
        <a-row type="flex" justify="space-around" align="middle">
          <a-empty v-show="mFilterAll().length==0" />
          <a-col :span="6" v-for="data in mFilterAll()" :key="data.EmployeeCode">
            <v-hover v-slot:default="{ hover }">
              <a-card
                class="ma-1 pa-0"
                hoverable
                :id="mgetId(hover,data)"
                :style="('background-color:#' + (Math.random()*0xFFFFFF<<0).toString(16))"
              >
                <v-list-item two-line style="padding:0">
                  <v-list-item-avatar>
                    <img
                      :src="mgetProfilePic(data.EmployeeCode)"
                      @error="mgetProfilePicError"
                      alt="Profile"
                    />
                  </v-list-item-avatar>

                  <span v-if="strFilterEmployeeName">
                    <template
                      v-for="(fragment, i) in data.EmployeeName.toString().split(new RegExp(`(?<=${strFilterEmployeeName})|(?=${strFilterEmployeeName})`, 'i'))"
                    >
                      <mark
                        v-if="fragment.toLowerCase() === strFilterEmployeeName.toLowerCase()"
                        :key="i"
                        class="highlight"
                      >{{fragment}}</mark>
                      <template v-else>{{fragment}}</template>
                    </template>
                  </span>
                  <template v-else>{{data.EmployeeName}}</template>
                </v-list-item>
                <a-card-meta>
                  <div slot="title">
                    {{moment(data.DateBirth).format('MMMM Do')}}
                    <a-tooltip placement="top">
                      <template slot="title">Birthday Today</template>
                      <a-icon
                        v-show="moment(data.DateBirth).format('MMMM Do')==moment(datenow).format('MMMM Do')"
                        theme="twoTone"
                        twoToneColor="red"
                        type="gift"
                      />
                    </a-tooltip>
                  </div>
                </a-card-meta>
              </a-card>
            </v-hover>
          </a-col>
        </a-row>
      </a-card>
    </v-slide-y-transition>
  </v-container>
</template>

<script>
import axios from "axios";
import moment from "moment";
export default {
  data() {
    return {
      datenow: new Date(),
      blnLoading: false,
      intUserCode: 0,
      strFilterEmployeeCode: "",
      strFilterEmployeeName: "",
      strFilterDepartment: undefined,
      strFilterSection: undefined,
      strFilterTeam: undefined,
      strFilterMonth: moment(this.datenow).format("MM") - 1,
      Employees: [],
      Departments: [],
      SectionRelation: [],
      TeamRelation: [],
      objmonth: [
        "January",
        "February",
        "March",
        "April",
        "May",
        "June",
        "July",
        "August",
        "September",
        "October",
        "November",
        "December"
      ]
    };
  },
  watch: {},
  created() {
    this.mgetUserData();
    this.mGetData();
  },
  computed: {},
  methods: {
    moment,
    mFilterAll() {
      if (this.Employees != undefined) {
        return this.Employees.filter(rec => {
          return (
            rec.DepartmentCode.includes(this.mgetDeptCode()) &&
            rec.SectionCode.includes(this.mgetSecCode()) &&
            rec.TeamCode.includes(this.mgetTeamCode()) &&
            moment(rec.DateBirth).format("MMMM") ==
              this.objmonth[this.strFilterMonth] &&
            rec.EmployeeName.toUpperCase().includes(
              this.strFilterEmployeeName == undefined
                ? ""
                : this.strFilterEmployeeName.toUpperCase()
            )
          );
        });
      } else {
        return [];
      }
    },
    mgetUserData() {
      const user = this.sObjuserInfo;
      this.intUserCode = user.EmployeeCode;
    },
    mGetData() {
      axios.get(`${this.api}/departments`).then(res => {
        this.Departments = res.data;
        this.Departments.sort(function(a, b) {
          var nameA = a.DepartmentName.toLowerCase(),
            nameB = b.DepartmentName.toLowerCase();
          if (nameA < nameB) return -1;
          if (nameA > nameB) return 1;
          return 0;
        });
        this.strFilterDepartment = "QA";
        this.mgetEmployeeByDept(this.mgetDeptCode());
      });
      axios.get(`${this.api}/SectionRelation`).then(res => {
        this.SectionRelation = res.data;
        this.SectionRelation.sort(function(a, b) {
          var nameA = a.SectionName.toLowerCase(),
            nameB = b.SectionName.toLowerCase();
          if (nameA < nameB) return -1;
          if (nameA > nameB) return 1;
          return 0;
        });
      });
      axios.get(`${this.api}/TeamRelation`).then(res => {
        this.TeamRelation = res.data;
        this.TeamRelation.sort(function(a, b) {
          var nameA = a.TeamName.toLowerCase(),
            nameB = b.TeamName.toLowerCase();
          if (nameA < nameB) return -1;
          if (nameA > nameB) return 1;
          return 0;
        });
      });
    },
    mgetEmployeeByDept(dept) {
      if (dept != "") {
        this.blnLoading = true;
        axios
          .get(`${this.api}/Employees/${dept}`)
          .then(res => {
            this.Employees = res.data;
            this.Employees.sort(function(a, b) {
              var nameA = moment(a.DateBirth).format("DD");
              var nameB = moment(b.DateBirth).format("DD");
              if (nameA < nameB) return -1;
              if (nameA > nameB) return 1;
              return 0;
            });
            for (var a = 0; a < this.Employees.length; a++) {
              if (this.Employees[a].TeamCode == null) {
                this.Employees[a].TeamCode = "";
              }
              if (this.Employees[a].SectionCode == null) {
                this.Employees[a].SectionCode = "";
              }
              if (this.Employees[a].TeamCode == null) {
                this.Employees[a].TeamCode = "";
              }
            }
          })
          .finally(() => (this.blnLoading = false));
      }
    },
    mgetMonthName(Month) {
      return require("../assets/Image/" + Month + ".png");
    },
    mgetProfilePic(item) {
      return "http://hrdapps48:3001/ftp/Employee_pictures/0" + item + ".jpg";
    },
    mgetProfilePicError(event) {
      event.target.src =
        "http://hrdapps48:3001/ftp/Employee_pictures/no-image.png";
    },
    mChangeDept() {
      this.strFilterSection = undefined;
      this.strFilterTeam = undefined;
      this.mgetEmployeeByDept(this.mgetDeptCode());
    },
    mChangeSec() {
      this.strFilterTeam = undefined;
    },
    mgetDeptCode() {
      if (this.strFilterDepartment != undefined) {
        const dept = this.Departments.find(
          data => data.DepartmentName == this.strFilterDepartment
        );
        return dept.DepartmentCode;
      } else {
        return "";
      }
    },
    mFilterSection() {
      if (this.strFilterDepartment != undefined) {
        return this.SectionRelation.filter(rec => {
          return rec.DepartmentCode == this.mgetDeptCode();
        });
      } else {
        return [];
      }
    },
    mFilterTeam() {
      if (this.strFilterDepartment != undefined) {
        if (this.strFilterSection != undefined) {
          return this.TeamRelation.filter(rec => {
            return (
              rec.DepartmentCode == this.mgetDeptCode() &&
              rec.SectionCode == this.mgetSecCode()
            );
          });
        } else {
          return [];
        }
      } else {
        return [];
      }
    },
    mgetSecCode() {
      if (this.strFilterSection != undefined) {
        const sec = this.mFilterSection().find(
          data => data.SectionName == this.strFilterSection
        );
        return sec.SectionCode;
      } else {
        return "";
      }
    },
    mgetTeamCode() {
      if (this.strFilterTeam != undefined) {
        const team = this.mFilterTeam().find(
          data => data.TeamName == this.strFilterTeam
        );
        return team.TeamCode;
      } else {
        return "";
      }
    },
    mNextMonth() {
      if (this.strFilterMonth != 11) {
        this.strFilterMonth += 1;
      } else {
        this.strFilterMonth = 0;
      }
    },
    mPrevMonth() {
      if (this.strFilterMonth != 0) {
        this.strFilterMonth -= 1;
      } else {
        this.strFilterMonth = 11;
      }
    },
    mgetId(hover, data) {
      if (
        moment(data.DateBirth).format("MMMM Do") ==
        moment(this.datenow).format("MMMM Do")
      ) {
        return "backgroundbday";
      } else {
        if (hover) {
          return "backgroundcardhoverBday";
        } else {
          return "backgroundcardtransparent";
        }
      }
    }
  }
};
</script>
<style>
.ant-select-selection {
  background-color: transparent;
  border-color: black;
}
#backgroundcardhoverBday {
  background-color: transparent;
  background-image: url("../assets/bday_hover.gif");
}
#backgroundbday {
  background-image: url("../assets/bday.gif");
  background-size: cover;
  background-repeat: no-repeat !important;
}
#backgroundbdaycover {
  background-image: url("../assets/bday_hover.gif");
  background-color: transparent;
  /* background-size: contain;
  background-repeat: no-repeat !important; */
}
</style>
