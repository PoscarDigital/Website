<template>
    <div class="relative w-screen h-screen overflow-hidden">
      <!-- Gradient Overlay -->
      <div class="absolute inset-0 bg-gradient-to-r from-black via-transparent to-black opacity-50 z-10"></div>
  
      <!-- Slides Container with Smooth Transition and Bounce Effect -->
      <div
        class="flex transition-transform duration-1000 ease-in-out"
        :class="{ 'bounce': bounce }"
        :style="{ transform: `translateX(-${current * 100}%)` }"
      >
        <div v-for="(image, index) in images" :key="index" class="w-full h-screen flex-shrink-0">
          <img :src="image" :alt="`Slide ${index + 1}`" class="w-full h-full object-cover" />
        </div>
      </div>
  
      <!-- Navigation Buttons -->
      <button @click="prevSlide" aria-label="Previous slide" 
        class="absolute top-1/2 left-8 -translate-y-1/2 bg-white p-3 rounded-full shadow-md z-20 hover:bg-gray-200">
        ❮
      </button>
      <button @click="nextSlide" aria-label="Next slide" 
        class="absolute top-1/2 right-8 -translate-y-1/2 bg-white p-3 rounded-full shadow-md z-20 hover:bg-gray-200">
        ❯
      </button>
  
      <!-- Navigation Dots -->
      <div class="absolute bottom-6 left-1/2 transform -translate-x-1/2 flex space-x-2 z-20">
        <span
          v-for="(image, index) in images"
          :key="index"
          @click="goToSlide(index)"
          :class="['h-4 w-4 rounded-full', index === current ? 'bg-white' : 'bg-gray-500 hover:bg-white']"
          class="cursor-pointer transition-colors duration-300"
          aria-label="Navigate to slide"
        ></span>
      </div>
    </div>
  </template>
  
  <script>
  export default {
    data() {
      return {
        current: 0,
        images: ['../pp2.png', '../pp1jpg', '../pp.jpg'],
        autoplay: true,
        interval: null,
        bounce: false,
      };
    },
    computed: {
      length() {
        return this.images.length;
      },
    },
    methods: {
      nextSlide() {
        this.current = (this.current === this.length - 1) ? 0 : this.current + 1;
        this.triggerBounce();
      },
      prevSlide() {
        this.current = (this.current === 0) ? this.length - 1 : this.current - 1;
        this.triggerBounce();
      },
      goToSlide(index) {
        this.current = index;
        this.triggerBounce();
      },
      triggerBounce() {
        this.bounce = true;
        setTimeout(() => {
          this.bounce = false;
        }, 1000); // Duration matches bounce animation time
      },
      startAutoplay() {
        this.interval = setInterval(() => {
          this.nextSlide();
        }, 3000); // Adjust as needed for smooth autoplay timing
      },
      stopAutoplay() {
        clearInterval(this.interval);
        this.interval = null;
      },
    },
    mounted() {
      if (this.autoplay) {
        this.startAutoplay();
      }
    },
    beforeDestroy() {
      this.stopAutoplay();
    },
  };
  </script>
  
  <style scoped>
  /* Smooth transition for slide container */
  .flex {
    transition: transform 1s ease-in-out;
  }
  
  /* Bounce effect */
  .bounce {
    animation: bounce 1s ease;
  }
  
  @keyframes bounce {
    0%, 100% {
      transform: scale(1);
    }
    50% {
      transform: scale(1.05);
    }
  }
  </style>
  