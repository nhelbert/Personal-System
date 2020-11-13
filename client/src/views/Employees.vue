<template>
  <v-container class="pa-0 contentFixHeight" fluid>
    <v-img
      class="mt-5"
      transition="scroll-y-reverse-transition"
      height="75"
      contain
      lazy-src="../assets/Image/HRD Employees.png"
      src="../assets/Image/HRD Employees.png"
    ></v-img>

    <v-row justify="center">
      <v-col cols="3">
        <a-input
          placeholder="Search"
          id="backgroundcardtransparent"
          allow-clear
          v-model="strFilterEmployeeNameCode"
        >
          <a-icon slot="prefix" type="search" />
        </a-input>
      </v-col>
    </v-row>
    <a-table
      :loading="blnLoading"
      :dataSource="mFilterAll()"
      :columns="columnsHRDEmployee"
      rowKey="_id"
      size="small"
      class="mx-1"
    >
      <div
        slot="department_F"
        style="padding: 8px"
        @keyup.enter="mFilterSearch(confirm)"
        slot-scope="{confirm}"
      >
        <a-select
          v-ant-ref="c => searchInput = c"
          showSearch
          placeholder="Select Department"
          allowClear
          v-model="strFilterDepartment"
          style="width: 188px; margin-bottom: 8px; display: block;"
        >
          <a-select-option v-for="dep in Departments" :key="dep" :value="dep">{{dep}}</a-select-option>
        </a-select>
        <a-button
          type="primary"
          @click="mFilterSearch(confirm)"
          block
          icon="filter"
          size="small"
        >Filter</a-button>
      </div>
      <div
        slot="section_F"
        style="padding: 8px"
        @keyup.enter="mFilterSearch(confirm)"
        slot-scope="{confirm}"
      >
        <a-select
          v-ant-ref="c => searchInput = c"
          showSearch
          placeholder="Select Section"
          allowClear
          v-model="strFilterSection"
          style="width: 188px; margin-bottom: 8px; display: block;"
        >
          <a-select-option v-for="sec in Sections" :key="sec" :value="sec">{{sec}}</a-select-option>
        </a-select>
        <a-button
          type="primary"
          @click="mFilterSearch(confirm)"
          block
          icon="filter"
          size="small"
        >Filter</a-button>
      </div>
      <div
        slot="team_F"
        style="padding: 8px"
        @keyup.enter="mFilterSearch(confirm)"
        slot-scope="{confirm}"
      >
        <a-select
          v-ant-ref="c => searchInput = c"
          showSearch
          placeholder="Select Team"
          allowClear
          v-model="strFilterTeam"
          style="width: 188px; margin-bottom: 8px; display: block;"
        >
          <a-select-option v-for="team in Teams" :key="team" :value="team">{{team}}</a-select-option>
        </a-select>
        <a-button
          type="primary"
          @click="mFilterSearch(confirm)"
          block
          icon="filter"
          size="small"
        >Filter</a-button>
      </div>
      <div
        slot="designation_F"
        style="padding: 8px"
        @keyup.enter="mFilterSearch(confirm)"
        slot-scope="{confirm}"
      >
        <a-select
          v-ant-ref="c => searchInput = c"
          showSearch
          placeholder="Select Designation"
          allowClear
          v-model="strFilterDesignation"
          style="width: 188px; margin-bottom: 8px; display: block;"
        >
          <a-select-option v-for="desig in Designations" :key="desig" :value="desig">{{desig}}</a-select-option>
        </a-select>
        <a-button
          type="primary"
          @click="mFilterSearch(confirm)"
          block
          icon="filter"
          size="small"
        >Filter</a-button>
      </div>
      <div
        slot="status_F"
        style="padding: 8px"
        @keyup.enter="mFilterSearch(confirm)"
        slot-scope="{confirm}"
      >
        <a-select
          v-ant-ref="c => searchInput = c"
          showSearch
          placeholder="Select Status"
          allowClear
          v-model="strFilterStatus"
          style="width: 188px; margin-bottom: 8px; display: block;"
        >
          <a-select-option v-for="status in Status" :key="status" :value="status">{{status}}</a-select-option>
        </a-select>
        <a-button
          type="primary"
          @click="mFilterSearch(confirm)"
          block
          icon="filter"
          size="small"
        >Filter</a-button>
      </div>
      <a-icon
        slot="department_I"
        type="filter"
        :style="{ color: strFilterDepartment ? '#108ee9' : undefined }"
      />
      <a-icon
        slot="section_I"
        type="filter"
        :style="{ color: strFilterSection ? '#108ee9' : undefined }"
      />
      <a-icon
        slot="team_I"
        type="filter"
        :style="{ color: strFilterTeam ? '#108ee9' : undefined }"
      />
      <a-icon
        slot="designation_I"
        type="filter"
        :style="{ color: strFilterDesignation ? '#108ee9' : undefined }"
      />
      <a-icon
        slot="status_I"
        type="filter"
        :style="{ color: strFilterStatus ? '#108ee9' : undefined }"
      />
      <template slot="employee_code" slot-scope="text">
        <span v-if="strFilterEmployeeNameCode">
          <template
            v-for="(fragment, i) in text.toString().split(new RegExp(`(?<=${strFilterEmployeeNameCode})|(?=${strFilterEmployeeNameCode})`, 'i'))"
          >
            <mark
              v-if="fragment.toLowerCase() === strFilterEmployeeNameCode.toLowerCase()"
              :key="i"
              class="highlight"
            >{{fragment}}</mark>
            <template v-else>{{fragment}}</template>
          </template>
        </span>
        <template v-else>{{text}}</template>
      </template>

      <template slot="full_name" slot-scope="text">
        <span v-if="strFilterEmployeeNameCode">
          <template
            v-for="(fragment, i) in text.toString().split(new RegExp(`(?<=${strFilterEmployeeNameCode})|(?=${strFilterEmployeeNameCode})`, 'i'))"
          >
            <mark
              v-if="fragment.toLowerCase() === strFilterEmployeeNameCode.toLowerCase()"
              :key="i"
              class="highlight"
            >{{fragment}}</mark>
            <template v-else>{{fragment}}</template>
          </template>
        </span>
        <template v-else>{{text}}</template>
      </template>
      <template slot="action" slot-scope="text">
        <a-tooltip placement="left">
          <template slot="title">View Details</template>
          <a-icon type="eye" @click="mGetDetails(text)" />
        </a-tooltip>
      </template>
      <template slot="footer">
        <a-row>
          <a-col :span="12">Total Record(s) : {{mFilterAll().length}}</a-col>
          <a-col :span="12"></a-col>
        </a-row>
      </template>
    </a-table>
    <a-drawer
      placement="right"
      title="Employee Details"
      @close="blnDrawerView=false "
      :visible="blnDrawerView"
      width="500"
    >
      <a-tabs defaultActiveKey="1" class="text-center">
        <a-tab-pane key="1">
          <span slot="tab">
            <a-icon type="idcard" />Employee
          </span>
          <a-descriptions
            size="small"
            :column="2"
            title="Employee Informations"
            bordered
            layout="vertical"
          >
            <a-descriptions-item label="Employee Code">{{objViewDetails.employee_code}}</a-descriptions-item>
            <a-descriptions-item label="NickName">{{objViewDetails.nick_name}}</a-descriptions-item>
            <a-descriptions-item label="Name" span="2">{{objViewDetails.full_name}}</a-descriptions-item>
            <a-descriptions-item label="Department">{{objViewDetails.department}}</a-descriptions-item>
            <a-descriptions-item label="Section">{{objViewDetails.section}}</a-descriptions-item>
            <a-descriptions-item label="Team">{{objViewDetails.team}}</a-descriptions-item>
            <a-descriptions-item label="Position">{{objViewDetails.position}}</a-descriptions-item>
            <a-descriptions-item label="Designation">{{objViewDetails.designation}}</a-descriptions-item>
            <a-descriptions-item label="Status">{{objViewDetails.status}}</a-descriptions-item>
            <a-descriptions-item label="Date Hired">{{objViewDetails.dateHired}}</a-descriptions-item>
            <a-descriptions-item label="Date Regular">{{objViewDetails.dateRegular}}</a-descriptions-item>
          </a-descriptions>
        </a-tab-pane>
        <a-tab-pane key="2">
          <span slot="tab">
            <a-icon type="user" />Personal
          </span>
          <a-descriptions
            size="small"
            :column="2"
            title="Personal Informations"
            bordered
            layout="vertical"
          >
            <a-descriptions-item label="Gender">{{objViewDetails.gender}}</a-descriptions-item>
            <a-descriptions-item label="Date Birth">{{objViewDetails.dateBirth}}</a-descriptions-item>
            <a-descriptions-item label="Civil Status">{{objViewDetails.civilStatus}}</a-descriptions-item>
            <a-descriptions-item label="No. Children">{{objViewDetails.noChildren}}</a-descriptions-item>
            <a-descriptions-item label="Contact Number">{{objViewDetails.contactNumber}}</a-descriptions-item>
            <a-descriptions-item label="Attainment" span="2">{{objViewDetails.attainment}}</a-descriptions-item>
            <a-descriptions-item label="Course" span="2">{{objViewDetails.course}}</a-descriptions-item>
            <a-descriptions-item label="School" span="2">{{objViewDetails.school}}</a-descriptions-item>
            <a-descriptions-item label="Address" span="2">{{objViewDetails.address}}</a-descriptions-item>
            <a-descriptions-item
              label="Permanent Address"
              span="2"
            >{{objViewDetails.permanentaddress}}</a-descriptions-item>
            <a-descriptions-item label="Contact Person" span="2">{{objViewDetails.contactPerson}}</a-descriptions-item>
            <a-descriptions-item
              label="Contact Person Relation"
            >{{objViewDetails.contactPersonRelation}}</a-descriptions-item>
            <a-descriptions-item
              label="Contact Person Number"
            >{{objViewDetails.contactPersonNumber}}</a-descriptions-item>
            <a-descriptions-item label="Picture" span="2">
              <v-img
                :src="mgetProfilePic(objViewDetails.employee_code)"
                alt="Profile"
                aspect-ratio="1.7"
                contain
              ></v-img>
            </a-descriptions-item>
          </a-descriptions>
        </a-tab-pane>
        <a-tab-pane key="3">
          <span slot="tab">
            <a-icon type="desktop" />Computer
          </span>
          <a-descriptions
            size="small"
            :column="2"
            title="Computer Informations"
            bordered
            layout="vertical"
          >
            <a-descriptions-item label="Computer Number">{{objViewDetails.computerNumber}}</a-descriptions-item>
            <a-descriptions-item label="Computer Password">{{objViewDetails.computerPassword}}</a-descriptions-item>
            <a-descriptions-item
              label="Operating System"
              span="2"
            >{{objViewDetails.operatingSystem}}</a-descriptions-item>
            <a-descriptions-item label="Monitor Number">{{objViewDetails.monitorNumber}}</a-descriptions-item>
            <a-descriptions-item label="License 1">{{objViewDetails.license1}}</a-descriptions-item>
            <a-descriptions-item label="License 2">{{objViewDetails.license2}}</a-descriptions-item>
            <a-descriptions-item label="License 3">{{objViewDetails.license3}}</a-descriptions-item>
            <a-descriptions-item label="License 4">{{objViewDetails.license4}}</a-descriptions-item>
            <a-descriptions-item label="License 5">{{objViewDetails.license5}}</a-descriptions-item>
            <a-descriptions-item label="License 6">{{objViewDetails.license6}}</a-descriptions-item>
            <a-descriptions-item label="License 7">{{objViewDetails.license7}}</a-descriptions-item>
            <a-descriptions-item label="License 8">{{objViewDetails.license8}}</a-descriptions-item>
            <a-descriptions-item label="License 9">{{objViewDetails.license9}}</a-descriptions-item>
          </a-descriptions>
        </a-tab-pane>
      </a-tabs>
    </a-drawer>
  </v-container>
