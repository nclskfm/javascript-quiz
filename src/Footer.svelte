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
      ><a href="https://github.com/nclskfm" target="_blank">by nclskfm</a></span
    >
    <span
      ><a href="https://github.com/nclskfm/javascript-quiz" target="_blank"
        >source code</a
      ></span
    >
    <span
      ><a
        href="https://github.com/lydiahallie/javascript-questions/"
        target="_blank">questions by lydiahallie</a
      >
    </span>
    <span
      ><a href="https://svelte.dev/" target="_blank">made with svelte</a></span
    >
    <span><a href="/#" on:click={openSettings}>settings</a></span>
    <span
      ><a href="https://www.niclaskaufmann.de/impressum.html" target="_blank"
        >impressum</a
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
