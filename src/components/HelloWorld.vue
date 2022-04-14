<template>
    <div :class="langCss">
        <div class="vue-css">
            <h1>{{ $spt('你好，世界') }}</h1>
            <el-button @click="switchLang('en')">{{ $spt('切换英文') }}</el-button>
            <el-button @click="switchLang('zh')">{{ $spt('切换中文') }}</el-button>
            <!-- title演示↑ -->
            <hr>
        </div>
        <el-button type="primary" :loading="true">{{ $spt('加载中') }}</el-button>
        <!-- elementui-dialog -->
        <el-button type="text" @click="dialogVisible = true">{{ $spt('点击') }}</el-button>
        <el-dialog :visible.sync="dialogVisible" width="30%" :before-close="handleClose">
            <span>{{ $spt('这是一条信息') }}。</span>
            <span slot="footer" class="dialog-footer">
                <el-button @click="dialogVisible = false">取消</el-button>
                <el-button type="primary" @click="dialogVisible = false">确认</el-button>
            </span>
        </el-dialog>
      <div class="block">
        <el-date-picker
            v-model="value1"
            type="daterange"
            range-separator="至"
            start-placeholder="开始日期"
            end-placeholder="结束日期">
        </el-date-picker>
      </div>
    </div>
</template>


<script>
export default {
    name: 'HelloWorld',
    data() {
        return {
            value1: '',
            langCss: window.localStorage.getItem('lang') || 'cn',
            dialogVisible: false,
            value: '',
            date: '',
            tableData: []
        }
    },
    methods: {
        switchLang(lang) {
            this.$i18n.locale = lang
            // 把语言保存在localStorage中
            localStorage.setItem('lang', lang)
            // 切换父级class
            this.langCss = lang
        },
        handleClose(done) {
            this.$confirm(this.$t('message.confirm')) // js内部切换
                .then(() => {
                    done()
                })
                .catch(() => {})
        },
    },

}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
h3 {
  margin: 40px 0 0;
}
ul {
  list-style-type: none;
  padding: 0;
}
li {
  display: inline-block;
  margin: 0 10px;
}
a {
  color: #42b983;
}
</style>
