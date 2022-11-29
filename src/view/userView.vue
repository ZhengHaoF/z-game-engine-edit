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
        <a-menu-item key="3" @click="outPutScript">导出剧本</a-menu-item>
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
                <a-table :columns="columns" :data-source="chapterInfo['node']" :defaultExpandAllRows="true"
                         :pagination="false"
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
                    <template v-if="column.key === 'role'">
                      <a-tag v-for="tag in record.role.map((item)=>{return item.name})">
                        {{ tag }}
                      </a-tag>
                    </template>
                    <template v-if="column.key === 'edit'">
                      <a-button @click="editModal = true;editFun(record)">编辑</a-button>
                    </template>
                  </template>
                  <template #expandedRowRender="{ record }">
                    <a-list size="small">
                      <a-list-item>
                        <div style="width: 100%;display: flex;font-weight: bolder">
                          <div style="flex: 2">
                            姓名
                          </div>
                          <div style="flex: 11">
                            文字
                          </div>
                          <div style="flex: 11">
                            语音
                          </div>
                        </div>
                      </a-list-item>
                      <a-list-item v-for="item in record.dialogue.content">
                        <div style="width: 100%;display: flex">
                          <div style="flex: 2">
                            <a-tag>{{ item.name }}</a-tag>
                          </div>
                          <div style="flex: 10">
                            <a-space> {{ item.text }}</a-space>
                          </div>
                          <div style="flex: 10">
                            <a-space> {{ item.roleMusic }}</a-space>
                          </div>
                          <div style="flex: 2">
                            <a-button type="primary" shape="circle" @click="playAudio(item.roleMusic)">
                              <template #icon><play-circle-outlined /></template>
                            </a-button>
                          </div>
                        </div>
                      </a-list-item>
                    </a-list>
                  </template>
                </a-table>
              </a-form>
            </a-tab-pane>
            <a-tab-pane key="2" force-render tab="素材">
              素材管理器
            </a-tab-pane>
          </a-tabs>
        </div>
      </a-col>
    </a-row>
    <a-modal width="80%" v-model:visible="editModal" title="编辑" @close="editModal=false">
      <a-form>
        <a-form-item label="背景图片">
          <a-select v-model:value="nodeRow.background.name" :filter-option="filterOption" show-search>
            <a-select-option v-for="bg in chapterInfo['material']['backgroundList']" :value="bg['name']">
              {{ bg['name'] }}
            </a-select-option>
          </a-select>
        </a-form-item>
        <a-form-item label="背景音乐">
          <a-select v-model:value="nodeRow.music.backgroundMusic.name" :filter-option="filterOption" show-search>
            <a-select-option v-for="bg in chapterInfo['material']['musicList']['background']" :value="bg['name']">
              {{ bg['name'] }}
            </a-select-option>
          </a-select>
        </a-form-item>
        <a-form-item label="对话">
          <a-list size="small" style="max-height: 200px;overflow: hidden;overflow-y: scroll">
            <a-list-item>
              <div style="width: 100%;display: flex;font-weight: bolder">
                <div style="flex: 2">
                  姓名
                </div>
                <div style="flex: 11">
                  文字
                </div>
                <div style="flex: 11">
                  语音
                </div>
              </div>
            </a-list-item>
            <a-list-item v-for="item in nodeRow.dialogue.content">
              <div style="width: 100%;display: flex">
                <div style="flex: 2">
                  <a-tag>{{ item.name }}</a-tag>
                </div>
                <div style="flex: 11">
                  <a-space> {{ item.text }}</a-space>
                </div>
                <div style="flex: 11">
                  <a-space> {{ item.roleMusic }}</a-space>
                </div>
              </div>
            </a-list-item>
          </a-list>
          <div style="padding-top: 10px">
            <a-button type="primary">添加</a-button>
          </div>
        </a-form-item>
        <a-form-item label="人物音乐">
          <a-select :filter-option="filterOption" show-search>
            <a-select-option v-for="role in chapterInfo['material']['musicList']['role']" :value="role['name']">
              {{ role['name'] }}
            </a-select-option>
          </a-select>
        </a-form-item>
      </a-form>
    </a-modal>
  </div>

</template>

<script lang="ts" setup>
import {onMounted, Ref, ref} from "vue";
import {
  MailOutlined,
  FormOutlined,
  HighlightOutlined,
  VideoCameraAddOutlined,
  PlayCircleOutlined
} from '@ant-design/icons-vue';

