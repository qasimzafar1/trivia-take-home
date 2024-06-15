import { defineStore } from 'pinia'

interface QuestionOption {
  id: number
  value: string
  isCorrect: boolean
  questionId: number
}

export interface Question {
  id: number
  question: string
  options: QuestionOption[]
}

interface State {
  question: Question | null
}

export const useMatchStore = defineStore('match', {
  state: (): State => ({
    question: null
  }),
  actions: {
    setQuestion(question: Question) {
      this.question = question
    },
    clearQuestion() {
      this.question = null
    }
  }
})
