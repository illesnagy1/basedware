<script lang="ts">
  interface Props {
    color?: string;
    size?: string | number;
  }

  let { color = 'currentColor', size = 24 }: Props = $props();
</script>

<svg fill={color} width={size} height={size} role="img" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
  <title>Windows</title>
  <path
    d="M 23.647669,0.3263701 11.064931,2.1349749 V 11.54729 L 23.647669,11.47056 Z M 9.9839219,2.2857657 0.352331,3.5707708 v 8.0375482 l 9.6315909,-0.05481 z M 0.352331,12.39905 v 8.03293 l 9.6315451,1.295755 v -9.262119 z m 10.7126,9.480709 12.582738,1.824481 V 12.567178 l -12.582738,-0.09393 z"
  />
</svg>
