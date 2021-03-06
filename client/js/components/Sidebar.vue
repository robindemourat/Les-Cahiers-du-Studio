<template>
  <div class="m_sidebar padding-bottom-medium" ref="sidebar">

    <SidebarSection>
      <div slot="header" class="flex-vertically-centered">
        <h3 class="margin-none text-cap with-bullet">
          {{ $t('folder_information') }}
          <button
            v-if="folder.authorized"
            type="button"
            class="button-small border-circled button-thin button-wide padding-verysmall margin-none"
            @click="openEditFolderModal()"
            >
            {{ $t('edit') }}
          </button>
        </h3>
      </div>

      <div slot="body" class="">
        <p class="font-small">
          <span v-html="$t('toconnectwithanotherdevicetothisfolder')"></span>

          <a v-for="(ip, index) in $root.store.localNetworkInfos.ip"
            :href="getURLToApp(ip, $root.store.localNetworkInfos.port)"
            class="js--openInBrowser button button-circled margin-vert-medium border-circled button-inline padding-small flex-horizontally-spaced"
            target="_blank"
            >
            {{ getURLToApp(ip, $root.store.localNetworkInfos.port) }}
            <qrcode :value="getURLToApp(ip, $root.store.localNetworkInfos.port)" :options="{ size: 100 }"></qrcode>
          </a>

        </p>
        <p class="font-small">
          {{ $t('contents_are_stored') }}
          <template v-if="$root.store.is_electron">
            <a :href="folder.fullFolderPath" @click.prevent="openInFinder(folder.fullFolderPath)">
              {{ folder.fullFolderPath.replace(/\//g, '\/\u200B') }}
            </a>
          </template>

          <template v-else>
            {{ folder.fullFolderPath.replace(/\//g, '\/\u200B') }}
          </template>
        </p>
      </div>
    </SidebarSection>

    <SidebarSection>
      <div slot="header">
        <h3 class="margin-none text-cap with-bullet">
          {{ $t('calendar') }}
          <button
            v-if="isRealtime"
            type="button"
            class="button-small border-circled button-thin button-wide padding-verysmall margin-none c-rouge_vif"
            @click="scrollToToday()"
            >
            {{ $t('now') }}
          </button>
        </h3>
      </div>

      <div slot="body" class="m_calendar">
        <div
          v-for="(days, month) in folderDays()"
          class="m_calendar--month"
        >
          <h3 class="margin-bottom-small text-ital font-small">
            {{ month }}
          </h3>
          <div class="m_calendar--days">
            <div
              v-for="(daymeta, index) in days"
              class="m_calendar--days--day padding-sides-verysmall padding-bottom-small"
              :class="{
                'is--visibleDay' : daymeta.isVisibleDay,
                'has--noMedia' : !daymeta.numberOfMedias,
                'is--today': daymeta.isToday
              }"
              @click="scrollToDate(daymeta.timestamp)"
              >
              <button class="font-verylarge padding-none">
                {{ daymeta.dayNumber }}
                <div class="font-veryverysmall bottomIndicator">
                  {{ daymeta.numberOfMedias > 0 ? daymeta.numberOfMedias : '.' }}
                </div>
              </button>
            </div>
          </div>
        </div>
      </div>
    </SidebarSection>

    <SidebarSection>
      <div slot="header">
        <h3 class="margin-none text-cap with-bullet">
          {{ $t('list') }}
          <button
            type="button"
            class="button-small border-circled button-thin button-wide padding-verysmall margin-none"
            @click="openListMediasModal()"
            >
            {{ $t('fullscreen') }}
          </button>
        </h3>
      </div>

      <div slot="body" class="margin-sides-negative-medium">
        <Tableau
          v-if="showMediasList === false"
          :display="'table'"
          :filter="filter"
          :sort="sort"
          :sortedMedias="sortedMedias"
          :slugFolderName="slugFolderName"
          :timelineInfos="timelineInfos"
          >
        </Tableau>
      </div>
    </SidebarSection>


    <MediasList
      v-if="showMediasList === true"
      :filter="filter"
      :sort="sort"
      :sortedMedias="sortedMedias"
      :slugFolderName="slugFolderName"
      :timelineInfos="timelineInfos"
      @close="closeListMediasModal()"
    >
    </MediasList>

  </div>

</template>
<script>
import Informations from './sidebar/Informations.vue';
import Calendrier from './sidebar/Calendrier.vue';
import Tableau from './sidebar/Tableau.vue';
import SidebarSection from './sidebar/SidebarSection.vue';
import MediasList from './modals/MediasList.vue';
import qrcode from '@xkeshi/vue-qrcode';

export default {
  components: {
    SidebarSection,
    Tableau,
    MediasList,
    qrcode
  },
  props: {
    slugFolderName: String,
    folder: Object,
    medias: Object,
    timelineInfos: Object,
    visibleDay: Number,
    isRealtime: {
      type: Boolean,
      default: false,
    },
    showEditFolderModal: false,
  },
  data() {
    return {
      showMediasList: false,
      filter: '',

      sort: {
        current: {
          field: 'date_timeline',
          name: this.$t('date'),
          type: 'date',
          order: 'ascending',
        },

        available: [
          {
            field: 'date_timeline',
            name: this.$t('date'),
            type: 'date',
            order: 'ascending',
          },
          {
            field: 'date_modified',
            name: this.$t('last_modified'),
            type: 'date',
            order: 'descending',
          },
          {
            field: 'type',
            name: this.$t('type'),
            type: 'alph',
            order: 'ascending',
          },
          {
            field: 'color',
            name: this.$t('color'),
            type: 'alph',
            order: 'ascending',
          },
          {
            field: 'authors',
            name: this.$t('author'),
            type: 'alph',
            order: 'ascending',
          },
          {
            field: 'public',
            name: this.$t('public'),
            type: 'alph',
            order: 'descending',
          },
          {
            field: 'content',
            name: this.$t('content'),
            type: 'alph',
            order: 'ascending',
          }
        ]
      }
    }
  },
  mounted() {
    this.$eventHub.$on('setSort', this.setSort);
    this.$eventHub.$on('setFilter', this.setFilter);
  },
  beforeDestroy() {
    this.$eventHub.$off('setSort');
    this.$eventHub.$off('setFilter');
  },
  computed: {
    sortedMedias() {
      var sortable = [];
      for (let slugMediaName in this.medias) {
        let mediaDataToOrderBy;

        if (this.sort.current.type ==='date') {
          mediaDataToOrderBy = + new Date(this.medias[slugMediaName][this.sort.current.field]);
        } else if (this.sort.current.type ==='alph') {
          mediaDataToOrderBy = this.medias[slugMediaName][this.sort.current.field];
        }

        sortable.push({ slugMediaName: slugMediaName, mediaDataToOrderBy: mediaDataToOrderBy });
      }
      let sortedSortable = sortable.sort(function(a, b) {
        let valA = a.mediaDataToOrderBy;
        let valB = b.mediaDataToOrderBy;
        if(typeof a.mediaDataToOrderBy === 'string' && typeof b.mediaDataToOrderBy === 'string') {
          valA = valA.toLowerCase();
          valB = valB.toLowerCase();
        }
        if (valA < valB) { return -1; }
        if (valA > valB) { return 1; }
        return 0;
      });
      if(this.sort.current.order === 'descending') {
        sortedSortable.reverse();
      }

      // array order is garanteed while objects properties aren’t,
      // that’s why we use an array here
      let sortedMedias = sortedSortable.reduce((result, d) => {
        let sortedMediaObj = this.medias[d.slugMediaName];
        sortedMediaObj.slugMediaName = d.slugMediaName;

        if(this.filter.length > 0) {
          // if there is a filter set, let’s only return medias whose mediaDataToOrderBy contain that string
          let originalContentFromMedia = sortedMediaObj[this.sort.current.field] + '';
          if(originalContentFromMedia.indexOf(this.filter) !== -1) {
            result.push(sortedMediaObj);
          }
        } else {
          result.push(sortedMediaObj);
        }

        return result;
      }, []);
      return sortedMedias;
    },
  },

  methods: {

    // from https://stackoverflow.com/questions/23795522/how-to-enumerate-dates-between-two-dates-in-moment
    enumerateDaysBetweenDates(startDate, endDate) {
      var dates = [];

      var currDate = this.$moment(startDate).startOf('day').subtract(1, 'days');
      var lastDate = this.$moment(endDate).startOf('day').add(1, 'days');

      while(currDate.add(1, 'days').diff(lastDate) < 0) {
        dates.push(currDate.clone().toDate());
      }

      return dates;
    },

    getURLToApp(ip, port) {
      return `https://${ip}:${port}`;
    },
    openInFinder(thisPath) {
      const shell = window.require('electron').shell;
      event.preventDefault();
      shell.showItemInFolder(thisPath);
    },
    getVisibleDay() {
      return this.$moment(this.visibleDay).format('DD/MM/YYYY');
    },
    scrollToDate(timestamp) {
      this.$eventHub.$emit('scrollToDate', timestamp);
    },
    openListMediasModal() {
      this.showMediasList = true;
    },
    closeListMediasModal() {
      this.showMediasList = false;
    },
    folderDays() {
      console.log('METHODS • sidebar: getting folderDays');
      const allDays = this.enumerateDaysBetweenDates(this.timelineInfos.start, this.timelineInfos.end);
      if(allDays.length === 0) { return; }

      /*
      {
        "septembre": {
          21: {
            medias: 12
          },
          22: {
          },
        }
      */

      var dayGroupedByMonth = allDays.reduce((acc, cur, i) => {
        let monthName = this.$moment(cur).format('MMMM');
        let day = this.$moment(cur).date();

        let fullDate = this.$moment(cur).format('DD/MM/YYYY');
        let isVisibleDay = false;
        if(fullDate === this.getVisibleDay()) {
          isVisibleDay = true;
        }
        let isToday = false;
        let todaysDate = this.$moment().format('DD/MM/YYYY');
        if(todaysDate === fullDate) {
          isToday = true;
        }

        let dayData = {
          "dayNumber": day,
          "numberOfMedias": this.getNumberOfMediasCreatedOnThisDate(cur),
          "timestamp": this.$moment(cur),
          isVisibleDay,
          isToday
        };

        if(typeof acc[monthName] === 'undefined') {
          acc[monthName] = [];
        }
        acc[monthName].push(dayData);
        return acc;
      }, {});

      return dayGroupedByMonth;
    },

    getNumberOfMediasCreatedOnThisDate(date) {
      if(Object.keys(this.medias).length === 0) {
        return 0;
      }

      const total = Object.entries(this.medias).reduce((acc, pair) => {
        const [key, value] = pair;
        let created_day = this.$moment(value.date_timeline);
        if(created_day.isSame(date, 'day')) {
          acc++;
        }
        return acc;
      }, 0);

      return total;
    },

    openEditFolderModal() {
      this.$eventHub.$emit('showEditFolderModal');
    },

    scrollToToday() {
      this.$eventHub.$emit('timeline.scrollToToday');
    },

    setSort(newSort) {
      this.sort.current = newSort;
    },
    setFilter(newFilter) {
      this.filter = newFilter;
    }
  }

}
</script>

<style lang="sass">


</style>