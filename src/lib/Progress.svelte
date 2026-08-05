<script lang="ts">
    let scrolled = $state(0);
</script>
<svelte:window onscroll={() => {
    const winScroll = document.documentElement.scrollTop
    const height =
      document.documentElement.scrollHeight -
      document.documentElement.clientHeight
    scrolled = height > 0 ? (winScroll / height) * 100 : 0
}}/>

<div
    class="fixed left-0 h-2 bg-pink z-50"
    style="width: {scrolled}%"
></div>
