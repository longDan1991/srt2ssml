<template>
  <a-upload
    name="avatar"
    list-type="picture-card"
    class="avatar-uploader"
    :show-upload-list="false"
    :beforeUpload="upload"
  >
    <div class="ant-upload-text">
      <i class="icon-Plus iconfont text-[#FFC04D]" style="font-size: 25px"></i>
      <div class="text-[#999999] text-12px leading-18px">Upload image</div>
    </div>
  </a-upload>

  <div id="content">
    <speak
      xmlns="http://www.w3.org/2001/10/synthesis"
      xmlns:mstts="http://www.w3.org/2001/mstts"
      xmlns:emo="http://www.w3.org/2009/10/emotionml"
      version="1.0"
      xml:lang="en-US"
    >
      <voice name="zh-CN-YunzeNeural">
        <mstts:express-as
          style="affectionate"
          styledegree="2"
          role="SeniorMale"
        >
          <prosody rate="0%" pitch="0%">
            <p>
              <mstts:silence
                type="Sentenceboundary"
                :value="data[0].start + 'ms'"
              />
              <s v-for="(item, i) in data" :key="item.i">
                {{ item.content }}
                <break
                  v-if="data[i + 1] && data[i + 1].start - item.end > 0"
                  :time="data[i + 1].start - item.end + 'ms'"
                />
              </s>
            </p>
          </prosody>
        </mstts:express-as>
      </voice>
    </speak>
  </div>
</template>
<script setup>
import { shallowRef } from "vue";
import dayjs from "dayjs";
const data = shallowRef([]);

const upload = async (file) => {
  console.log(file);
  const reader = new FileReader();
  reader.onload = () => {
    data.value = reader.result.split("\n").reduce((a, c, i) => {
      const prev = a[a.length - 1];
      if (!prev || (i - prev.i) % 4 === 0) {
        return a.concat({ i });
      }
      const diff = i - prev.i;
      if (diff === 1) {
        const [start, end] = c.split(" --> ");
        // hour:minute:second.millisecond

        prev.start =
          dayjs(`1970-00-00 ${start}`, "YYYY-MM-DD HH:MM:ss,SSS") -
          dayjs("1970-00-00", "YYYY-MM-DD");
        prev.end =
          dayjs(`1970-00-00 ${end}`, "YYYY-MM-DD HH:MM:ss,SSS") -
          dayjs("1970-00-00", "YYYY-MM-DD");
        return a;
      } else if (diff === 2) {
        prev.content = c;
      }
      return a;
    }, []);

    console.log(reader.result, data.value);
    const content = document.querySelector("#content");
    console.log(content.innerHTML);
  };
  reader.readAsText(file);
  return false;
};
</script>
<style scoped>
.avatar-uploader > .ant-upload {
  width: 128px;
  height: 128px;
}
.avatarBorder :deep() .ant-upload.ant-upload-select-picture-card {
  border-color: red;
}
</style>
