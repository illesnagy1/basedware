<script lang="ts">
    import zxcvbn from "zxcvbn";
    import { enhance } from '$app/forms';

    let { form } = $props();
    let localpartJID: string = $state("");
    let fullJID: string = $derived.by(() => `${localpartJID}@basedware.xyz`);

    function validateJID(jid: string): boolean {
        const jidRegex = /^[^\s@]+@[^\s@/]+(?:\/.*)?$/;
        return jidRegex.test(jid);
    }

    let jidErrorMessage = $state("");

    let password: string = $state("");
    let token: string = $state("example-token");
    let submitting = $state(false);

    let passwordStrength = $derived.by(() => { let result = zxcvbn(password); return result.score; });
    let passwordFeedback = $derived(zxcvbn(password).feedback.suggestions.join("\n"));

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
  <div class="card bg-white mt-10 sm:mx-auto sm:w-full sm:max-w-sm dark:bg-mist-800">
    <form method="POST" class="space-y-6" use:enhance={({ formData, cancel }) => {
        submitting = true;
        formData.set("JID", `${fullJID}`);
        return async ({ update }) => {
          await update();
          submitting = false;
        }
    }}>
      <div>
        <label for="JID" class="block nb-label">Jabbra ID</label>
        <div class="mt-2">
            <div class="flex flex-row justify-center items-start gap-2">
                <input bind:value={localpartJID} onblur={() => jidErrorMessage = validateJID(fullJID) ? "" : "Invalid Jabbra ID format."} oninput={() => jidErrorMessage = ""} placeholder="Enter your Jabbra ID" id="JID" type="text" name="JID"  class="block w-full text-sm nb-input {jidErrorMessage && 'text-red-500 border-red-500'} placeholder:text-sm" />
                <div class="my-auto">
                    <div class="block font-weight-700 text-sm text-gray-500 m-0">@basedware.xyz</div>
                </div>
            </div>
          {#if jidErrorMessage}
            <label for="JID" class="block nb-label text-sm text-red-500 mt-2">{jidErrorMessage}</label>
          {/if}
        </div>
      </div>

      <div>
        <label for="password" class="block nb-label">Password</label>
        <div class="mt-2">
            <div class="flex flex-row justify-center items-start gap-2">
                <input bind:value={password} placeholder="Enter your password" id="password" type="password" name="password" autocomplete="current-password" class="block w-full text-sm nb-input placeholder:text-sm" />
            </div>
          <div class="w-full h-2 mt-2 bg-gray-200">
            <div class={`h-full ${passwordStrengthColor}`} style={`width: ${((passwordStrength + 1) / 5) * 100}%`}></div>
          </div>
          <p class="text-sm text-gray-500 mt-2">{passwordFeedback}</p>
        </div>
      </div>

      <div>
        <label for="token" class="block nb-label">Invitation Token</label>
        <div class="mt-2">
            <div class="flex flex-row justify-center items-start gap-2">
                <input bind:value={token} readonly id="token" type="text" name="token" class="block w-full text-sm text-gray-500 nb-input placeholder:text-sm" />
            </div>
          <label for="token" class="block nb-label text-sm text-gray-500 mt-2">error</label>
        </div>
      </div>


      <div>
        <button type="submit" class="btn bg-blue disabled:opacity-50 disabled:cursor-not-allowed disabled:bg-gray-500" disabled={!!jidErrorMessage || (passwordStrength < 3) || submitting}>{submitting ? 'Submitting...' : 'Register'}</button>
      </div>
    </form>
  </div>
</div>