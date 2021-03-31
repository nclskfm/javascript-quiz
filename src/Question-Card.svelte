<script>
  import marked from 'marked';
  import { createEventDispatcher } from 'svelte';
  import { Accordion, AccordionItem } from 'carbon-components-svelte';

  export let question;

  const dispatch = createEventDispatcher();

  function click(answer) {
    if (question.clickedAnswer) {
      return;
    }

    dispatch('answerClicked', {
      id: question.id,
      clickedAnswer: answer,
      isCorrect: answer === question.correctAnswer,
    });
  }
</script>

<div class="card">
  <h3>({question.id}) {@html marked.parseInline(question.title)}</h3>
  <p>{@html marked(question.body)}</p>
  <div>
    {#each question.answers as answer}
      <button
        on:click={click(answer.char)}
        class:correct={answer.char === question.correctAnswer &&
          question.clickedAnswer}
        class:incorrect={answer.char !== question.correctAnswer &&
          answer.char === question.clickedAnswer}
        class:clicked={!!question.clickedAnswer}
        >{answer.char} | {@html marked.parseInline(answer.text)}</button
      >
    {/each}
  </div>
  <div class="explanation-wrapper">
    <Accordion>
      <AccordionItem disabled={!question.clickedAnswer}>
        <div slot="title">
          <h5>Show explanation</h5>
        </div>
        <p class="explanation">
          {@html marked(question.explanation)}
        </p>
      </AccordionItem>
    </Accordion>
  </div>
</div>

<style>
  .card {
    padding: 16px;
    box-shadow: 0px 3px 1px -2px rgb(0 0 0 / 40%),
      0px 2px 2px 0px rgb(0 0 0 / 28%), 0px 1px 5px 0px rgb(0 0 0 / 24%);
    border-radius: 8px;
  }

  button {
    width: 100%;
    background-color: white;
    padding: 8px;
    border-radius: 4px;
    box-sizing: border-box !important;
    box-shadow: 0px 2px 1px -1px rgb(0 0 0 / 10%),
      0px 1px 1px 0px rgb(0 0 0 / 7%), 0px 1px 3px 0px rgb(0 0 0 / 6%);
  }

  button:hover:not(.clicked) {
    background-color: #eee;
    cursor: pointer;
  }

  .correct {
    border: 2px solid darkgreen;
    background-color: rgba(0, 100, 0, 0.25);
  }

  .incorrect {
    border: 2px solid rgb(100, 0, 0);
    background-color: rgba(100, 0, 0, 0.25);
  }

  .explanation-wrapper {
    margin-top: 16px;
  }

  :global(div.bx--accordion__content) {
    padding: 1rem !important;
  }
  :global(.explanation > p:not(:last-child)) {
    margin-bottom: 8px;
  }
</style>
