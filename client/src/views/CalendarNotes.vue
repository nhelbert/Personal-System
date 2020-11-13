<template>
  <v-container class="pa-0 contentFixHeight" fluid>
    <v-img
      class="mt-5"
      height="75"
      transition="scroll-y-reverse-transition"
      contain
      lazy-src="../assets/Image/Calendar Notes.png"
      src="../assets/Image/Calendar Notes.png"
    ></v-img>
    <v-slide-y-transition>
      <a-calendar :value="dtCalendarDate" @select="mSelectDate">
        <a-row slot="headerRender" type="flex" justify="space-around">
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
              :lazy-src="mgetMonthName(dtCalendarDate)"
              :src="mgetMonthName(dtCalendarDate)"
            ></v-img>
            {{moment(dtCalendarDate).format("YYYY")}}
          </a-col>
          <a-col :span="2" align="middle">
            <a-tooltip placement="left">
              <template slot="title">Next Month</template>
              <a-button @click="mNextMonth()" icon="right" type="link" style="color:black"></a-button>
            </a-tooltip>
          </a-col>
        </a-row>

        <template slot="dateCellRender" slot-scope="value">
          <a-button
            v-show="moment(dtCalendarDate).format('L')==moment(value).format('L')"
            type="dashed"
            size="small"
            icon="plus-circle"
            @click="mAddNotes(value)"
          >Add New</a-button>

          <li v-for="item in mgetNotes(value)" :key="item.NotesDate">
            <a-badge
              :color="mgetColor(item.TitleID)"
              :text="mgetTitle(item.TitleID)"
              @click="mEditNotes(item)"
            />
            <!-- </a-popover> -->
          </li>
          <!-- </a-card> -->
        </template>
      </a-calendar>
    </v-slide-y-transition>

    <a-modal v-model="blnAddShow" :mask="false" :closable="false" centered :width="400">
      <p>
        <a-input-group compact class="mt-2">
          <a-input-number
            style="pointer-events: none; backgroundColor: #EEEEEE;font-size:15px;width:30%"
            placeholder="Type:"
            disabled
          />
          <a-select
            style="width:70%"
            showSearch
            placeholder="Select Type"
            v-model="objAddNotes.TitleID"
          >
            <a-select-option
              v-for="type in M_NotesTitle"
              :key="type.ID"
              :value="type.ID"
            >{{type.Title}}</a-select-option>
          </a-select>
        </a-input-group>
      </p>
      <p>
        <a-tooltip title="Descriptions" placement="left">
          <a-textarea
            placeholder="Descriptions"
            :auto-size="{ minRows: 3}"
            v-model="objAddNotes.Descriptions"
          />
        </a-tooltip>
      </p>

      <template slot="title">
        <a-row>
          <a-col :span="12">Add New Notes</a-col>
          <a-col :span="12" align="right">{{objAddNotes.NotesDate}}</a-col>
        </a-row>
      </template>
      <template slot="footer">
        <a-button key="back" @click="blnAddShow=false">Cancel</a-button>
        <a-button
          icon="save"
          key="submit"
          type="primary"
          :loading="blnConfirmLoading"
          @click="mInsertNotes()"
        >Add</a-button>
      </template>
    </a-modal>
    <a-modal v-model="blnUpdateShow" :mask="false" :closable="false" centered :width="400">
      <p>
        <a-input-group compact class="mt-2">
          <a-input-number
            style="pointer-events: none; backgroundColor: #EEEEEE;font-size:15px;width:30%"
            placeholder="Type:"
            disabled
          />
          <a-select style="width:70%" showSearch placeholder="Select Type" v-model="intTitleID">
            <a-select-option
              v-for="type in M_NotesTitle"
              :key="type.ID"
              :value="type.ID"
            >{{type.Title}}</a-select-option>
          </a-select>
        </a-input-group>
      </p>
      <p>
        <a-tooltip title="Descriptions" placement="left">
          <a-textarea
            placeholder="Descriptions"
            :auto-size="{ minRows: 3}"
            v-model="strDescriptions"
          />
        </a-tooltip>
      </p>
      <template slot="title">
        <a-row>
          <a-col :span="12">Update Notes</a-col>
          <a-col :span="12" align="right">
            <a-popconfirm
              title="Delete Notes ?"
              @confirm="mDeleteNotes()"
              okText="Yes"
              cancelText="No"
              placement="top"
            >
              <a-icon slot="icon" type="question-circle-o" />
              <a-tooltip title="Delete" placement="left">
                <a-icon theme="twoTone" twoToneColor="red" type="delete" />
              </a-tooltip>
            </a-popconfirm>
          </a-col>
        </a-row>
      </template>
      <template slot="footer">
        <a-button key="back" @click="blnUpdateShow=false">Cancel</a-button>
        <a-button
          icon="save"
          key="submit"
          type="primary"
          :loading="blnConfirmLoading"
          @click="mUpdateNotes()"
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
      datenow: new Date(),
      dtCalendarDate: moment(this.datenow),
      blnConfirmLoading: false,
      blnUpdateShow: false,
      blnAddShow: false,
      strDescriptions: "",
      intTitleID: 1,
      T_CalendarNotes: [],
      M_NotesTitle: [],
      objUpdateNotes: {},
      objAddNotes: {}
    };
  },
  watch: {},
  created() {
    this.mGetData();
    setInterval(this.mGetData, 1000);
  },
  methods: {
    moment,
    mgetMonthName(Month) {
      let mm = moment(Month).format("MMMM");
      return require("../assets/Image/" + mm + ".png");
    },
    mGetData() {
      const user = this.sObjuserInfo;
      let employeeCode = user.EmployeeCode;
      axios.get(`${this.api}/T_CalendarNotes/` + employeeCode).then(res => {
        this.T_CalendarNotes = res.data;
      });
      axios.get(`${this.api}/M_NotesTitle`).then(res => {
        this.M_NotesTitle = res.data;
      });
    },
    mgetId(hover) {
      if (hover) {
        return "backgroundcardhover";
      } else {
        return "backgroundcardtransparent";
      }
    },
    mNextMonth() {
      this.dtCalendarDate = moment(this.dtCalendarDate).add(1, "months");
    },
    mPrevMonth() {
      this.dtCalendarDate = moment(this.dtCalendarDate).add(-1, "months");
    },
    mSelectDate(value) {
      this.dtCalendarDate = value;
    },
    mgetNotes(date) {
      return this.T_CalendarNotes.filter(rec => {
        return moment(rec.NotesDate).format("L") == date.format("L");
      });
    },
    mgetTitle(id) {
      if (id != "") {
        let data = this.M_NotesTitle.find(rec => {
          return rec.ID == id;
        });
        if (data != undefined) {
          return data.Title;
        } else return "";
      } else {
        return "";
      }
    },
    mgetColor(id) {
      if (id != "") {
        let data = this.M_NotesTitle.find(rec => {
          return rec.ID == id;
        });
        if (data != undefined) {
          return data.Color;
        } else return "blue";
      } else {
        return "blue";
      }
    },
    mEditNotes(data) {
      this.strDescriptions = data.Descriptions;
      this.intTitleID = data.TitleID;
      this.objUpdateNotes = data;
      this.blnUpdateShow = true;
    },
    mAddNotes(data) {
      const user = this.sObjuserInfo;
      let employeeCode = user.EmployeeCode;
      this.objAddNotes = {};
      this.objAddNotes.TitleID = 3;
      this.objAddNotes.NotesDate = moment(data).format("L");
      this.objAddNotes.EmployeeCode = employeeCode;
      this.blnAddShow = true;
    },
    mInsertNotes() {
      let error = false;
      if (
        this.objAddNotes.Descriptions == "" ||
        this.objAddNotes.Descriptions == undefined
      ) {
        this.$notification.error({
          message: "Personal System",
          description: "Please input descriptions."
        });
        error = true;
      }

      if (error == false) {
        axios
          .post(`${this.api}/T_CalendarNotes_Insert`, this.objAddNotes)
          .then(res => {
            if (this.objAddNotes.EmployeeCode == res.data.EmployeeCode) {
              this.$notification.success({
                message: "Personal System",
                description: "Add Notes successful"
              });
              this.blnConfirmLoading = true;
              setTimeout(() => {
                this.blnAddShow = false;
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
    mUpdateNotes() {
      let error = false;
      if (this.strDescriptions == "") {
        this.$notification.error({
          message: "Personal System",
          description: "Please input descriptions."
        });
        error = true;
      }

      if (error == false) {
        this.objUpdateNotes.Descriptions = this.strDescriptions;
        this.objUpdateNotes.TitleID = this.intTitleID;
        axios
          .post(`${this.api}/T_CalendarNotes_Update`, this.objUpdateNotes)
          .then(res => {
            if (this.objUpdateNotes.Seq == res.data.Seq) {
              this.$notification.success({
                message: "Personal System",
                description: "Update Notes successful"
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
    mDeleteNotes() {
      axios
        .post(`${this.api}/T_CalendarNotes_Delete`, this.objUpdateNotes)
        .then(res => {
          if (this.objUpdateNotes.Seq == res.data.Seq) {
            this.$notification.info({
              message: "Personal System",
              description: "Delete notes successful"
            });
            this.blnUpdateShow = false;
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
