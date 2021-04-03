import { writable, derived, get } from 'svelte/store';

export const questions = writable([]);

export const counter = derived(questions, ($questions) => {
  const oldCounter = get(counter); 
  const newCorrect = $questions.filter((question) => question.isCorrect).length
  const newIncorrect = $questions.filter((question) => question.isCorrect === false).length;
  let increased = undefined;
  if (oldCounter) {
    if (newCorrect > oldCounter.correct) {
      increased = 'correct';
    } else if (newIncorrect > oldCounter.incorrect) {
      increased = 'incorrect';
    }
  } else if (newCorrect) {
    increased = 'correct';
  } else if (newIncorrect) {
    increased = 'incorrect';
  }
    
  return {
    questions: $questions.length,
    correct: newCorrect,
    incorrect: newIncorrect,
    increased
  };
});
