<template>
  <div class="dropzone">
    <Dropzone
      :id="uniqueDropzoneID"
      ref="dropzone"
      :url="uriToUploadMedia"
      @vdropzone-success="showSuccess"
      @vdropzone-sending="addMeta"
      :preview-template="template"
      :use-custom-dropzone-options=true
      :dropzone-options="customOptionsObject"
      :maxFileSizeInMB="4096"
      :maxNumberOfFiles="50"
    >
      <input type="hidden">
<!--
  ideal implementation: one button each
      <input name="imageCapture" type="file" accept="image/*" capture>
      <input name="videoCapture" type="file" accept="video/*" capture>
      <input name="audioCapture" type="file" accept="audio/*" capture>
-->
    </Dropzone>

  </div>
</template>
<script>
import Dropzone from 'vue2-dropzone';
import alertify from 'alertify.js';

export default {
  props: ['slugFolderName'],
  components: {
    Dropzone
  },
  data(){
    return {
      customOptionsObject: {
        language: {
          dictDefaultMessage : '+',
          dictCancelUpload : 'Annuler l’upload',
          dictRemoveFile: 'Masquer'
        }
      }
    }
  },
  computed: {
    uniqueDropzoneID: function() {
      return 'myVueDropzone_' + Math.ceil((Math.random() * 1000));
    },
    uriToUploadMedia: function() {
      return this.slugFolderName + '/file-upload';
    },
  },
  mounted: function() {
    document.addEventListener('dragover', this.enhanceDropzone);
    $(this.$refs.dropzoneoverlay)
      .on('dragleave', this.unenhanceDropzone)
      .on('drop', this.unenhanceDropzone)
      ;
  },
  destroyed: function() {
    document.removeEventListener('dragover', this.enhanceDropzone);
  },
  methods: {
    enhanceDropzone: function(evt) {
      $(this.$refs.dropzone.$el).addClass('is--bigger');
      evt.preventDefault();
      evt.stopPropagation();
      return false;
    },
    unenhanceDropzone: function(evt) {
      $(this.$refs.dropzone.$el).removeClass('is--bigger');
      evt.preventDefault();
      evt.stopPropagation();
      return false;
    },
    showSuccess: function (file) {
      setTimeout(() => {
        this.$refs.dropzone.removeFile(file);
      }, 1000);
      alertify
        .closeLogOnClick(true)
        .delay(4000)
        .log(this.$t('file_was_sent'))
        ;
    },
    addMeta: function (file, xhr, formData) {
      // Testing for 'function' is more specific and correct, but doesn't work with Safari 6.x
      if (typeof window.FileReader !== 'function' && typeof window.FileReader !== 'object') {
        alertify
          .closeLogOnClick(true)
          .delay(4000)
          .error(`Reading files not supported in this browser. Additional Meta like creation date won’t be sent.`)
          ;
        return;
      }

      let fileCreationDate = file.lastModified;
      let fileName = file.name;
      let objToSend = {
        fileCreationDate
      }
      formData.append(fileName, JSON.stringify(objToSend));
    },
    'template':function() {
        return `
          <div class="dz-preview dz-file-preview">
              <div class="dz-image" style="width: 50px;height: 50px">
                  <img data-dz-thumbnail /></div>
              <div class="dz-details">
                <div class="dz-filename"><span data-dz-name></span></div>
                <div class="dz-size"><span data-dz-size></span></div>
              </div>
              <div class="dz-progress"><span class="dz-upload" data-dz-uploadprogress></span></div>
              <div class="dz-error-message"><span data-dz-errormessage></span></div>
              <div class="dz-success-mark"><i class="fa fa-check"></i></div>
              <div class="dz-error-mark"><i class="fa fa-close"></i></div>
          </div>
            `;
    }

  }
}
</script>
<style lang="sass">
</style>
