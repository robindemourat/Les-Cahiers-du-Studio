<template>
  <div class="m_folder">
    <h2 class="m_folder--title margin-none padding-medium bg-noir c-blanc font-large">
      {{ folder.name }}
    </h2>

    <div class="">
      <mark class="margin-medium font-small" v-if="folder.password === 'has_pass'">
        {{ $t('protected_by_pass') }}
      </mark>

      <div class="folder_metapreview margin-medium font-small">
        <i>{{ $t('created_date') }}</i>
        <br>
        {{ formatDateToHuman(folder.created) }}
      </div>

      <hr class="margin-small margin-sides-medium">

      <div class="margin-small flex-wrap flex-vertically-start flex-horizontally-start">
        <button type="button" class="button-round margin-verysmall padding-verysmall" @click="$root.openFolder(slugFolderName)">
          <svg xmlns="http://www.w3.org/2000/svg" width="46.99" height="46.99" viewBox="0 0 46.99 46.99">
            <g id="Calque_2" data-name="Calque 2">
              <g id="Content">
                <g>
                  <circle cx="23.5" cy="23.5" r="23" style="fill: #fff"/>
                  <circle cx="23.5" cy="23.5" r="23" style="fill: none;stroke: #4d4d4d;stroke-miterlimit: 10"/>
                </g>
                <polyline points="33.33 23.74 33.33 33.96 23.11 33.96 12.88 33.96 12.88 23.74 12.88 13.52 23.11 13.52" style="fill: none;stroke: #333;stroke-miterlimit: 10"/>
                <polyline points="26.73 13.52 33.33 13.52 33.33 20.12" style="fill: none;stroke: #333;stroke-miterlimit: 10"/>
                <line x1="33.05" y1="13.89" x2="22.1" y2="24.83" style="fill: none;stroke: #333;stroke-miterlimit: 10"/>
              </g>
            </g>
          </svg>
          <span class="text-cap font-verysmall">
            {{ $t('open') }}
          </span>
        </button>

        <button v-if="!folder.authorized" type="button" class="button-round margin-verysmall padding-verysmall" @click="showInputPasswordField = !showInputPasswordField">
          <span class="text-cap font-verysmall">
            {{ $t('password') }}
          </span>
        </button>
  <!--
        <button v-if="folder.authorized" type="button" class="button-round margin-verysmall padding-verysmall" @click="debugFolderContent = !debugFolderContent">
          <span class="text-cap font-verysmall">
            Vue de debug
          </span>
        </button>
  -->
        <button v-if="folder.authorized" type="button" class="button-round margin-verysmall padding-verysmall" @click="showEditFolderModal = true">
          <svg xmlns="http://www.w3.org/2000/svg" width="46.99" height="46.99" viewBox="0 0 46.99 46.99">
            <g id="Calque_2" data-name="Calque 2">
              <g id="Content">
                <g>
                  <circle cx="23.5" cy="23.5" r="23" style="fill: #fff"/>
                  <circle cx="23.5" cy="23.5" r="23" style="fill: none;stroke: #4d4d4d;stroke-miterlimit: 10"/>
                </g>
                <g>
                  <polygon points="17.91 33.77 13.32 34.3 13.85 29.71 22.36 21.2 30.86 12.69 32.9 14.72 34.93 16.76 26.42 25.26 17.91 33.77" style="fill: none;stroke: #333;stroke-miterlimit: 10"/>
                  <line x1="16.13" y1="27.43" x2="20.19" y2="31.49" style="fill: none;stroke: #333;stroke-miterlimit: 10"/>
                </g>
              </g>
            </g>
          </svg>
          <span class="text-cap font-verysmall">
            {{ $t('edit') }}
          </span>
        </button>
        <button v-if="folder.authorized" type="button" class="button-round margin-verysmall padding-verysmall" @click="removeFolder()">
          <svg xmlns="http://www.w3.org/2000/svg" width="49" height="49" viewBox="0 0 49 49">
            <g id="Calque_2" data-name="Calque 2">
              <g id="Editeur_txt" data-name="Editeur txt">
                <g>
                  <g>
                    <circle cx="24.5" cy="24.5" r="24" style="fill: #fff"/>
                    <circle cx="24.5" cy="24.5" r="24" style="fill: none;stroke: #4d4d4d;stroke-miterlimit: 10"/>
                  </g>
                  <g>
                    <path d="M16.79,35.19l-.72-16.86H33l-.72,16.86a1.42,1.42,0,0,1-1.46,1.31H18.25A1.42,1.42,0,0,1,16.79,35.19Z" style="fill: none;stroke: #333;stroke-miterlimit: 10"/>
                    <path d="M20.83,15.41v-2a.89.89,0,0,1,.92-.86h5.52a.89.89,0,0,1,.92.86v2Z" style="fill: none;stroke: #333;stroke-miterlimit: 10"/>
                    <line x1="20.75" y1="34.18" x2="20.75" y2="21.01" style="fill: none;stroke: #333;stroke-miterlimit: 10"/>
                    <line x1="24.66" y1="34.18" x2="24.66" y2="21.01" style="fill: none;stroke: #333;stroke-miterlimit: 10"/>
                    <line x1="28.58" y1="34.18" x2="28.58" y2="21.01" style="fill: none;stroke: #333;stroke-miterlimit: 10"/>
                    <line x1="14" y1="15.41" x2="35" y2="15.41" style="fill: none;stroke: #333;stroke-miterlimit: 10"/>
                  </g>
                </g>
              </g>
            </g>
          </svg>
          <span class="text-cap font-verysmall">
            {{ $t('remove') }}
          </span>
        </button>
      </div>


      <div v-if="showInputPasswordField" class="input-group">
        <input type="password" ref="passwordField" @keyup.enter="submitPassword" autofocus>
        <button type="button" class="" @click="submitPassword">Envoyer</button>
      </div>

      <EditFolder
        v-if="showEditFolderModal"
        :folder="folder"
        :slugFolderName="slugFolderName"
        @close="showEditFolderModal = false"
      >
      </EditFolder>
    </div>
  </div>
</template>
<script>
import EditFolder from './modals/EditFolder.vue';

export default {
  props: ['folder', 'slugFolderName'],
  components: {
    EditFolder,
  },
  data() {
    return {
      debugFolderContent: false,
      showEditFolderModal: false,
      showInputPasswordField: false
    }
  },
  methods: {
    formatDateToHuman(date) {
      return this.$moment(date, 'YYYY-MM-DD HH:mm:ss').calendar();
    },
    openFolder() {
      this.$root.openFolder(this.slugFolderName);
    },
    closeFolder() {
      this.$root.closeFolder();
    },
    removeFolder() {
      if(window.confirm(this.$t('sureToRemoveFolder'))) {
        this.$root.removeFolder(this.slugFolderName);
      }
    },
    submitPassword() {
      console.log('METHODS • Folder: submitPassword');
      auth.updateAdminAccess({ [this.slugFolderName]: this.$refs.passwordField.value });
      window.socketio.sendAuth();
      this.showInputPasswordField = false;
    }
  },
  watch: {
  },
}
</script>
<style scoped>
</style>