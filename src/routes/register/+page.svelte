<script lang="ts">
  import zxcvbn from "zxcvbn";
  import Toast from "$lib/Toast.svelte";
  import Button from "$lib/Button.svelte";
  import { enhance } from "$app/forms";
  import { page } from "$app/state";
  import { applications } from "$lib/apps";
  import AppCard from "$lib/apps/AppCard.svelte";
  import { Platform, platforms } from "$lib/platforms";
  import { onMount } from "svelte";
  import type { Attachment } from 'svelte/attachments';
  import { slide } from "svelte/transition";

  const tokenURL = page.url.searchParams.get("t");

  let { form } = $props();
  let username: string = $state("");

  function validateJID(username: string): boolean {
    const jidRegex = /^[^"&'/:<>@\s\x00-\x1F\x7F]{1,1023}?$/;
    return jidRegex.test(username);
  }

  let jidErrorMessage = $state("");

  let password: string = $state("");
  let token: string = $state(tokenURL || "");
  let submitting = $state(false);

  let passwordStrength = $derived.by(() => {
    let result = zxcvbn(password, [username]);
    return result.score;
  });
  let passwordFeedback = $derived(
    zxcvbn(password, [username]).feedback.suggestions.join("\n"),
  );

  let passwordStrengthColor = $derived.by(() => {
    switch (passwordStrength) {
      case 0:
        return "bg-red-500";
      case 1:
        return "bg-orange-500";
      case 2:
        return "bg-yellow-500";
      case 3:
        return "bg-green-500";
      case 4:
        return "bg-blue-500";
      default:
        return "bg-gray-500";
    }
  });

  function detectOS(): Platform | undefined {
    let ua = navigator.userAgent.toLowerCase();
    if (ua.includes("win")) return Platform.Windows;
    if (ua.includes("mac")) return Platform.macOS;
    if (ua.includes("linux")) return Platform.Linux;
    if (ua.includes('iphone') || ua.includes('ipad')) return Platform.iOS;
    if (ua.includes("android")) return Platform.Android;
    return undefined;
  }

  let userOS: Platform | undefined = $state(undefined);
  let filterOS: Platform | "All platforms" = $state("All platforms");

  onMount(() => {
    userOS = detectOS();
    if (userOS) filterOS = userOS;
  });

  let filteredApplications = $derived.by(() => {
    if (filterOS === "All platforms") {
      return applications;
    }
    return applications.filter((app) =>
      app.platforms.some((platform) => platform === filterOS),
    );
  });

  let currentStep = $state(1);

  function pickaboo(options: { threshold?: number } = {}): Attachment {
    return (node) => {
      const threshold = options.threshold || 0.15;

      const observer = new IntersectionObserver((entries) => {
        const entry = entries[0];

        if (entry.isIntersecting && currentStep === 2) {
          currentStep = 3;
        }
        if (!entry.isIntersecting && currentStep === 3) {
          currentStep = 2;
        }
      }, { ...options, threshold });

      observer.observe(node);

      return () => observer.disconnect();
    };
  }
</script>

<div class="flex min-h-full flex-col px-6 py-12 lg:px-8">
  <div class="timeline md:w-3/4">
    <div class="timeline-item">
      <div class="timeline-dot"></div>
      {#if currentStep == 1}
        <div transition:slide>
          <span class="timeline-step bg-blue-800">Step 1:</span>
          <h3 class="timeline-title">Create Your Account</h3>
          <p class="timeline-text">
            Your Jabbra ID is your unique identifier on the platform. It should
            be memorable and easy to share with others.
          </p>
          <div class="card bg-white mt-10 dark:bg-mist-800">
            {#if form?.error}
              <Toast class="nb-toast-error" icon="✗">{form?.error}</Toast>
            {/if}

            {#if form?.success}
              <Toast class="nb-toast-success" icon="✓"
                >Registered successfully.</Toast
              >
            {/if}
            <form
              method="POST"
              class="space-y-6"
              use:enhance={() => {
                submitting = true;
                return async ({ update, result }) => {
                  submitting = false;
                  await update();
                  if (result.type === "success") {
                    setTimeout(()=>{
                      currentStep = 2;
                    }, 3500)
                  }
                };
              }}
            >
              <div>
                <label for="JID" class="block nb-label">Jabbra ID</label>
                <div class="mt-2">
                  <div class="flex flex-row justify-center items-start gap-2">
                    <input
                      bind:value={username}
                      onblur={() =>
                        (jidErrorMessage = validateJID(username)
                          ? ""
                          : "Invalid Jabbra ID format.")}
                      oninput={() => (jidErrorMessage = "")}
                      placeholder="Enter your Jabbra ID"
                      id="JID"
                      type="text"
                      name="JID"
                      class="block w-full text-sm nb-input {jidErrorMessage &&
                        'text-red-500 border-red-500'} placeholder:text-sm"
                    />
                    <div class="my-auto">
                      <div
                        class="block font-weight-700 text-sm text-gray-500 m-0"
                      >
                        @basedware.xyz
                      </div>
                    </div>
                  </div>
                  {#if jidErrorMessage}
                    <label
                      for="JID"
                      class="block nb-label text-sm text-red-500 mt-2"
                      >{jidErrorMessage}</label
                    >
                  {/if}
                </div>
              </div>

              <div>
                <label for="password" class="block nb-label">Password</label>
                <div class="mt-2">
                  <div class="flex flex-row justify-center items-start gap-2">
                    <input
                      bind:value={password}
                      placeholder="Enter your password"
                      id="password"
                      type="password"
                      name="password"
                      autocomplete="current-password"
                      class="block w-full text-sm nb-input placeholder:text-sm"
                    />
                  </div>
                  <div class="w-full h-2 mt-2 bg-gray-200">
                    <div
                      class={`h-full ${passwordStrengthColor}`}
                      style={`width: ${((passwordStrength + 1) / 5) * 100}%`}
                    ></div>
                  </div>
                  <p class="text-sm text-gray-500 mt-2">{passwordFeedback}</p>
                </div>
              </div>

              <div>
                <label for="token" class="block nb-label"
                  >Invitation Token</label
                >
                <div class="mt-2">
                  <div class="flex flex-row justify-center items-start gap-2">
                    <input
                      bind:value={token}
                      readonly
                      id="token"
                      type="text"
                      name="token"
                      class="block w-full text-sm text-gray-500 nb-input placeholder:text-sm"
                    />
                  </div>
                </div>
              </div>
              <Button
                type="submit"
                class="btn-blue disabled:opacity-50 disabled:cursor-not-allowed disabled:bg-gray-500"
                disabled={!!jidErrorMessage ||
                  passwordStrength < 3 ||
                  submitting}
                >{submitting ? "Submitting..." : "Register"}</Button
              >
            </form>
          </div>
        </div>
      {/if}
    </div>
    <div class="timeline-item">
      <div class="timeline-dot"></div>
      {#if currentStep == 2}
        <div transition:slide>
          <span class="timeline-step bg-purple-800">Step 2:</span>
          <h3 class="timeline-title">Choose a Client and Download it</h3>
          <p class="timeline-text">
            After registering, you can choose a Jabber client that suits your
            needs. Since XMPP is an open protocol, there are many clients
            available for different platforms. Here is our recommendation:
          </p>
          {#if userOS}
            <div class="flex flex-row items-center gap-2">
              <p>Your detected platform: {userOS.name}</p>
              <userOS.icon size={24} />
            </div>
          {/if}
          <select
            bind:value={filterOS}
            class="nb-select ml-auto bg-white dark:bg-mist-800"
          >
            <option value="All platforms">All Platforms</option>
            {#each platforms as platform}
              <option value={platform}>{platform.name}</option>
            {/each}
          </select>

          <div
            class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mt-4"
          >
            {#each filteredApplications as app}
              <AppCard {app} />
            {/each}
          </div>
          <Button class="btn-yellow mt-5" onclick={() => { currentStep = 3; }}>I have a client! Whats next?</Button>
        </div>
      {/if}
    </div>
    <div class="timeline-item">
      <div class="timeline-dot"></div>
      {#if currentStep == 3}
       <div transition:slide>
        <span class="timeline-step bg-rose-800">Step 3:</span>
        <h3 class="timeline-title">Say Hello!</h3>
        <p class="timeline-text">
          Once you've downloaded and set up your client, you can login with your
          registered account and start chatting with your friends and family.
          Enjoy your new Jabbra ID!
        </p>
        <p class="timeline-text">
          You will also receive a little welcome message from us to get you
          started. If you have any questions or need help, feel free to reach
          out to me.
        </p>
      </div>

      <Button class="btn-pink mt-5" onclick={() => { currentStep = 2; }}>Go back</Button>
      {/if}
    </div>
  </div>
</div>
