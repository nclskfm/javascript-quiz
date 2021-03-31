import { questions } from './stores.js';
import { getCookie, setCookie } from './cookies.js';
import { get } from 'svelte/store';

export function getQuestions() {
  let request = new XMLHttpRequest();
  request.open(
    'GET',
    'https://raw.githubusercontent.com/lydiahallie/javascript-questions/master/README.md'
  );
  request.send();
  request.onreadystatechange = (e) => {
    if (request.readyState === 4 && request.status === 200) {
      const unparsed = request.responseText.split(/(?=#{6} [1-9])/).slice(1);
      questions.set(parseQuestions(unparsed));
      loadAnsweredQuestionsFromStorage();
    }
  };
}

function parseQuestions(unparsed) {
  return unparsed.map((question) => {
    const indexOfFirstDot = question.indexOf('.');
    const indexOfA = question.indexOf('- A: ');
    const indexOfDetails = question.indexOf('<details>', indexOfA);

    const id = question.slice(7, indexOfFirstDot);
    const title = question.slice(indexOfFirstDot + 2, question.indexOf('\n'));
    const body = question.slice(question.indexOf('\n') + 2, indexOfA - 2);
    const answers = question
      .slice(indexOfA, indexOfDetails - 2)
      .split('\n')
      .map((answer) => {
        return {
          char: answer[2],
          text: answer.slice(5),
        };
      });

    const spoiler = question.slice(indexOfDetails);
    const indexOfCorrectAnswer = spoiler.indexOf('#### Answer: ') + 13;

    const correctAnswer = spoiler[indexOfCorrectAnswer];

    const explanation = spoiler.slice(
      indexOfCorrectAnswer + 3,
      spoiler.indexOf('</p>', indexOfCorrectAnswer) - 1
    );

    const obj = { id, title, body, answers, correctAnswer, explanation };
    return obj;
  });
}

export function handleAnswer(event) {
  questions.update((questions) => {
    return questions.map((question) => {
      if (question.id === event.detail.id) {
        question.clickedAnswer = event.detail.clickedAnswer;
        question.isCorrect = event.detail.isCorrect;
      }
      return question;
    });
  });
  saveAnsweredQuestionsToStorage();
}

function loadAnsweredQuestionsFromStorage() {
  if (!getCookie('cookiesAllowed') || !getCookie('questions')) {
    return false;
  }
  const answeredQuestions = JSON.parse(getCookie('questions'));

  questions.update((questions) => {
    return questions.map((q) => {
      const answer = answeredQuestions.find((a) => a.startsWith(q.id));
      if (!answer) {
        return q;
      }
      q.clickedAnswer = answer.split('-')[1];
      q.isCorrect = q.clickedAnswer === q.correctAnswer;
      return q;
    });
  });
  return true;
}

function saveAnsweredQuestionsToStorage() {
  const q = get(questions);
  if (!getCookie('cookiesAllowed') || !q?.length) {
    return;
  }
  const answeredQuestions = q
    .filter((a) => a.clickedAnswer)
    .map((a) => a.id + '-' + a.clickedAnswer);
  // fehler
  if (!answeredQuestions?.length) {
    return;
  }
  setCookie('questions', answeredQuestions);
}
