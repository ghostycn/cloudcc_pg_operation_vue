<template>
  <div id="app">
    <el-container>
      <el-header style="height: 100px;">
        <el-form :inline="true" :model="formInline" class="demo-form-inline" size="mini">
          <el-form-item label="组织id">
            <el-input v-model="formInline.organization_id" placeholder="精准搜索"></el-input>
          </el-form-item>
          <el-form-item label="组织名称">
            <el-input v-model="formInline.organization_name" placeholder="模糊搜索"></el-input>
          </el-form-item>
          <el-form-item label="登录账号">
            <el-input v-model="formInline.login_username" placeholder="精准搜索"></el-input>
          </el-form-item>
          <el-form-item label="应用环境(必选)">
            <el-select v-model="formInline.app_domain" placeholder="应用环境">
              <el-option v-for="app_domain in formInline.app_domain_list" label="" v-bind:value="app_domain">
              </el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="应用域">
            <el-select v-model="formInline.domain" placeholder="应用域">
              <el-option v-for="domain in formInline.domain_list" label="" v-bind:value="domain"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item>
            <el-button type="primary" @click="sendAjaxByGet">查询</el-button>
          </el-form-item>
        </el-form>
      </el-header>
      <el-main>
        <el-table :data="tableData" style="width: 100%;height: 100%;">
          <el-table-column type="expand">
            <template slot-scope="props">
              <el-form label-position="left" inline class="demo-table-expand">
                <el-form-item label="组织名称:">
                  <span>{{ props.row.organization_name }}</span>
                </el-form-item>
                <el-form-item label="组织 ID:">
                  <span ref="organization_id">{{ props.row.organization_id }}</span>
                </el-form-item>
                <el-form-item label="所属域名:">
                  <span>{{ props.row.domain }}</span>
                </el-form-item>
                <el-form-item label="最大连接数:">
                  <span ref="max_connection">{{ props.row.max_connection }}</span>
                  <input ref="new_max_connection" type="text" style="display:none;">
                  <a class="fa-a fa-a-left" href="#">
                    <i class="fa fa-pencil" aria-hidden="true" @click="handleEdit_MC"></i>
                  </a>
                  <a class="fa-a" href="#">
                    <i class="fa fa-save" aria-hidden="true" @click="handleSave_MC"></i>
                  </a>
                </el-form-item>
                <el-form-item label="数据库名称:">
                  <span>{{ props.row.db_name }}</span>
                </el-form-item>
                <el-form-item label="数据库 IP:">
                  <span>{{ props.row.db_ip }}</span>
                </el-form-item>
                <el-form-item label="cloudcc许可时间:">
                  <span>{{ props.row.licence_cloudcc }}</span>
                </el-form-item>
                <el-form-item label="cloudcc许可数量:">
                  <span>{{ props.row.licence_count }}</span>
                </el-form-item>
                <el-form-item label="partner许可时间:">
                  <span>{{ props.row.licence_partner }}</span>
                </el-form-item>
                <el-form-item label="partner许可数量:">
                  <span>{{ props.row.licence_partner_count }}</span>
                </el-form-item>
                <el-form-item label="超时时间:">
                  <span ref="query_timeout">{{ props.row.org_timeout }}</span>
                  <input ref="new_query_timeout" type="text" style="display:none;">
                  <a class="fa-a fa-a-left" href="#">
                    <i class="fa fa-pencil" aria-hidden="true" @click="handleEdit_QT"></i>
                  </a>
                  <a class="fa-a" href="#">
                    <i class="fa fa-save" aria-hidden="true" @click="handleSave_QT"></i>
                  </a>
                </el-form-item>
              </el-form>
            </template>
          </el-table-column>
          <el-table-column label="序号" prop="id">
          </el-table-column>
          <el-table-column label="组织名称" prop="organization_name">
          </el-table-column>
          <el-table-column label="组织id" prop="organization_id">
          </el-table-column>
          <el-table-column label="所属域" prop="domain">
          </el-table-column>
          
        </el-table>
      </el-main>
    </el-container>
  </div>
</template>

