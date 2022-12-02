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
        <a-menu-item key="2" @click="inputScript">打开剧本</a-menu-item>
        <a-menu-item key="3" @click="outputScript">导出剧本</a-menu-item>
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
        <h3 style="text-align: center;line-height: 40px">{{scriptRow['name']?scriptRow['name']:"没有打开剧本"}}</h3>
        <a-menu :inlineIndent="5" mode="inline" v-show="scriptRow['name']">
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
                      <a-button shape="circle" type="primary" @click="playAudio(record.music.backgroundMusic.name)">
                        <template #icon>
                          <play-circle-outlined/>
                        </template>
                      </a-button>
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
                            <a-button shape="circle" type="primary" @click="playAudio(item.roleMusic)">
                              <template #icon>
                                <play-circle-outlined/>
                              </template>
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
    <a-modal v-model:visible="editModal" title="编辑节点" width="80%" @ok="editModal=false">
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
                <div style="flex: 1">
                  编号
                </div>
                <div style="flex: 2">
                  姓名
                </div>
                <div style="flex: 10">
                  文字
                </div>
                <div style="flex: 11">
                  语音
                </div>
              </div>
            </a-list-item>
            <a-list-item v-for="(item,index) in nodeRow.dialogue.content">
              <div style="width: 100%;display: flex">
                <div style="flex: 1">
                  <a-tag>{{ index }}</a-tag>
                </div>
                <div style="flex: 2">
                  <a-tag>{{ item.name }}</a-tag>
                </div>
                <div style="flex: 9">
                  <a-space> {{ item.text }}</a-space>
                </div>
                <div style="flex: 10">
                  <a-space> {{ item.roleMusic }}</a-space>
                </div>
                <div style="flex: 2;display: flex">
                  <div style="flex: 1;text-align: center">
                    <a-button shape="circle" type="primary">
                      <template #icon>
                        <plus-outlined/>
                      </template>
                    </a-button>
                  </div>
                  <div style="flex:1;text-align: center">
                    <a-button danger shape="circle" type="primary" @click="delDialogue(index)">
                      <template #icon>
                        <delete-outlined/>
                      </template>
                    </a-button>
                  </div>
                </div>
              </div>
            </a-list-item>
          </a-list>
          <div>
            <div style="width: 100%;display: flex;font-weight: bolder">
              <div style="flex: 1;padding: 5px">
                <a-input></a-input>
              </div>
              <div style="flex: 2;padding: 5px">
                <a-select v-model:value="addDialogueInfo.name" :filter-option="filterOption" placeholder="姓名"
                          show-search>
                  <a-select-option v-for="role in chapterInfo['material']['roleList']" :value="role['name']">
                    {{ role['name'] }}
                  </a-select-option>
                </a-select>
              </div>
              <div style="flex: 10;padding: 5px">
                <a-input v-model:value="addDialogueInfo.text" placeholder="文字" type="text"></a-input>
              </div>
              <div style="flex: 9;padding: 5px">
                <a-select v-model:value="addDialogueInfo.roleMusic" :filter-option="filterOption" placeholder="语音"
                          show-search>
                  <a-select-option v-for="role in chapterInfo['material']['musicList']['role']" :value="role['name']">
                    {{ role['name'] }}
                  </a-select-option>
                </a-select>
              </div>
              <div style="flex: 2;padding: 5px">
                <a-button @click="aiMatching">智能匹配</a-button>
              </div>
            </div>
          </div>
          <div style="padding-top: 10px">
            <a-button type="primary" @click="addDialogue">添加</a-button>
          </div>
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
  PlayCircleOutlined,
  PlusOutlined,
  DeleteOutlined,
} from '@ant-design/icons-vue';
import {message} from 'ant-design-vue';

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

const scriptRow = ref({})


/**
 * 章节列表
 */
const chapterList = ref([]);

/**
 * 获取章节列表
 */
const getChapterList = function () {
  chapterList.value = scriptRow.value.chapter.map((item) => {
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
  chapterInfo.value = scriptRow.value.chapter.filter((item) => {
    if (item.name === name) {
      return true;
    }
  })[0]
}

/**
 * 根据语音名获取语音
 * @param name 音乐名
 */
const getRoleAudio: any = function (name) {
  for (let item of chapterInfo.value.material.musicList.role) {
    if (item.name === name) {
      return item;
    }
  }

  for (let item of chapterInfo.value.material.musicList.background) {
    if (item.name === name) {
      return item;
    }
  }
  message.info("找不到对应语音");
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

// 音频播放器
const playAudioInfo = ref(new Audio());
/**
 * 播放指定音乐
 * @param name 音乐名
 */
const playAudio = function (name) {
  let audioInfo = getRoleAudio(name);
  if (audioInfo['src']) {
    playAudioInfo.value.pause();
    playAudioInfo.value.src = audioInfo.src;
    playAudioInfo.value.play();
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

/**
 * 导出剧本
 */
const outputScript = function () {
  const blob = new Blob([JSON.stringify(scriptRow.value)], {
    type: 'application/json'
  })
  let a = document.createElement('a')
  a.href = URL.createObjectURL(blob);
  console.log(a.href)
  a.download = `剧本${scriptRow.value.name}导出`
  a.click();
}

/**
 * 导入剧本
 */
const inputScript = function () {
  let file = document.createElement('input')
  file.type = "file";
  file.click();
  file.onchange = function () {
    console.log(file.files[0])
    let reader = new FileReader();
    reader.readAsText(file.files[0]);//发起异步请求
    reader.onload = function () {
      //读取完成后，数据保存在对象的result属性中
      try {
        if (typeof this.result === "string") {
          scriptRow.value = JSON.parse(this.result);
          message.success("导入成功")
          sessionStorage.setItem("scriptRow", this.result)
          getChapterList();
        }
      } catch (e) {
        message.error("导入失败", e.message)
      }
    }
  }
}


const addDialogueInfo = ref({
  "name": "",
  "text": "",
  "roleMusic": "",
})


/**
 * 添加对话
 */
const addDialogue = function () {
  nodeRow.value.dialogue.content.push({
    "name": addDialogueInfo.value.name,
    "text": addDialogueInfo.value.text,
    "roleMusic": addDialogueInfo.value.roleMusic,
  })
  console.log(nodeRow)
}

const delDialogue = function (index) {
  nodeRow.value.dialogue.content.splice(index, 1)
}
/**
 * 智能匹配
 */
const aiMatching = function () {

}


onMounted(() => {
  if(sessionStorage.getItem("scriptRow") !== null){
    scriptRow.value = JSON.parse(sessionStorage.getItem("scriptRow"));
    message.info("已从本地缓存打开剧本")
  }
  if (scriptRow.value["name"] !== undefined) {
    getChapterList();
  }
  document.addEventListener('keydown', function(e){
    if(e.ctrlKey && e.key.toUpperCase() === "S"){
      e.preventDefault()
      sessionStorage.setItem("scriptRow", JSON.stringify(scriptRow.value))
      message.success("保存成功")
    }
  });
})
</script>

<style lang="scss" scoped>

</style>
