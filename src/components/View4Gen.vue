<template>
  <div class="container">
    <div class="mt-5 mb-5">
      <div class="card text-dark bg-light">
        <div class="card-body">
          <h5 class="card-title">Enter script or upload from samples:</h5>
          <div class="input-group mb-3">
            <span class="input-group-text">Script</span>
            <textarea ref="textareaOfScript" class="form-control" aria-label="Script" rows="10"></textarea>
          </div>
          <label for="inputGroupSelect03" class="form-label">Choose sample to upload:</label>
          <div class="input-group mb-3">
            <!-- <button @click="uploadFromFile" :disabled="!resources.selectedFile" class="btn btn-outline-secondary"
              type="button">Upload</button> -->
            <select @change="uploadFromFile" :disabled="resources.sourceFiles.length == 0" class="form-select"
              id="inputGroupSelect03" v-model="resources.selectedFile">
              <option disabled selected value="">Choose...</option>
              <option v-for="file in resources.sourceFiles" :value="file" :key="file">{{ file }}</option>
            </select>
          </div>
          <div class="row">
            <!-- <div class="col">
              <a href="#" type="button" class="btn btn-primary bt-3 btn-lg" id="uploadScriptBtn">
                Upload
              </a>
            </div> -->
            <div class="col">
              <a href="#" type="button" @click="generate" class="btn btn-danger bt-3 btn-lg">
                Generate
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { reactive, onMounted, ref } from 'vue';
import axios from 'axios';

const textareaOfScript = ref(null);

const resources = reactive({
  sourceFiles: ['Test-file-1', 'Test-file-2'],
  selectedFile: ""
});

function generate() {
  axios.post('/generate', {
    PredefinedScript: textareaOfScript.value.value
  }, {
    responseType: "blob"
  })
    .then(function (response) {
      // handle success
      const fileURL = window.URL.createObjectURL(new Blob([response.data],{ type: response.headers['Content-Type'] } ));
      const fileLink = document.createElement('a');
      fileLink.href = fileURL;
      const regexpFileName = /filename="(.*)"/;
      const match = response.headers['content-disposition'].match(regexpFileName);
      fileLink.setAttribute('download', match[1]);
      fileLink.setAttribute('target', '_blank');
      document.body.appendChild(fileLink);
      fileLink.click();
      fileLink.remove();
    })
    .catch(function (error) {
      // handle error
      console.log(error);
    })
    .then(function () {
      // always executed
    });
}

function uploadFromFile() {
  axios.post('/uploadFromFile', {
    fileName: resources.selectedFile
  })
    .then(function (response) {
      // handle success
      textareaOfScript.value.value = response.data.fileContent;
    })
    .catch(function (error) {
      // handle error
      console.log(error);
    })
    .then(function () {
      // always executed
    });
}

onMounted(() => {
  axios.get('/getSourceFiles')
    .then(function (response) {
      resources.sourceFiles = response.data.sourceFiles;
    })
    .catch(function (error) {
      // handle error
      console.log(error);
    })
    .then(function () {
      // always executed
    });
}
)


</script>