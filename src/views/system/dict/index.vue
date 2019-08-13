<template>
  <div class="app-container">
    <el-tree
      :props="props"
      :load="loadNode"
      lazy
      show-checkbox>
    </el-tree>
    <tree-table :data="data" :columns="columns" border/>
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
      dictData: [],
      listLoading: true,
      query: {
        id: ''
      },
      dialogFormVisible: false,
      dialogStatus: '',
      dialogPvVisible: false,
      downloadLoading: false,
      props: {
        label: 'name',
        children: 'zones',
        isLeaf: 'leaf'
      },
      columns: [
        {
          text: "事件",
          value: "event",
          width: 200
        },
        {
          text: "ID",
          value: "id"
        }
      ],
      data: [
        {
          id: 0,
          event: "事件1",
          timeLine: 50,
          comment: "无"
        },
        {
          id: 1,
          event: "事件1",
          timeLine: 100,
          comment: "无",
          children: [
            {
              id: 2,
              event: "事件2",
              timeLine: 10,
              comment: "无"
            },
            {
              id: 3,
              event: "事件3",
              timeLine: 90,
              comment: "无",
              children: [
                {
                  id: 4,
                  event: "事件4",
                  timeLine: 5,
                  comment: "无"
                },
                {
                  id: 5,
                  event: "事件5",
                  timeLine: 10,
                  comment: "无"
                },
                {
                  id: 6,
                  event: "事件6",
                  timeLine: 75,
                  comment: "无",
                  children: [
                    {
                      id: 7,
                      event: "事件7",
                      timeLine: 50,
                      comment: "无",
                      children: [
                        {
                          id: 71,
                          event: "事件71",
                          timeLine: 25,
                          comment: "xx"
                        },
                        {
                          id: 72,
                          event: "事件72",
                          timeLine: 5,
                          comment: "xx"
                        },
                        {
                          id: 73,
                          event: "事件73",
                          timeLine: 20,
                          comment: "xx"
                        }
                      ]
                    },
                    {
                      id: 8,
                      event: "事件8",
                      timeLine: 25,
                      comment: "无"
                    }
                  ]
                }
              ]
            }
          ]
        }
      ]
    }
  },
  created() {

  },
  methods: {
    loadNode(node, resolve) {
      console.log(node)
      if (node.level === 0) {
        this.listLoading = true
        getDictById().then(res => {
          this.dictData = res.data
          return resolve([{ name: res.data[0].name }]);
        })
        
      }
      console.log(node)
      if(node.level >= 1) {
        getDictByPid({pid: node.id}).then(res => {
          const data = [];
          for(var i = 0; i < res.data.length; i++) {
            data.push({
              name: res.data[i].name,
              id: res.data[i].id,
              leaf: res.data[i].haveChild === 1?false:true
            })
          }
          resolve(data)
        })
      }
    }
  }
}
</script>
