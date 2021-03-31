import { writable, derived } from 'svelte/store';

export const questions = writable([]);

export const counter = derived(questions, ($questions) => {
  return {
    questions: $questions.length,
    correct: $questions.filter((question) => question.isCorrect).length,
    incorrect: $questions.filter((question) => question.isCorrect === false)
      .length,
  };
});
