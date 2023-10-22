<template>
  <div>
    <v-stepper editable mobile :items="['选择表格', '发送配置', '邮件内容', '变量替换', '发送']" @update:model-value="onSteperChange">
      <template v-slot:item.1>
        <v-card title="选择要使用的表格" flat>
          <v-combobox label="使用的表格" v-model="tableId" :items="tableList" item-title="name" item-value="id"
            variant="solo-inverted"></v-combobox>
        </v-card>
      </template>

      <template v-slot:item.2>
        <v-card title="配置发送信息" flat>
          <v-form fast-fail>
            <v-text-field clearable required :rules="[rules.required]" v-model="apiUser" hint="在 SendCloud 配置的 API User"
              label="API User"></v-text-field>
            <v-text-field clearable required :rules="[rules.required]" v-model="apiKey" hint="在 SendCloud 配置的 API Key"
              label="API Key"></v-text-field>
            <v-text-field clearable required :rules="[rules.required]" v-model="from" hint="收件人侧看到的发件人名"
              label="发件人"></v-text-field>
            <v-text-field clearable required :rules="[rules.required]" v-model="fromAddress" hint="收件人侧看到的发件地址"
              label="发件地址"></v-text-field>
          </v-form>
        </v-card>
      </template>

      <template v-slot:item.3>
        <v-card title="配置邮件内容" flat>
          <v-form fast-fail>
            <v-text-field clearable required :rules="[rules.required]" v-model="subject"
              hint="收件人看到的邮件标题，可用 #1~#6 表示变量，会被替换为对应的列的内容。" label="邮件标题"></v-text-field>
            <quill-editor v-model:content="content" content-type="html" toolbar="essential" theme="snow"></quill-editor>
          </v-form>
        </v-card>
      </template>
      <template v-slot:item.4>
        <v-card title="配置变量" flat>
          <v-combobox label="变量 #1" placeholder="不选择则不替换" v-model="varOne" :items="fieldList" item-title="name"
            item-value="id" variant="solo-inverted"></v-combobox>
          <v-combobox label="变量 #2" placeholder="不选择则不替换" v-model="varTwo" :items="fieldList" item-title="name"
            item-value="id" variant="solo-inverted"></v-combobox>
          <v-combobox label="变量 #3" placeholder="不选择则不替换" v-model="varThree" :items="fieldList" item-title="name"
            item-value="id" variant="solo-inverted"></v-combobox>
          <v-combobox label="变量 #4" placeholder="不选择则不替换" v-model="varFour" :items="fieldList" item-title="name"
            item-value="id" variant="solo-inverted"></v-combobox>
          <v-combobox label="变量 #5" placeholder="不选择则不替换" v-model="varFive" :items="fieldList" item-title="name"
            item-value="id" variant="solo-inverted"></v-combobox>
          <v-combobox label="变量 #6" placeholder="不选择则不替换" v-model="varSix" :items="fieldList" item-title="name"
            item-value="id" variant="solo-inverted"></v-combobox>
        </v-card>
      </template>
      <template v-slot:item.5>
        <v-card title="配置发送参数" flat>
          <v-combobox label="收件人列" v-model="to" :items="fieldList" item-title="name" item-value="id"
            variant="solo-inverted"></v-combobox>

          <v-card-actions>
            <v-btn prepend-icon="mdi-checkbox-marked-circle" @click="sendEmail">
              发送
            </v-btn>
          </v-card-actions>
          <v-progress-linear indeterminate max="total" v-if="showProgress" v-model="progress" height="25">
            <strong>{{ progress }}/{{ total }}</strong>
          </v-progress-linear>
          <v-snackbar v-model="sendDone" multi-line>
            发送完成
            <template v-slot:actions>
              <v-btn color="red" variant="text" @click="sendDone = false">
                Close
              </v-btn>
            </template>
          </v-snackbar>
        </v-card>
      </template>

    </v-stepper>
  </div>
</template>

<script setup>
import { bitable } from '@lark-base-open/js-sdk';
import { ref } from 'vue'
import axios from "axios"

// basic table
const tableList = ref([]);
const tableId = ref(null);
// basic send config
const apiUser = ref(null);
const apiKey = ref(null)
const from = ref(null);
const fromAddress = ref(null);
// email basic info
const subject = ref(null);
const content = ref('<h1>Hi, 收件人</h1><p>这是邮件内容</p><p>你可以根据你的需要设置内容，并修改其样式。对于需要使用多维表格内容替换的，可使用 #1、#2 等替换，发送时将会自动替换为变量</p>')
// var settings
const varOne = ref(null);
const varTwo = ref(null);
const varThree = ref(null);
const varFive = ref(null);
const varFour = ref(null);
const varSix = ref(null);
const fieldList = ref([]);

// send to 
const to = ref(null);
const showProgress = ref(false);
const progress = ref(0);
const total = ref(0);
const sendDone = ref(false);

const rules = {
  required: value => !!value || '此项目必填'
}
bitable.base.getTableMetaList().then(res => {
  tableList.value = res;
})

const onSteperChange = res => {
  if (res == 3) {
    bitable.base.getTableById(tableId.value.id).then(table => {
      table.getFieldMetaList().then(fields => {
        fieldList.value = fields
      });
    });
  }
}

function template(base, item) {
  console.log(item,varOne,varTwo,varThree);
  return base.replace("#1", varOne.value ? item.fields[varOne.value.id][0].text : "")
    .replace("#2", varTwo.value ? item.fields[varTwo.value.id][0].text : "")
    .replace("#3", varThree.value ? item.fields[varThree.value.id][0].text : "")
    .replace("#4", varFour.value ? item.fields[varFour.value.id][0].text : "")
    .replace("#5", varFive.value ? item.fields[varFive.value.id][0].text : "")
    .replace("#6", varSix.value ? item.fields[varSix.value.id][0].text : "");
}

const sendEmail = () => {
  bitable.base.getTableById(tableId.value.id).then(table => {
    table.getRecords({ pageSize: 5000 }).then(items => {
      total.value = items.total;
      showProgress.value = true;
      items.records.map(item => {
        axios({
          "method": "POST",
          "url": "/api/send",
          "headers": {
            "Content-Type": "application/json; charset=utf-8"
          },
          "data": {
            "SENDER_NAME": from.value,
            "TO": item.fields[to.value.id][0].text,
            "CONTENT": template(content.value),
            "API_USER": apiUser.value,
            "API_KEY": apiKey.value,
            "SENDER_ADDRESS": fromAddress.value,
            "SUBJECT": template(subject.value)
          }
        }).then(res => {
          if (res.status == 200) {
            progress.value++;
          }

        }).catch(console.error)
      })

    })
  });
  console.log(123);
}
</script>