</template>

<script>
import axios from "axios";
import moment from "moment";
export default {
  data() {
    return {
      searchInput: null,
      search: "",
      blnDrawerView: false,
      blnLoading: false,
      strFilterEmployeeCode: "",
      strFilterEmployeeNameCode: "",
      strFilterDepartment: undefined,
      strFilterSection: undefined,
      strFilterTeam: undefined,
      strFilterDesignation: undefined,
      strFilterStatus: undefined,
      objViewDetails: [],
      HRDEmployee: [],
      Departments: [],
      Sections: [],
      Teams: [],
      Designations: [],
      Status: [],
      columnsHRDEmployee: [
        {
          title: "Employee Code",
          dataIndex: "employee_code",
          align: "center",
          scopedSlots: {
            customRender: "employee_code",
            filterDropdown: "employee_code_F",
            filterIcon: "employee_code_I"
          },
          onFilterDropdownVisibleChange: visible => {
            if (visible) {
              setTimeout(() => {
                this.searchInput.focus();
              });
            }
          }
        },
        {
          title: "Employee Name",
          dataIndex: "full_name",
          scopedSlots: {
            customRender: "full_name",
            filterDropdown: "full_name_F",
            filterIcon: "full_name_I"
          },
          onFilterDropdownVisibleChange: visible => {
            if (visible) {
              setTimeout(() => {
                this.searchInput.focus();
              });
            }
          }
        },
        {
          title: "Department Name",
          dataIndex: "department",
          scopedSlots: {
            customRender: "department",
            filterDropdown: "department_F",
            filterIcon: "department_I"
          },
          onFilterDropdownVisibleChange: visible => {
            if (visible) {
              setTimeout(() => {
                this.searchInput.focus();
              });
            }
          }
        },
        {
          title: "Section Name",
          dataIndex: "section",
          scopedSlots: {
            customRender: "section",
            filterDropdown: "section_F",
            filterIcon: "section_I"
          },
          onFilterDropdownVisibleChange: visible => {
            if (visible) {
              setTimeout(() => {
                this.searchInput.focus();
              });
            }
          }
        },
        {
          title: "Team Name",
          dataIndex: "team",
          scopedSlots: {
            customRender: "team",
            filterDropdown: "team_F",
            filterIcon: "team_I"
          },
          onFilterDropdownVisibleChange: visible => {
            if (visible) {
              setTimeout(() => {
                this.searchInput.focus();
              });
            }
          }
        },
        {
          title: "Designation",
          dataIndex: "designation",

          scopedSlots: {
            customRender: "designation",
            filterDropdown: "designation_F",
            filterIcon: "designation_I"
          },
          onFilterDropdownVisibleChange: visible => {
            if (visible) {
              setTimeout(() => {
                this.searchInput.focus();
              });
            }
          }
        },
        {
          title: "Status",
          dataIndex: "status",
          scopedSlots: {
            customRender: "status",
            filterDropdown: "status_F",
            filterIcon: "status_I"
          },
          onFilterDropdownVisibleChange: visible => {
            if (visible) {
              setTimeout(() => {
                this.searchInput.focus();
                // this.searchInput.open();
              });
            }
          }
        },
        {
          title: "",
          key: "operation",
          scopedSlots: { customRender: "action" }
        }
      ]
    };
  },
  watch: {},
  created() {
    this.mGetData();
  },
  methods: {
    moment,
    mFilterAll() {
      if (this.HRDEmployee != undefined) {
        return this.HRDEmployee.filter(rec => {
          return (
            rec.department
              .toUpperCase()
              .includes(
                this.strFilterDepartment == undefined
                  ? ""
                  : this.strFilterDepartment.toUpperCase()
              ) &&
            rec.section
              .toUpperCase()
              .includes(
                this.strFilterSection == undefined
                  ? ""
                  : this.strFilterSection.toUpperCase()
              ) &&
            rec.team
              .toUpperCase()
              .includes(
                this.strFilterTeam == undefined
                  ? ""
                  : this.strFilterTeam.toUpperCase()
              ) &&
            rec.designation
              .toUpperCase()
              .includes(
                this.strFilterDesignation == undefined
                  ? ""
                  : this.strFilterDesignation.toUpperCase()
              ) &&
            rec.status
              .toUpperCase()
              .includes(
                this.strFilterStatus == undefined
                  ? ""
                  : this.strFilterStatus.toUpperCase()
              ) &&
            (rec.employee_code
              .toUpperCase()
              .includes(
                this.strFilterEmployeeNameCode == undefined
                  ? ""
                  : this.strFilterEmployeeNameCode.toUpperCase()
              ) ||
              rec.full_name
                .toUpperCase()
                .includes(
                  this.strFilterEmployeeNameCode == undefined
                    ? ""
                    : this.strFilterEmployeeNameCode.toUpperCase()
                ))
          );
        });
      } else {
        return [];
      }
    },
    mFilterSearch(confirm) {
      confirm();
    },
    mGetData() {
      this.blnLoading = true;
      axios
        .get(`${this.api}/HRDEmployee`)
        .then(res => {
          let data = res.data;
          this.HRDEmployee = data;
          for (var a = 0; a < data.length; a++) {
            let dep = data[a].department;
            let sec = data[a].section;
            let team = data[a].team;
            let desig = data[a].designation;
            let status = data[a].status;
            if (dep != "-") {
              if (this.Departments.indexOf(dep) == -1) {
                this.Departments.push(dep);
              }
            }
            if (sec != "-") {
              if (this.Sections.indexOf(sec) == -1) {
                this.Sections.push(sec);
              }
            }
            if (team != "-") {
              if (this.Teams.indexOf(team) == -1) {
                this.Teams.push(team);
              }
            }
            if (this.Designations.indexOf(desig) == -1) {
              this.Designations.push(desig);
            }
            if (this.Status.indexOf(status) == -1) {
              this.Status.push(status);
            }
          }

          this.Departments.sort();
          this.Sections.sort();
          this.Teams.sort();
          this.Designations.sort();
          this.Status.sort();
          this.Teams.sort();
        })

        .finally(() => (this.blnLoading = false));
    },
    mGetDetails(item) {
      this.objViewDetails = item;
      this.blnDrawerView = true;
    },
    mgetProfilePic(item) {
      return "http://hrdapps48:3001/ftp/Employee_pictures/0" + item + ".jpg";
    },
    mgetProfilePicError(event) {
      event.target.src =
        "http://hrdapps48:3001/ftp/Employee_pictures/no-image.png";
    }
  }
};
</script>
