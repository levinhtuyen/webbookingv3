<template>
  <div class="time-line-component">
    <ul class="g2joy-timeline">
      <li
        v-for="(v,k) in dataTimeline"
        class="g2joy-timeline-item"
        :class="{active :v.isActive}"
      >
        <div
          v-if="k !=dataTimeline.length -1"
          class="g2joy-timeline__tail"
        ></div>
        <div class="g2joy-timeline__node g2joy-timeline__node--large"></div>
        <div class="g2joy-timeline__wrapper">
          <div class="g2joy-timeline__wrapper--content">
            {{v.content}}
          </div>
          <div class="g2joy-timeline__wrapper--timestamp">
            {{v.timestamp}}
          </div>

        </div>

      </li>
    </ul>
  </div>
</template>

<script>
  export default {
    props: {
      dataTimeline: {
        type: [Array, Object],
      },
    },
    data () {
      return {
        // dataTimeLine: [
        //   {
        //     id: 1,
        //     content: 'step1',
        //     timestamp: "at 09:30 05/01/2021",
        //     isActive: true,
        //     isPayHotel: false,
        //     color: "#ff6400",
        //     size: "large",
        //   },
        //   {
        //     id: 2,
        //     content: 'step2',
        //     timestamp: "8888248223",
        //     isActive: false,
        //     isPayHotel: true,
        //     color: "#d1d1d1",
        //     size: "large",
        //   },
        //   {
        //     id: 3,
        //     content: 'step3',
        //     timestamp: "before 10:00 05/01/2021",
        //     isActive: false,
        //     isPayHotel: false,
        //     color: "#d1d1d1",
        //     size: "large",
        //   },
        // ],
      }
    },
    created () {

    },
  }
</script>
