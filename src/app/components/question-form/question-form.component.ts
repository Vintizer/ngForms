import { FormArray, FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { Component, OnInit } from '@angular/core';

interface IQuestion {
  question: string;
  answers: string[];
}
const initialQuestion: IQuestion[] = [
  {
    question: 'What framework is the best?',
    answers: ['Angular', 'React', 'Vue']
  },
  {
    question: 'What your favorite city?',
    answers: ['Kharkiv', 'Odessa', 'Poltava']
  },
  {
    question: 'What car brand do you like?',
    answers: ['Renault', 'Toyota', 'BMW']
  }
];

@Component({
  selector: 'app-question-form',
  templateUrl: './question-form.component.html',
  styleUrls: ['./question-form.component.sass']
})
export class QuestionFormComponent implements OnInit {
  public questForm: FormGroup;
  public addQuestForm: FormGroup;

  public constructor(private fb: FormBuilder) {}
  public ngOnInit(): void {
    this.formInit();
  }
  public formInit(): void {
    this.questForm = this.fb.group({
      questions: this.fb.array(initialQuestion.map(this.createQuestion.bind(this))),
    });
    this.addQuestForm = this.fb.group({
      question: ['', Validators.required],
      answers: ['', Validators.required]
    });
  }
  public createQuestion(question: IQuestion): FormGroup {
    return this.fb.group({
      question: question.question,
      answers: this.fb.array(question.answers),
      answerVal: ''
    });
  }

  public onSubmit(): void {}

  public addQuestion(): void {
    const question: string = this.addQuestForm.controls['question'].value;
    const answers: string = this.addQuestForm.controls['answers'].value;
    const answersArray: string[] = answers
      .split(',')
      .map((val: string) => val.trim())
      .filter((val: string) => val);
    (this.questForm.controls['questions'] as FormArray).push(
      this.createQuestion({
        question,
        answers: answersArray
      })
    );
    this.addQuestForm.reset();
  }
  public addMyAnswer(answerVal: string, index: number): void {
    if (answerVal) {
      (this.questForm.controls['questions']).controls[index].controls['answers'].push(new FormControl(answerVal));
    }
  }
}
