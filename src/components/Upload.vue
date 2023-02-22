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
</template>
<script setup>
import { ref, watch } from "vue";
const upload = async (file) => {
  console.log(file);
  const reader = new FileReader();
  reader.onload = () => {
    const data = reader.result.split("\n").reduce((a, c, i) => {
      const prev = a[a.length - 1];
      if (!prev || (i - prev.i) % 4 === 0) {
        return a.concat({ i });
      }
      const diff = i - prev.i;
      if (diff === 1) {
        const [start, end] = c.split(" --> ");
        prev.start = start;
        prev.end = end;
        return a;
      } else if (diff === 2) {
        prev.content = c;
      }
      return a;
    }, []);
    console.log(reader.result, data);
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
