<script>
  import { counter } from './scripts/stores.js';
</script>

<nav>
  <div class="wrapper">
    <span class="correct">Correct: {$counter.correct}</span>
    <span class="incorrect">Incorrect: {$counter.incorrect}</span>
    <span class="remaining"
      >Remaining: {$counter.questions -
        $counter.correct -
        $counter.incorrect}</span
    >
  </div>
</nav>

<style>
  nav {
    width: 100%;
    position: fixed;
    z-index: 100;
    padding: 0 16px;
    background-color: #eee;
    box-shadow: 0px 5px 5px -3px rgb(0 0 0 / 20%),
      0px 8px 10px 1px rgb(0 0 0 / 14%), 0px 3px 14px 2px rgb(0 0 0 / 12%);
    top: 0;
    height: 50px;
    display: flex;
    flex-direction: row;
    justify-content: center;
    align-items: center;
  }

  .wrapper {
    max-width: 1000px;
    width: 100%;
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    align-items: center;
  }

  nav span {
    font-size: 150%;
    font-weight: bold;
  }

  .correct {
    color: darkgreen;
  }
  .incorrect {
    color: darkred;
  }
  .remaining {
    color: #222;
  }
</style>