<script>
export default {
  name: 'app',
  data() {
        return {
          formInline: {
            organization_id: '',
            organization_name: '',
            login_username: '',
            app_domain: 'hd1',
            app_domain_list: ['hd1', 'us1'],
            domain: "",
            domain_list: [],
          },
          tableData: [],
        }
      },

      mounted() {
        this.sendAjax();
        console.log('200')
      },
      methods: {
        sendAjax() {
          this.$axios.get('http://47.96.250.184:8001/domain')
            .then(res => {

              Array.from(res.data);
              const res_list = new Array();
              res_list.push("")
              for (let index = 0; index < Array.from(res.data).length; index++) {
                const element = Array.from(res.data)[index];
                res_list.push(element)
              }
              this.formInline.domain_list = res_list;
            })
            .catch(err => {
              console.error(err);
              alert("数据库连接失败，请稍后再试")
            })
        },
        sendAjaxByGet() {
          this.$axios.get('http://47.96.250.184:8001/wudi', {

            params: {
              "app_domain": this.formInline.app_domain,
              "organization_id": this.formInline.organization_id,
              "organization_name": this.formInline.organization_name,
              "login_username": this.formInline.login_username,
              "domain": this.formInline.domain
            }
          })
            .then(res => {
              const res_list = new Array();
              for (let index = 0; index < Array.from(res.data).length; index++) {
                const element = Array.from(res.data)[index];
                let licence_partner_tmp = ""
                let licence_cloudcc_tmp = ""
                // console.log(element)
                if (element["begindate"]) {
                  licence_cloudcc_tmp = element["begindate"] + " - " + element["enddate"];
                }
                if (element["partner_begindate"]) {
                  licence_partner_tmp = element["partner_begindate"] + " - " + element["partner_enddate"];
                }
                const res_dict = {
                  id: element["rowno"],
                  organization_id: element["id"],
                  organization_name: element["orgname"],
                  domain: element["domain"],
                  db_name: element["dbindexname"],
                  db_ip: element["db_url"],
                  max_connection: element["connpool_max"],
                  licence_cloudcc: licence_cloudcc_tmp,
                  licence_count: element["count"],
                  licence_partner: licence_partner_tmp,
                  licence_partner_count: element["partner_count"],
                  org_timeout: element["querytimeout"]
                }

                res_list.push(res_dict);
              }
              this.tableData = res_list;
            })
            .catch(err => {
              console.error(err);
            })
        },
        handleEdit_MC() {
          console.log('click_mc')
          const mc_value = this.$refs.max_connection.innerHTML;
          this.$refs.max_connection.style.display = "none";
          this.$refs.new_max_connection.value = mc_value;
          this.$refs.new_max_connection.style.display = "inline-block";
        },
        handleEdit_QT() {
          console.log('click_qt')
          const qt_value = this.$refs.query_timeout.innerHTML;
          console.log(qt_value)
          this.$refs.query_timeout.style.display = "none";
          this.$refs.new_query_timeout.value = qt_value;
          this.$refs.new_query_timeout.style.display = "inline-block";

        },
        
        handleSave_MC(index, row) {
          const mc_value = this.$refs.new_max_connection.value;
          const r = /^\+?[1-9][0-9]*$/;
          if (!r.test(mc_value)) {
            this.$refs.new_max_connection.value = "请输入正整数";
          } else {
            this.$refs.new_max_connection.style.display = "none";
            this.$refs.max_connection.style.display = "inline-block";
            this.$refs.max_connection.innerHTML = mc_value;
            const organization_id = this.$refs.organization_id.innerHTML;
            console.log("数据校验成功!!!")
            const url = "http://47.96.250.184:8001/modify";
            this.$axios.get(url, {

              params: {
                "organization_id": organization_id,
                "new_max_connection": mc_value,
              }
            })
              .then(res => {
                console.log(res.data)
              })
              .catch(err => {
                console.error(err);
              })
          }
          
        },
        handleSave_QT(index, row) {
          const qt_value = this.$refs.new_query_timeout.value;
          const r = /^\+?[1-9][0-9]*$/;
          if (!r.test(qt_value)) {
            
            this.$refs.new_query_timeout.value = "请输入正整数";
          } else {
            this.$refs.new_query_timeout.style.display = "none";
            this.$refs.query_timeout.style.display = "inline-block";
            this.$refs.query_timeout.innerHTML = qt_value;
            const organization_id = this.$refs.organization_id.innerHTML;
            console.log("数据校验成功!!!")
            const url = "http://47.96.250.184:8001/modify";
            this.$axios.get(url, {

              params: {
                "organization_id": organization_id,
                "new_query_timeout": qt_value
              }
            })
              .then(res => {
                console.log(res.data)
              })
              .catch(err => {
                console.error(err);
              })
          }
        }
      }    
}
</script>

<style>
.demo-table-expand {
  font-size: 0;
}

.demo-table-expand label {
  width: 200px;
  color: #99a9bf;
}

.demo-table-expand .el-form-item {
  margin-right: 0;
  margin-bottom: 0;
  width: 50%;
}
.fa-a-left{
  margin-left: 7px;
}
</style>
