<template>
  <div 
    class="my-popover"
    :class="customPopoverClass"
  >
    <div 
      class="selected" 
      aria-describedby="options"
    >
      <slot 
        class="popover-content" 
        name="popover-content" 
      />
    </div>
    <div 
      ref='overlay'
      class="options"
      role="options"
    >
      <slot    
        class="popover-overlay" 
        name="popover-overlay" 
      />
    </div>
  </div>
</template>
<script>
export default {
  props: {
    customPopoverClass: {
      type: String,
      default: '',
    },
  },
  data() {
    return {
      elPopover: null,
    }
  },
  created() {
  },
  mounted() {
    this.elPopover = document.getElementsByClassName('options');

    // const tooltips = document.querySelectorAll('.my-popover');//get all popover

    // tooltips.forEach(tooltip => {
    //   const selected = tooltip.querySelector('.selected');
    //   const options  = tooltip.querySelector('.options');
      
    //   Popper.createPopper(selected, options,{
    //     modifiers: [
    //       {
    //         name: 'offset',
    //         options: {
    //           offset: [0, 10],
    //         },
    //       },
    //     ],
    //   });
    // });
  },
  updated() {
  },
  methods: {
    show(){
      this.hideAllTimePickerDropdownBox();
      this.$refs.overlay.classList.add('is-show');
    },

    hide(){
      this.$refs.overlay.classList.remove('is-show');
    },

    hideAllTimePickerDropdownBox() {
      if(this.elPopover.length) {
        for( const elItem of this.elPopover ) {
          elItem.classList.remove('is-show');
        }
      }
    }, // hideAllTimePickerDropdownBox()
  },
}
</script>
