<script>
  import { createEventDispatcher } from 'svelte';

  const dispatch = createEventDispatcher();

  function openSettings() {
    dispatch('openSettings');
  }
</script>

<footer>
  <div class="container">
    <span
      ><a href="https://github.com/nclskfm" target="_blank" rel="noopener"
        >by nclskfm</a
      ></span
    >
    <span>
      <a
        href="https://www.buymeacoffee.com/nclskfm"
        target="_blank"
        rel="noopener"
        ><img
          src="https://cdn.buymeacoffee.com/buttons/v2/default-blue.png"
          alt="Buy Me A Coffee"
          height="40px"
        /></a
      >
    </span>
    <span
      ><a
        href="https://github.com/nclskfm/javascript-quiz"
        target="_blank"
        rel="noopener">source code</a
      ></span
    >
    <span
      ><a
        href="https://github.com/lydiahallie/javascript-questions/"
        target="_blank"
        rel="noopener">questions by lydiahallie</a
      >
    </span>
    <span
      ><a href="https://svelte.dev/" target="_blank" rel="noopener"
        >made with svelte</a
      ></span
    >
    <span><a href="/#" on:click={openSettings}>settings</a></span>
    <span
      ><a
        href="https://www.niclaskaufmann.de/impressum.html"
        target="_blank"
        rel="noopener">impressum</a
      ></span
    >
  </div>
</footer>

<style>
  footer {
    display: flex;
    width: 100%;
    flex-direction: row wrap;
    justify-content: space-around;
    border-top: 1px solid #aaa;
    padding: 16px;
  }
  .container {
    width: 100%;
    max-width: 1000px;
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    align-items: center;
  }
  span {
    text-align: center;
  }
  @media (max-width: 600px) {
    .container {
      flex-direction: column;
    }
    .container > span:not(:last-child) {
      margin-bottom: 16px;
    }
  }
</style>
