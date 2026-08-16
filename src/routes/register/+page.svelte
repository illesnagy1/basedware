<script lang="ts">
  import zxcvbn from "zxcvbn";
  import Toast from "$lib/Toast.svelte";
  import Button from "$lib/Button.svelte";
  import { enhance } from "$app/forms";
  import { page } from "$app/state";

  const tokenURL = page.url.searchParams.get("t");

  let { form } = $props();
  let username: string = $state("");

  function validateJID(username: string): boolean {
    const jidRegex =
      /^[^"&'/:<>@\s\x00-\x1F\x7F]{1,1023}?$/;
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
</script>

<div class="flex min-h-full flex-col justify-center px-6 py-12 lg:px-8">
  <div
    class="card bg-white mt-10 sm:mx-auto sm:w-full sm:max-w-sm dark:bg-mist-800"
  >
    {#if form?.error}
      <Toast class="nb-toast-error" icon="✗">{form?.error}</Toast> 
    {/if}

    {#if form?.success}
      <Toast class="nb-toast-success" icon="✓">Registered successfully.</Toast>
    {/if}
    <form
      method="POST"
      class="space-y-6"
      use:enhance={() => {
        submitting = true;
        return async ({ update }) => {
          await update();
          submitting = false;
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
              <div class="block font-weight-700 text-sm text-gray-500 m-0">
                @basedware.xyz
              </div>
            </div>
          </div>
          {#if jidErrorMessage}
            <label for="JID" class="block nb-label text-sm text-red-500 mt-2"
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
        <label for="token" class="block nb-label">Invitation Token</label>
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
        disabled={!!jidErrorMessage || passwordStrength < 3 || submitting}
        >{submitting ? "Submitting..." : "Register"}</Button
      >
    </form>
  </div>
</div>
