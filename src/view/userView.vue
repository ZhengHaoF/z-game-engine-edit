<template>
  <div>
    <a-menu mode="horizontal">
      <a-sub-menu key="info" disabled>
        <template #icon>
          <video-camera-add-outlined/>
        </template>
        <template #title>剧本编辑器</template>
      </a-sub-menu>

      <a-sub-menu key="edit">
        <template #icon>
          <form-outlined/>
        </template>
        <template #title>剧本编辑（edit）</template>
        <a-menu-item key="1">创建剧本</a-menu-item>
        <a-menu-item key="2">打开剧本</a-menu-item>
        <a-menu-item key="3">导出剧本</a-menu-item>
      </a-sub-menu>
      <a-sub-menu key="material">
        <template #icon>
          <highlight-outlined/>
        </template>
        <template #title>章节素材（material）</template>
        <a-menu-item-group title="角色列表（roleList）">
          <a-menu-item key="setting:1">立绘（img）</a-menu-item>
          <a-menu-item key="setting:2">头图（headImg）</a-menu-item>
        </a-menu-item-group>
        <a-menu-item key="setting:3">背景列表（backgroundList）</a-menu-item>
        <a-menu-item-group title="所有音乐（musicList）">
          <a-menu-item key="setting:3">Option 3</a-menu-item>
          <a-menu-item key="setting:4">Option 4</a-menu-item>
        </a-menu-item-group>
      </a-sub-menu>
    </a-menu>
    <a-row style="padding-left: 10px;padding-right: 10px">
      <a-col :span="4">
        <div>剧本名称</div>
        <a-menu :inlineIndent="5" mode="inline">
          <a-sub-menu key="sub1">
            <template #icon>
              <MailOutlined/>
            </template>
            <template #title>章节列表</template>
            <a-menu-item v-for="item in chapterList" :key="item.name" @click="getChapterInfo(item.name)">
              <div>
                {{ item.name }}
                <span class="info">{{ item.info }}</span>
              </div>
            </a-menu-item>
          </a-sub-menu>
        </a-menu>
      </a-col>
      <a-col v-if="chapterInfo.hasOwnProperty('name')" :span="20">
        <div style="padding: 20px">
          <a-tabs>
            <a-tab-pane key="1" tab="编辑">
              <a-form v-model="chapterInfo">
                <a-form-item label="名称">
                  <a-input v-model:value="chapterInfo.name"></a-input>
                </a-form-item>
                <a-form-item label="信息">
                  <a-textarea v-model:value="chapterInfo.info"></a-textarea>
                </a-form-item>
                <a-form-item label="角色">
                  <a-tag v-for="item in chapterInfo.material.roleList">
                    {{ item.name }}
                  </a-tag>
                </a-form-item>
                <a-table :columns="columns" :data-source="chapterInfo['node']" :defaultExpandAllRows="true" :pagination="false"
                         :scroll="{y:'45vh'}" row-key="id">
                  <template #bodyCell="{ column, record,index }">
                    <template v-if="column.key === 'number'">
                      {{ index + 1 }}
                    </template>
                    <template v-if="column.key === 'id'">
                      {{ record.id }}
                    </template>
                    <template v-if="column.key === 'background'">
                      {{ record.background.name }}
                    </template>
                    <template v-if="column.key === 'backgroundMusic'">
                      {{ record.music.backgroundMusic.name }}
                    </template>
                    <template v-if="column.key === 'roleMusic'">
                      {{ record.music.roleMusic.name }}
                    </template>
                    <template v-if="column.key === 'role'">
                      <a-tag v-for="tag in record.role.map((item)=>{return item.name})">
                        {{ tag }}
                      </a-tag>
                    </template>
                    <template v-if="column.key === 'edit'">
                      <a-button>编辑</a-button>
                    </template>
                  </template>
                  <template #expandedRowRender="{ record }">
                    <a-list size="small">
                      <a-list-item v-for="item in record.dialogue.content">
                        <a-tag>{{record.dialogue.name}}</a-tag>
                        {{ item }}
                      </a-list-item>
                    </a-list>
                  </template>
                </a-table>
              </a-form>
            </a-tab-pane>
            <a-tab-pane key="2" force-render tab="素材">素材管理器</a-tab-pane>
          </a-tabs>
        </div>
      </a-col>
    </a-row>
  </div>

</template>

<script lang="ts" setup>
import {onMounted, Ref, ref} from "vue";
import {MailOutlined, FormOutlined, HighlightOutlined, VideoCameraAddOutlined} from '@ant-design/icons-vue';


const columns = [
  {
    title: '节点',
    dataIndex: 'id',
    key: 'id',
  },
  {
    title: '背景图片',
    dataIndex: 'background',
    key: 'background',
  },
  {
    title: '背景音乐',
    key: 'backgroundMusic',
    dataIndex: 'music',
  },
  {
    title: '人物语音',
    key: 'roleMusic',
    dataIndex: 'music',
  }, {
    title: '人物',
    key: 'role',
    dataIndex: 'role',
  },
  {
    title: '操作',
    key: 'edit',
    dataIndex: 'edit',
  }
];

