<script>
  import Header from './Header.svelte';
  import Settings from './Settings.svelte';
  import QuestionHandler from './Question-Handler.svelte';
  import Footer from './Footer.svelte';
  import { getCookie } from './scripts/cookies.js';
  import 'carbon-components-svelte/css/white.css';
  import 'highlight.js/styles/github.css';

  let showSettings = !getCookie('cookiesAllowed');
</script>

{#if showSettings}
  <Settings on:close={() => (showSettings = false)} />
{:else}
  <Header />
  <QuestionHandler />
  <Footer on:openSettings={() => (showSettings = true)} />
{/if}
