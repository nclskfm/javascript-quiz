<script>
  import { questions, counter } from './scripts/stores.js';
  import { getQuestions, handleAnswer } from './scripts/questions.js';
  import { PaginationNav } from 'carbon-components-svelte';
  import { afterUpdate } from 'svelte';
  import QuestionCard from './Question-Card.svelte';
  import hljs from 'highlight.js/lib/core';
  import javascript from 'highlight.js/lib/languages/javascript';

  hljs.registerLanguage('javascript', javascript);

  getQuestions();

  let page;
  let questionsPerPage = window.innerWidth > 600 ? 10 : 5;
  let pageShown = window.innerWidth > 600 ? 7 : 4;

  afterUpdate(() => {
    hljs.highlightAll();
  });
</script>

<div class="container-wrapper">
  <div class="pagination-wrapper">
    <PaginationNav
      bind:page
      total={Math.ceil($counter.questions / questionsPerPage)}
      shown={pageShown}
    />
  </div>
  <div class="container">
    {#each $questions.slice(page * questionsPerPage, (page + 1) * questionsPerPage) as question (question.id)}
      <div class="card-wrapper">
        <QuestionCard {question} on:answerClicked={handleAnswer} />
      </div>
    {/each}

    <div class="pagination-wrapper">
      <PaginationNav
        bind:page
        total={Math.ceil($counter.questions / questionsPerPage)}
        shown={pageShown}
      />
    </div>
  </div>
</div>

<style>
  .container-wrapper {
    margin: 50px 16px 0px 16px;
    display: flex;
    flex-direction: column;
    justify-content: start;
    align-items: center;
  }
  .container {
    max-width: 1000px;
    width: 100%;
    margin: 0 16px;
    display: flex;
    flex-direction: column;
    justify-content: start;
    align-items: stretch;
  }
  .card-wrapper {
    margin-bottom: 24px;
  }
  .pagination-wrapper {
    width: 100%;
    height: auto;
    display: flex;
    flex-direction: row;
    justify-content: center;
    margin: 16px 0;
  }
  .pagination-wrapper:last-child {
    /* to compensate the margin-bottom of the last .card-wrapper (`card-wrapper:not(:last-child)` does not work) */
    margin-top: -8px;
  }
</style>