const scriptRow = {
  "name": "剧本名",
  "info": "剧本信息",
  "author": "作者",
  "chapter": [
    {
      "name": "测试章节",
      "info": "测试用的章节",
      "material": {
        "roleList": [
          {
            "name": "ZHF",
            "roleImg": "/assets/roleImg/栞那a_0_1891.png",
            "headImg": "/assets/headImg/extra_stand_dialog+pimg+6513.png"
          },
          {
            "name": "ZHF2",
            "roleImg": "/assets/roleImg/栞那a_0_1891.png",
            "headImg": "/assets/headImg/extra_stand_dialog+pimg+6513.png"
          }
        ],
        "backgroundList": [
          {
            "name": "bg1",
            "src": "/assets/backgroundImg/その他_プールA.png"
          }
        ],
        "musicList": {
          "role": [
            {
              "name": "ogg1",
              "src": "/assets/music/roleMusic/asumi111_019.ogg"
            }
          ],
          "background": [
            {
              "name": "bgm1",
              "src": "/assets/music/backgroundMusic/BGM01.mp3"
            }
          ],
          "material": [
            {
              "name": "名称",
              "src": "位置"
            }
          ]
        }
      },
      "node": [
        {
          "id": "1",
          "dialogue": {
            "name": "ZHF",
            "headImg": "",
            "content": [
              "你好世界",
              "我是ZHF",
              "这是一个测试项目",
              "我将在这里演示z-game-engine引擎的一些功能",
              "那个泳池是背景图",
              "对话左边的是我的头图（headImage）"
            ]
          },
          "role": [
            {
              "name": "ZHF",
              "status": "状态",
              "position": "right"
            }
          ],
          "background": {
            "name": "bg1"
          },
          "music": {
            "backgroundMusic": {
              "name": "bgm1"
            },
            "roleMusic": {
              "name": "人物音乐名"
            }
          }
        },
        {
          "id": "2",
          "dialogue": {
            "name": "ZHF",
            "headImg": "",
            "content": ["现在出现的是我的立绘（roleImage）"]
          },
          "role": [
            {
              "name": "ZHF",
              "status": "状态",
              "position": "left"
            }
          ],
          "background": {
            "name": "bg1"
          },
          "music": {
            "backgroundMusic": {
              "name": "bgm1"
            },
            "roleMusic": {
              "name": "人物音乐名"
            }
          }
        },
        {
          "id": "3",
          "dialogue": {
            "name": "ZHF",
            "headImg": "",
            "content": ["当然，右边也有一个人物位置"]
          },
          "role": [
            {
              "name": "ZHF",
              "status": "in",
              "position": "left"
            },
            {
              "name": "ZHF2",
              "status": "in",
              "position": "right"
            }
          ],
          "background": {
            "name": "bg1"
          },
          "music": {
            "backgroundMusic": {
              "name": "bgm1"
            },
            "roleMusic": {
              "name": "人物音乐名"
            }
          }
        },
        {
          "id": "4",
          "dialogue": {
            "name": "ZHF",
            "headImg": "",
            "content": ["现在播放的是人物语音测试，我也不知道讲的是啥"]
          },
          "role": [
            {
              "name": "ZHF",
              "status": "unchanged",
              "position": "left"
            },
            {
              "name": "ZHF2",
              "status": "unchanged",
              "position": "right"
            }
          ],
          "background": {
            "name": "bg1"
          },
          "music": {
            "backgroundMusic": {
              "name": "bgm1"
            },
            "roleMusic": {
              "name": "ogg1"
            }
          }
        },
        {
          "id": "5",
          "dialogue": {
            "name": "ZHF",
            "headImg": "",
            "content": [
              "好了，到这里就结束了",
              "感谢你的观看",
              "拜拜~"
            ]
          },
          "role": [
            {
              "name": "ZHF",
              "status": "unchanged",
              "position": "left"
            },
            {
              "name": "ZHF2",
              "status": "out",
              "position": "right"
            }
          ],
          "background": {
            "name": "bg1"
          },
          "music": {
            "backgroundMusic": {
              "name": "bgm1"
            },
            "roleMusic": {
              "name": ""
            }
          }
        }
      ]
    }
  ]
}


/**
 * 章节列表
 */
const chapterList = ref(
    [
      {
        name: '标题',
        info: "信息",
      },
      {
        name: '标题1',
        info: "信息",
      }
    ]
);

/**
 * 获取章节列表
 */
const getChapterList = function () {
  chapterList.value = scriptRow.chapter.map((item) => {
    return {
      "name": item.name,
      "info": item.info,
    }
  })
}


/**
 * 章节信息
 */
const chapterInfo: Ref = ref({});
/**
 * 获取章节信息
 * @param name 章节名
 */
const getChapterInfo = function (name) {
  chapterInfo.value = scriptRow.chapter.filter((item) => {
    if (item.name === name) {
      return true;
    }
  })[0]
}


/**
 * 搜索功能
 * @param input
 * @param option
 */
const filterOption = (input: string, option: any) => {
  return option.value.toLowerCase().indexOf(input.toLowerCase()) >= 0;
};

onMounted(() => {
  getChapterList();
})
</script>

<style lang="scss" scoped>

</style>
