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
        <template #title>剧本（edit）</template>
        <a-menu-item key="1" @click="newScript">创建剧本</a-menu-item>
        <a-menu-item key="2" @click="inputScript">打开剧本</a-menu-item>
        <a-menu-item key="3" @click="outputScript">导出剧本</a-menu-item>
        <a-menu-item key="4" @click="importSource">导入素材（测试）</a-menu-item>
        <a-menu-item key="5" @click="getSource('assets/resources/backgroundImg/その他_プールA.png')">获取素材 （测试）</a-menu-item>
        <a-menu-item key="6" @click="nodeTest">Node功能 （测试）</a-menu-item>

      </a-sub-menu>
      <a-sub-menu key="material">
        <template #icon>
          <highlight-outlined/>
        </template>
        <template #title>素材（material）</template>
        <a-menu-item key="1" @click="outputAll">导出所有</a-menu-item>
        <!--        <a-menu-item-group title="角色列表（roleList）">-->
        <!--          <a-menu-item key="setting:1">立绘（img）</a-menu-item>-->
        <!--          <a-menu-item key="setting:2">头图（headImg）</a-menu-item>-->
        <!--        </a-menu-item-group>-->
        <!--        <a-menu-item key="setting:3">背景列表（backgroundList）</a-menu-item>-->
        <!--        <a-menu-item-group title="所有音乐（musicList）">-->
        <!--          <a-menu-item key="setting:3">Option 3</a-menu-item>-->
        <!--          <a-menu-item key="setting:4">Option 4</a-menu-item>-->
        <!--        </a-menu-item-group>-->
      </a-sub-menu>
    </a-menu>
    <a-row style="padding-left: 10px;padding-right: 10px">
      <a-col :span="4">
        <h3 style="text-align: center;line-height: 40px">{{ scriptRow['name'] ? scriptRow['name'] : "没有打开剧本" }}</h3>
        <a-menu v-show="scriptRow['name']" :inlineIndent="5" mode="inline">
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
      <a-col v-if="Object.keys(chapterInfo).length >0" :span="20">
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
                    <a-list v-show="record.dialogue.content.length>0" size="small">
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
                <div style="text-align: right;margin-top: 20px">
                  <a-button type="primary" @click="addNode">
                    添加节点
                  </a-button>
                </div>
              </a-form>
            </a-tab-pane>
            <a-tab-pane key="2" force-render tab="素材">
              <a-tabs>
                <a-tab-pane key="3" tab="背景素材">
                  <a-card v-for="item in chapterInfo['material']['backgroundList']" hoverable style="width: 240px">
                    <template #cover>
                      <img :src="sourceList[item['src']]" :data-onload="getSource(item['src'])" alt="example"/>
                    </template>
                    <a-card-meta :title="item['name']">
                      <template #description>{{ item['src'] }}</template>
                    </a-card-meta>
                  </a-card>
                </a-tab-pane>
                <a-tab-pane key="4" tab="人物素材">
                  <a-card v-for="item in chapterInfo['material']['roleList']" hoverable style="width: 240px">
                    <template #cover>
                      <img :src="sourceList[item['roleImg']]" :data-onload="getSource(item['roleImg'])" alt="example"/>
                    </template>
                    <a-card-meta :title="item['name']">
                      <template #description>{{ item['roleImg'] }}</template>
                    </a-card-meta>
                  </a-card>
                </a-tab-pane>
                <a-tab-pane key="5" tab="语音素材">
                  <div style="height: calc(100vh - 200px);overflow: hidden;overflow-y: scroll">
                    <a-list>
                      <a-list-item v-for="item in  chapterInfo['material']['musicList']['role']">
                        <div style="flex: 10">
                          <a-space>{{ item['name'] }}</a-space>
                        </div>
                        <div style="flex: 10">
                          <a-space>{{ item['src'] }}</a-space>
                        </div>
                        <div style="flex: 4">
                          <a-button shape="circle" type="primary" @click="playAudio(item.roleMusic)">
                            <template #icon>
                              <play-circle-outlined/>
                            </template>
                          </a-button>
                        </div>
                      </a-list-item>
                    </a-list>
                  </div>
                </a-tab-pane>
              </a-tabs>
            </a-tab-pane>
          </a-tabs>
        </div>
      </a-col>
    </a-row>
    <a-modal v-model:visible="editModal" title="编辑节点" width="100%" wrap-class-name="full-modal" @ok="editModal=false">
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
import {computed, nextTick, onMounted, Ref, ref} from "vue";
import * as localforage from "localforage";
import {
  DeleteOutlined,
  FormOutlined,
  HighlightOutlined,
  MailOutlined,
  PlayCircleOutlined,
  PlusOutlined,
  VideoCameraAddOutlined,
} from '@ant-design/icons-vue';
import {message} from 'ant-design-vue';
import JSZip from "jszip";
import axios from "axios";

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
const chapterList = ref({});

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
      sourceList.value = {};
      //点击章节名后，提前加载好资源
      for(let op of item['material']['backgroundList']){
        //背景资源
        sourceList.value[op['src']] = "";
      }
      for(let op of item['material']['roleList']){
        //人物资源
        sourceList.value[op['roleImg']] = "";
        sourceList.value[op['headImg']] = "";
      }

      for(let op of item['material']['musicList']['role']){
        //人物音乐资源
        sourceList.value[op['roleImg']] = "";
      }
      for(let op of item['material']['musicList']['background']){
        //背景音乐资源
        sourceList.value[op['src']] = "";
      }
      for(let op of item['material']['musicList']['material']){
        //音效音乐资源
        sourceList.value[op['src']] = "";
      }
      return true;
    }
  })[0]
  return {};
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
const outputScript = async function () {
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
 * 添加节点
 */
const addNode = function () {
  console.log(chapterInfo.value.node.push(
      {
        "id": "",
        "dialogue": {
          "content": []
        },
        "role": [],
        "background": {
          "name": ""
        },
        "music": {
          "backgroundMusic": {
            "name": ""
          }
        }
      }
  ))
}

/**
 * 导出剧本和所有素材
 */
const outputAll = async function () {
  let zip = new JSZip();
  zip.file("scriptRow.json", JSON.stringify(scriptRow.value));
  //资源文件夹
  let assets = zip.folder("assets/resources");
  //背景图片文件夹
  let backgroundImg = assets.folder("backgroundImg");
  //头图文件夹
  let headImg = assets.folder("headImg");
  //音乐文件夹
  let music = assets.folder("music");
  //背景音乐文件夹
  let backgroundMusic = music.folder("backgroundMusic");
  //人物音乐文件夹
  let roleMusic = music.folder("roleMusic");
  //人物立绘
  let roleImg = assets.folder("roleImg");

  let headImgList = new Set()
  let roleImgList = new Set()
  let backgroundList = new Set()
  let musicListRole = new Set()
  let musicListBackground = new Set()
  let musicListMaterial = new Set()

  //获取所有章节数据并去重
  for (let chapter of scriptRow.value['chapter']) {
    for (let item of chapter['material']['roleList']) {
      headImgList.add(item['headImg'])
      roleImgList.add(item['roleImg'])
    }

    for (let item of chapter['material']['backgroundList']) {
      backgroundList.add(item['src'])
    }

    for (let item of chapter['material']['musicList']['role']) {
      musicListRole.add(item['src'])
    }

    for (let item of chapter['material']['musicList']['background']) {
      musicListBackground.add(item['src'])
    }
    for (let item of chapter['material']['musicList']['material']) {
      musicListMaterial.add(item['src'])
    }
  }

  for (const item of headImgList) {
    await axios.get(item, {responseType: "blob"}).then((res) => {
      zip.file(item, res.data, {optimizedBinaryString: true})
    })
  }
  for (const item of roleImgList) {
    await axios.get(item, {responseType: "blob"}).then((res) => {
      zip.file(item, res.data, {optimizedBinaryString: true})
    })
  }
  for (const item of backgroundList) {
    await axios.get(item, {responseType: "blob"}).then((res) => {
      zip.file(item, res.data, {optimizedBinaryString: true})
    })
  }
  for (const item of musicListRole) {
    await axios.get(item, {responseType: "blob"}).then((res) => {
      zip.file(item, res.data, {optimizedBinaryString: true})
    })
  }
  for (const item of musicListBackground) {
    await axios.get(item, {responseType: "blob"}).then((res) => {
      zip.file(item, res.data, {optimizedBinaryString: true})
    })
  }
  for (const item of musicListMaterial) {
    await axios.get(item, {responseType: "blob"}).then((res) => {
      zip.file(item, res.data, {optimizedBinaryString: true})
    })
  }

  zip.generateAsync({type: "blob"})
      .then(function (content) {
        let a = document.createElement('a')
        a.href = URL.createObjectURL(content);
        console.log(a.href)
        a.download = `${scriptRow.value.name}导出`
        a.click();
      });
}

/**
 * 导入剧本
 */
const inputScript = function () {
  chapterInfo.value = {};
  let file = document.createElement('input')
  file.type = "file";
  file.click();
  file.onchange = function () {
    console.log(file.files[0])
    let reader = new FileReader();
    reader.readAsText(file.files[0]);//发起异步请求
    reader.onload = function (e) {
      //读取完成后，数据保存在对象的result属性中
      try {
        if (typeof e.target.result === "string") {
          scriptRow.value = JSON.parse(e.target.result);
          message.success("导入成功")
          getChapterList();
        }
      } catch (e) {
        message.error("导入失败", e.message)
      }
    }
  }
}

/**
 * 导入全部素材
 */
const importSource = function () {
  chapterInfo.value = {};
  let file = document.createElement('input')
  file.type = "file";
  file.click();
  file.onchange = function () {
    let zip = new JSZip()
    //同步读取压缩文件
    zip.loadAsync(file.files[0]).then(() => {
      for (let fileName of Object.keys(zip['files'])) {
        if (!zip['files'][fileName].dir) {
          //不是文件夹
          //以二进制的新式存储到indexDB中去
          localforage.setItem(fileName, zip.file(fileName).async("blob"))


          // if (
          //     fileName.indexOf("jpg") !== -1 ||
          //     fileName.indexOf("png") !== -1 ||
          //     fileName.indexOf("bmp") !== -1 ||
          //     fileName.indexOf("webp") !== -1
          // ) {
          //   //对于图片采用base64编码
          //   localforage.setItem(fileName, zip.file(fileName).async("blob"))
          // } else if (
          //     fileName.indexOf("txt") !== -1 ||
          //     fileName.indexOf("json") !== -1
          // ) {
          //   //对于文本直接读取
          //   localforage.setItem(fileName, zip.file(fileName).async("blob"))
          // } else {
          //   //不识别的直接跳过
          //   return;
          // }
        } else {

        }
      }
    })
    localforage.getItem("scriptRow.json").then((res: any) => {
      //读取剧本文件
      let reader = new FileReader();
      reader.readAsText(res);
      reader.onload = function (e) {
        //读取完成后，数据保存在对象的result属性中
        try {
          if (typeof e.target.result === "string") {
            console.log(e.target.result)
            scriptRow.value = JSON.parse(e.target.result);
            message.success("导入成功")
            getChapterList();
          }
        } catch (e) {
          message.error("导入失败", e.message)
        }
      }
    })
    // console.log(getSource("scriptRow.json"))
  }
}

/**
 * 创建剧本
 */
const newScript = function () {
  chapterInfo.value = {};
  scriptRow.value = {
    "name": "剧本名",
    "info": "剧本信息",
    "author": "作者",
    "chapter": [
      {
        "name": "章节名",
        "info": "章节信息",
        "material": {
          "roleList": [],
          "backgroundList": [],
          "musicList": {
            "role": [],
            "background": [],
            "source": []
          }
        },
      }
    ]
  }
  sessionStorage.setItem("scriptRow", JSON.stringify(scriptRow.value))
  getChapterList()
  message.success("保存成功")
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

let sourceList = ref({})
/**
 * 调用获取存储在indexDB中的资源
 * @param sourceSrc
 */
const getSource = async function (sourceSrc) {
  let sourceBlob = await localforage.getItem(sourceSrc)
  let reader = new FileReader();
  if (
      sourceSrc.indexOf("jpg") !== -1 ||
      sourceSrc.indexOf("png") !== -1 ||
      sourceSrc.indexOf("bmp") !== -1 ||
      sourceSrc.indexOf("webp") !== -1
  ) {
    //对于图片采用base64编码
    reader.readAsDataURL(<Blob>sourceBlob)
  } else if (
      sourceSrc.indexOf("txt") !== -1 ||
      sourceSrc.indexOf("json") !== -1
  ) {
    //对于文本直接读取
    reader.readAsText(<Blob>sourceBlob);
  } else {
    //不识别的直接跳过
    return;
  }

  reader.onload = function (e) {
    sourceList.value[sourceSrc] = e.target.result
    return e.target.result
  }
}


/**
 * node功能测试
 */
const nodeTest = function (){
  let fs = nw.require('fs');
  fs.readFile("package.json", 'utf8', function(err, txt) {
    if (err) {
      console.error(err);
      return;
    }
    console.log(txt);
  });
}

/**
 * 智能匹配
 */
const aiMatching = function () {

}


onMounted(() => {
  if (sessionStorage.getItem("scriptRow") !== null) {
    scriptRow.value = JSON.parse(sessionStorage.getItem("scriptRow"));
    message.info("已从本地缓存打开剧本")
  }
  if (scriptRow.value["name"] !== undefined) {
    getChapterList();
  }
  document.addEventListener('keydown', function (e) {
    if (e.ctrlKey && e.key.toUpperCase() === "S") {
      e.preventDefault()
      sessionStorage.setItem("scriptRow", JSON.stringify(scriptRow.value))
      message.success("保存成功")
    }
  });
})
</script>

<style lang="scss" scoped>
.full-modal {
  background-color: red;
}
</style>
