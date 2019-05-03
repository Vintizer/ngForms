import { Component, OnInit } from '@angular/core';
import { AbstractControl, FormBuilder, FormControl, FormGroup, ValidationErrors, Validators } from '@angular/forms';

function createRangeArray(begin: number, end: number): number[] {
  const res: number[] = [];
  for (let i: number = begin; i <= end; i++) {
    res.push(i);
  }
  return res;
}

@Component({
  selector: 'app-registration-form',
  templateUrl: './registration-form.component.html',
  styleUrls: ['./registration-form.component.css']
})
export class RegistrationFormComponent implements OnInit {
  public regForm: FormGroup;
  public monthes: string[] = [
    'January',
    'February',
    'March',
    'April',
    'May',
    'June',
    'July',
    'August',
    'September',
    'October',
    'November',
    'December'
  ];
  public days: number[] = createRangeArray(1, 31);
  public years: number[] = createRangeArray(1950, 2010);

  public constructor(private fb: FormBuilder) {}

  public ngOnInit(): void {
    this.formInit();
    this.onChangesMonth();
  }
  public formInit(): void {
    this.regForm = this.fb.group(
      {
        name: ['', [Validators.required, Validators.pattern(/^[A-z0-9]+$/), Validators.minLength(4)]],
        surname: [''],
        email: ['', [Validators.required, Validators.email]],
        password: ['', [Validators.required, this.passwordValidator]],
        passwordConf: ['', [Validators.required]],
        birthday: this.fb.group({
          day: [this.days[0]],
          month: [this.monthes[0]],
          year: [this.years[30]]
        }),
        gender: ['', [Validators.required]]
      },
      {
        validator: this.passwordMatched
      }
    );
  }
  public onChangesMonth(): void {
    (this.regForm.controls['birthday'] as FormGroup).controls['month'].valueChanges.subscribe((newMonth: string) => {
      switch (newMonth) {
        case this.monthes[1]:
          this.days = createRangeArray(1, 28);
          break;
          case this.monthes[0]:
          case this.monthes[2]:
          case this.monthes[4]:
          case this.monthes[6]:
          case this.monthes[7]:
          case this.monthes[9]:
          case this.monthes[11]:
        this.days = createRangeArray(1, 31);
          break;
          case this.monthes[3]:
          case this.monthes[5]:
          case this.monthes[8]:
          case this.monthes[10]:
        this.days = createRangeArray(1, 30);
          break;
          default:
          break;
      }
      const day: AbstractControl = (this.regForm.controls['birthday'] as FormGroup).controls['day'];
      if (Number(day.value) > this.days.length) {
        day.setValue(1);
      }
    });
  }
  public isControlInvalid(controlName: string): boolean {
    const control: AbstractControl = this.regForm.controls[controlName];
    const result: boolean = control.invalid && control.touched;
    return result;
  }
  public getErrors(controlName: string): ValidationErrors | null {
    const control: AbstractControl = this.regForm.controls[controlName];
    return control.errors ? control.errors : null;
  }
  public isPasswordEqual(): boolean {
    const passControl: AbstractControl = this.regForm.controls['password'];
    const passConfControl: AbstractControl = this.regForm.controls['passwordConf'];
    const isPasswordValid: boolean = passControl.valid;
    const isPasswordConfReadyForCompare: boolean = passConfControl.touched && passConfControl.value;
    const isComparing: boolean = isPasswordConfReadyForCompare && isPasswordValid;
    if (isPasswordConfReadyForCompare && isPasswordValid) {
      return passControl.value === passConfControl.value;
    }
    return true;
  }
  public onSubmit(): void {
    const controls: {
      [key: string]: AbstractControl;
    } = this.regForm.controls;

    if (this.regForm.invalid) {
      Object.keys(controls).forEach((controlName: string) => controls[controlName].markAsTouched());
      return;
    }
    console.log('HERE');
    /** TODO: Обработка данных формы */
    // console.log(this.myFirstReactiveForm.value);
  }

  private passwordValidator(control: FormControl): ValidationErrors {
    const value: string = control.value;
    const isCapitalPresent: boolean = /[A-Z]/.test(value);
    const isLowerPresent: boolean = /[a-z]/.test(value);
    const isLengthCorrect: boolean = value.length > 7;
    const isNumberPresent: boolean = /[0-9]/.test(value);
    if (value) {
      if (!(isNumberPresent && isCapitalPresent && isLowerPresent)) {
        return { invalidPassword: 'Password should contents at least one capital and lower symbols and number.' };
      } else if (!isLengthCorrect) {
        return { invalidPassword: 'Password should has length more than 7 symbols.' };
      }
    }
    return null;
  }

  private passwordMatched(form: AbstractControl): void {
    const password: AbstractControl = form.get('password');
    const passwordConf: AbstractControl = form.get('passwordConf');
    if (password.value !== passwordConf.value) {
      form.get('passwordConf').setErrors({ MatchPassword: true });
    } else {
      form.get('passwordConf').setErrors(null);
    }
  }
}
