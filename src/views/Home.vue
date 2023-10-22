<template>
  <div>
    <v-stepper mobile :items="['选择表格', '发送配置', '邮件内容', '变量替换', '发送']">
      <template v-slot:item.1>
        <v-card title="选择要使用的表格" flat>
          <v-combobox label="使用的表格" v-model="tableId" :items="tableList" item-title="name" item-value="id"
            variant="solo-inverted"></v-combobox>
        </v-card>
      </template>

      <template v-slot:item.2>
        <v-card title="配置发送信息" flat>

          <v-form fast-fail>
            <v-text-field clearable :rules="[rules.required]" v-model="apiUser" hint="在 SendCloud 配置的 API User"
              label="API User"></v-text-field>
            <v-text-field clearable :rules="[rules.required]" v-model="apiKey" hint="在 SendCloud 配置的 API Key"
              label="API Key"></v-text-field>
            <v-text-field clearable :rules="[rules.required]" v-model="from" hint="收件人侧看到的发件人名"
              label="发件人"></v-text-field>
            <v-text-field clearable :rules="[rules.required]" v-model="fromAddress" hint="收件人侧看到的发件地址"
              label="发件地址"></v-text-field>
          </v-form>

        </v-card>
      </template>

      <template v-slot:item.3>
        <v-card title="配置邮件内容" flat>
          <v-form fast-fail>
            <v-text-field clearable :rules="[rules.required]" v-model="subject" hint="收件人看到的邮件标题，可用 #1~#6 表示变量，会被替换为对应的列的内容。"
              label="邮件标题"></v-text-field>
          </v-form>
        </v-card>
      </template>
      <template v-slot:item.4>
        <v-card title="Step 4" flat>...</v-card>
      </template>
      <template v-slot:item.5>
        <v-card title="Step 5" flat>...</v-card>
      </template>
    </v-stepper>
  </div>
</template>

<script setup>
import { bitable } from '@lark-base-open/js-sdk';
import { ref } from 'vue'

const tableList = ref([]);
const tableId = ref(null);
const apiUser = ref(null);
const apiKey = ref(null)
const from = ref(null);
const fromAddress = ref(null);
const subject = ref(null);

const rules = {
  required: value => !!value || '此项目必填'
}
bitable.base.getTableMetaList().then(res => {
  tableList.value = res;
})
</script>
