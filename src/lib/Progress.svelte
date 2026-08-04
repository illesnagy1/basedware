<script lang="ts">
    let scrolled = $state(0);
</script>
<svelte:window on:scroll={() => {
    var winScroll = 
      document.body.scrollTop || document.documentElement.scrollTop
    var height = 
      document.documentElement.scrollHeight - 
      document.documentElement.clientHeight
    scrolled = (winScroll / height) * 100
}}/>

<div
    class="fixed left-0 w-full h-2 bg-pink z-50"
    style="width: {scrolled}%"
></div>

