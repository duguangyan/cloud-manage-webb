<template>
  <div class="app-container">
  <el-table
    :data="dictData"
    style="width: 100%"
    row-key="id"
    border
    lazy
    :load="load"
    :tree-props="{children: 'children', hasChildren: 'hasChildren'}">
    <el-table-column
      prop="name"
      label="姓名"
      width="180">
    </el-table-column>
  </el-table>
</div>
</template>

<script>
import { getDict, getDictById, getDictByPid } from '@/api/dict'
import waves from '@/directive/waves' // waves directive
import { parseTime } from '@/utils'
import Pagination from '@/components/Pagination' // secondary package based on el-pagination
import treeTable from "@/components/TreeTable";

export default {
  name: 'Dict',
  components: { treeTable },
  data() {
    return {
      dictData: [
        {
          id: 1,
          name: ''
        }
      ],
      listLoading: true,
      query: {
        id: ''
      },
      dialogFormVisible: false,
      dialogStatus: '',
      dialogPvVisible: false,
      downloadLoading: false,
      tableData1: [{
          id: 1,
          date: '2016-05-02',
          name: '王小虎',
          address: '上海市普陀区金沙江路 1518 弄'
        }, {
          id: 2,
          date: '2016-05-04',
          name: '王小虎',
          address: '上海市普陀区金沙江路 1517 弄'
        }, {
          id: 3,
          date: '2016-05-01',
          name: '王小虎',
          address: '上海市普陀区金沙江路 1519 弄',
          hasChildren: true
        }, {
          id: 4,
          date: '2016-05-03',
          name: '王小虎',
          address: '上海市普陀区金沙江路 1516 弄'
        }]
    }
  },
  created() {
     this.getDictById()
  },
  methods: {
    getDictById() {
      getDictById().then(res => {
        this.dictData.id = res.date[0].id
        this.dictData.name = res.data[0].name
      })
    },
    load(tree, treeNode, resolve) {
      console.log('load')
      console.log(tree)
      getDictByPid({
        pid: treeNode.id
      }).then(res => {
        let data = []
        for(let i = 0; i < res.data.length; i++) {
          data.push({
            id: res.data[i].id,
            name: res.data[i].name
          })
        }
        resolve(data)
      })
    }
  }
}
</script>
