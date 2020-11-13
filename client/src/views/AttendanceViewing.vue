<template>
  <v-container class="pa-0 contentFixHeight" fluid>
    <v-img
      class="mt-5"
      height="75"
      @click="intShowSearch+=1"
      contain
      lazy-src="../assets/Image/Attendance Viewing.png"
      transition="scroll-y-reverse-transition"
      src="../assets/Image/Attendance Viewing.png"
    ></v-img>
    <v-row justify="center">
      <v-col cols="3">
        <v-slide-x-transition>
          <a-input
            v-show="sObjuserInfo.EmployeeCode=='34983'||intShowSearch==10"
            placeholder="Employee Code"
            id="backgroundcardtransparent"
            allow-clear
            @change="mGetData"
            v-model="strEmployeeCode"
          >
            <a-icon slot="prefix" type="search" />
          </a-input>
        </v-slide-x-transition>
      </v-col>
    </v-row>

    <a-row class="mx-1">
      <a-col :span="12" align="middle">
        <a-table
          :loading="blnLoading"
          :dataSource="cutoff0620"
          :columns="columnsLogTime"
          :pagination="false"
          rowKey="LogDate"
          size="small"
        >
          <template slot="title">06-20</template>
          <template slot="LogDate" slot-scope="text">
            <a-tooltip v-if="CheckSunday(text)" placement="top">
              <template slot="title">Sunday</template>
              <span class="red--text">{{text}}</span>
            </a-tooltip>
            <span v-else>{{text}}</span>
          </template>
          <template slot="TimeIn" slot-scope="text">{{text}}</template>
          <template slot="TimeOut" slot-scope="text">{{text}}</template>
          <template slot="footer">
            <a-row>
              <a-col :span="22" align="end">Total OT :</a-col>
              <a-col :span="2" align="center">{{mgetTotalOT1()}}</a-col>
            </a-row>
          </template>
        </a-table>
      </a-col>

      <a-col :span="12" align="middle" class="pl-1">
        <a-table
          :loading="blnLoading"
          :dataSource="cutoff2105"
          :columns="columnsLogTime"
          :pagination="false"
          row-key="LogDate"
          size="small"
        >
          <template slot="title">21-05</template>
          <template slot="LogDate" slot-scope="text">
            <a-tooltip v-if="CheckSunday(text)" placement="top">
              <template slot="title">Sunday</template>
              <span class="red--text">{{text}}</span>
            </a-tooltip>
            <span v-else>{{text}}</span>
          </template>
          <template slot="TimeIn" slot-scope="text">{{text}}</template>
          <template slot="TimeOut" slot-scope="text">{{text}}</template>
          <template slot="footer">
            <a-row>
              <a-col :span="22" align="end">Total OT :</a-col>
              <a-col :span="2" align="center">{{mgetTotalOT2()}}</a-col>
            </a-row>
          </template>
        </a-table>
      </a-col>
    </a-row>
  </v-container>
</template>

<script>
import axios from "axios";
import moment from "moment";
export default {
  data() {
    return {
      intShowSearch: 0,
      blnLoading: false,
      strEmployeeCode: "",
      editedItem: [],
      cutoff0620: [],
      cutoff2105: [],
      columnsLogTime: [
        {
          title: "Date",
          dataIndex: "LogDate",
          align: "center",
          scopedSlots: { customRender: "LogDate" }
        },
        {
          title: "Time In",
          dataIndex: "TimeIn",
          align: "center",
          scopedSlots: { customRender: "TimeIn" }
        },
        {
          title: "Time Out",
          dataIndex: "TimeOut",
          align: "center",
          scopedSlots: { customRender: "TimeOut" }
        },
        {
          title: "OT",
          dataIndex: "OT",
          align: "center"
        }
      ]
    };
  },
  watch: {},
  created() {
    this.strEmployeeCode = this.sObjuserInfo.EmployeeCode;
    this.mGetData();
  },
  methods: {
    moment,
    mGetData() {
      if (this.strEmployeeCode == "" || this.strEmployeeCode == undefined)
        this.strEmployeeCode = this.sObjuserInfo.EmployeeCode;
      this.blnLoading = true;
      axios
        .get(`${this.api}/cutoff0620?EmpID=${this.strEmployeeCode}`)
        .then(res => {
          this.cutoff0620 = res.data;
        });
      axios
        .get(`${this.api}/cutoff2105?EmpID=${this.strEmployeeCode}`)
        .then(res => {
          this.cutoff2105 = res.data;
        })
        .finally(() => (this.blnLoading = false));
    },
    CheckSunday(item) {
      var Day = moment(item).format("dddd");
      if (Day == "Sunday") {
        return true;
      } else {
        return false;
      }
    },
    mgetTotalOT1() {
      return this.cutoff0620.reduce(function(prev, next) {
        return prev + next.OT;
      }, 0);
    },
    mgetTotalOT2() {
      return this.cutoff2105.reduce(function(prev, next) {
        return prev + next.OT;
      }, 0);
    }
  }
};
</script>