const editModal = ref(false)
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
      "name": "章节名",
      "info": "章节信息",
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
            },
            {
              "name": "你好世界",
              "src": "/assets/music/roleMusic/你好世界.mp3"
            },
            {
              "name": "到这里就结束了",
              "src": "/assets/music/roleMusic/到这里就结束了.mp3"
            },
            {
              "name": "对话左边的是我的头图",
              "src": "/assets/music/roleMusic/对话左边的是我的头图.mp3"
            },
            {
              "name": "当然，右边也有一个人物位置",
              "src": "/assets/music/roleMusic/当然，右边也有一个人物位置.mp3"
            },
            {
              "name": "感谢你的观看",
              "src": "/assets/music/roleMusic/感谢你的观看.mp3"
            },
            {
              "name": "我是ZHF",
              "src": "/assets/music/roleMusic/我是ZHF.mp3"
            },
            {
              "name": "拜拜",
              "src": "/assets/music/roleMusic/拜拜.mp3"
            },
            {
              "name": "演示Z引擎的一些功能",
              "src": "/assets/music/roleMusic/演示Z引擎的一些功能.mp3"
            },
            {
              "name": "现在出现的是我的立绘",
              "src": "/assets/music/roleMusic/现在出现的是我的立绘.mp3"
            },
            {
              "name": "这是一个测试项目",
              "src": "/assets/music/roleMusic/这是一个测试项目.mp3"
            },
            {
              "name": "那个泳池是背景图",
              "src": "/assets/music/roleMusic/那个泳池是背景图.mp3"
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
          "id": "id",
          "dialogue": {
            "headImg": "",
            "content": [
              {
                "name": "ZHF",
                "text": "...",
                "roleMusic": "..."
              },
              {
                "name": "ZHF",
                "text": "我是ZHF",
                "roleMusic": "我是ZHF"
              },
              {
                "name": "ZHF",
                "text": "这是一个测试项目",
                "roleMusic": "这是一个测试项目"
              },
              {
                "name": "ZHF",
                "text": "我将在这里演示z-game-engine引擎的一些功能",
                "roleMusic": "演示Z引擎的一些功能"
              },
              {
                "name": "ZHF",
                "text": "那个泳池是背景图",
                "roleMusic": "那个泳池是背景图"
              },
              {
                "name": "ZHF",
                "text": "对话左边的是我的头图（headImage）",
                "roleMusic": "对话左边的是我的头图"
              }
            ]
          },
          "role": [
            {
              "name": "人物名称",
              "status": "状态",
              "position": "方位"
            }
          ],
          "background": {
            "name": "bg1"
          },
          "music": {
            "backgroundMusic": {
              "name": "bgm1"
            },
          }
        },
        {
          "id": "id",
          "dialogue": {
            "headImg": "",
            "content": [
              {
                "name": "ZHF",
                "text": "现在出现的是我的立绘（roleImage）",
                "roleMusic": "现在出现的是我的立绘"
              }
            ]
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
            "roleMusic": [
              "现在出现的是我的立绘"
            ]
          }
        },
        {
          "id": "id",
          "dialogue": {
            "headImg": "",
            "content": [
              {
                "name": "ZHF",
                "text":"当然，右边也有一个人物位置",
                "roleMusic":"当然，右边也有一个人物位置"
              }
            ]
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
            }
          }
        },
        {
          "id": "id",
          "dialogue": {
            "headImg": "",
            "content": [
              {
                "name": "ZHF",
                "text":"现在播放的是人物语音测试，我也不知道讲的是啥",
                "roleMusic":"现在播放的是人物语音测试，我也不知道讲的是啥",
              }
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
            "roleMusic": [
              "ogg1"
            ]
          }
        },
        {
          "id": "id",
          "dialogue": {
            "headImg": "",
            "content": [
              {
                "name": "ZHF",
                "text":"好了，到这里就结束了",
                "roleMusic": "到这里就结束了"
              }
            ]
          },
          "role": [
            {
              "name": "ZHF",
              "status": "unchanged",
              "position": "left"
            },
            {
              "name": "",
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
 * 根据语音名获取语音
 * @param name 音乐名
 */
const getRoleAudio:any = function (name) {
  let audioInfo = {}
  chapterInfo.value.material.musicList.role.forEach((item) => {
    if (item.name === name) {
      audioInfo = item;
    }
  })
  return audioInfo;
}


const nodeRow = ref({});
/**
 * 编辑按钮
 * @param row
 */
const editFun = function (row) {
  nodeRow.value = row;
  console.log(nodeRow.value)
}

/**
 * 播放指定音乐
 * @param src
 */
const playAudio = function (name){
  let audioInfo = getRoleAudio(name);
  if(audioInfo['src']){
    let play = new Audio()
    play.src = audioInfo.src;
    play.play();
  }

}

/**
 * 搜索功能
 * @param input
 * @param option
 */
const filterOption = (input: string, option: any) => {
  return option.value.toLowerCase().indexOf(input.toLowerCase()) >= 0;
};

const outPutScript = function () {
  console.log(scriptRow)
}

onMounted(() => {
  getChapterList();
})
</script>

<style lang="scss" scoped>

</style>
